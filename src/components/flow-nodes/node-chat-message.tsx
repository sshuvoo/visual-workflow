import { MessageCircle, Plus } from 'lucide-react'
import { NodeActionButtons } from './note-action-buttons'
import type { IChatMessage, INode, IPoint } from '@/types'
import {
  memo,
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from 'react'
import { NodeConnector } from './node-connector'

interface ITrigger extends IPoint {
  area: 'node' | 'cable'
}

interface Props {
  node: IChatMessage
  nodes: INode[]
  setNodes: Dispatch<SetStateAction<INode[]>>
}

export const ChatMessageNode = memo(({ node, setNodes, nodes }: Props) => {
  const startMouse = useRef<ITrigger | null>(null)
  const [position, setPosition] = useState<ITrigger | null>(null)

  const handleMouseMove = useCallback(
    (event: globalThis.MouseEvent) => {
      if (!startMouse.current) return

      if (startMouse.current.area == 'node') {
        const dx = event.clientX - startMouse.current.x
        const dy = event.clientY - startMouse.current.y

        setNodes((prev) =>
          prev.map((item) => {
            if (item.id == node.id) {
              return { ...item, x: node.x + dx, y: node.y + dy }
            } else return item
          }),
        )
      } else if (startMouse.current.area == 'cable') {
        const nearestNode = nodes.find((nodeItem) => {
          if (nodeItem.id == node.id) return false
          // sp = socket point
          const spX = nodeItem.x
          const spY = nodeItem.y + nodeItem.height / 2
          const distance = Math.sqrt(
            (spX - event.clientX) ** 2 + (spY - event.clientY) ** 2,
          )
          return distance < 30
        })
        if (nearestNode) {
          setPosition({
            area: startMouse.current.area,
            x: nearestNode.x,
            y: nearestNode.y + nearestNode.height / 2,
          })
        } else {
          setPosition({
            area: startMouse.current.area,
            x: event.clientX,
            y: event.clientY,
          })
        }
      }
    },
    [node, setNodes, nodes],
  )

  const handleMouseUp = useCallback(
    (event: globalThis.MouseEvent) => {
      if (startMouse.current && startMouse.current.area == 'cable') {
        const nearestNode = nodes.find((nodeItem) => {
          if (nodeItem.id == node.id) return false

          // sp = socket point
          const spX = nodeItem.x
          const spY = nodeItem.y + nodeItem.height / 2
          const distance = Math.sqrt(
            (spX - event.clientX) ** 2 + (spY - event.clientY) ** 2,
          )
          return distance < 30
        })
        if (nearestNode) {
          setNodes((prev) =>
            prev.map((item) => {
              if (item.id == node.id) {
                return { ...item, portId: nearestNode.id }
              } else return item
            }),
          )
        }
      }
      setPosition(null)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    },
    [handleMouseMove, nodes, node, setNodes],
  )

  const handleMouseDown = useCallback(
    (
      event: MouseEvent<HTMLDivElement | HTMLButtonElement>,
      area: 'node' | 'cable',
    ) => {
      startMouse.current = { x: event.clientX, y: event.clientY, area }
      setPosition({ area, x: event.clientX, y: event.clientY })
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [handleMouseMove, handleMouseUp],
  )

  return (
    <>
      <div
        style={{
          transform: `translate(${node.x}px, ${node.y}px)`,
        }}
        className="absolute"
      >
        <div className="group relative flex h-[100px] w-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-[#676767] bg-[#141414] ring-3 ring-transparent transition-all duration-300 hover:ring-blue-400">
          <div
            onMouseDown={(event) => {
              handleMouseDown(event, 'node')
            }}
            className="flex size-full flex-col items-center justify-center gap-2 rounded-3xl p-2"
          >
            <MessageCircle className="size-12 text-orange-500" />
            <h3 className="text-base font-semibold text-[#dcdcdc]">
              Chat Message
            </h3>
          </div>

          <div className="absolute top-1/2 -left-[5px] h-4 w-2 -translate-y-1/2 rounded bg-[#676767]" />

          <div className="absolute top-1/2 -right-[7px] flex size-3 -translate-y-1/2 items-center gap-[-8px] rounded-full bg-[#676767]">
            {node.portId == null &&
              !(position != null && position.area == 'cable') && (
                <>
                  <div className="h-[2px] min-w-[50px] bg-[#676767]" />
                  <button
                    onMouseDown={(event) => {
                      handleMouseDown(event, 'cable')
                    }}
                    className="flex size-4 items-center justify-center rounded border border-[#676767]"
                  >
                    <Plus size={14} className="text-[#676767]" />
                  </button>
                </>
              )}
          </div>

          <NodeActionButtons />
        </div>
      </div>

      {node.portId == null && position != null && position.area == 'cable' && (
        <NodeConnector
          start={{ x: node.x + 150, y: node.y + 50 }}
          end={{ x: position.x, y: position.y }}
        />
      )}
    </>
  )
})

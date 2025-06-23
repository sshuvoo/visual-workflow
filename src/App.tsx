import { useState } from 'react'
import { FlowNodeSidebar } from './components/flow-nodes/node-add-sidebar'
import type { INode } from './types'
import { ChatMessageNode } from './components/flow-nodes/node-chat-message'
import { NodeConnector } from './components/flow-nodes/node-connector'

export default function App() {
  const [nodes, setNodes] = useState<INode[]>([])

  console.log(nodes)

  return (
    <div className="bg-theme-background relative h-screen w-screen overflow-hidden select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-full"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#333333"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect fill="url(#grid)" stroke="black" width="100%" height="100%" />

        {nodes
          .filter((item) => item.portId != null)
          .map((node) => {
            const externalNode = nodes.find((item) => item.id == node.portId)!
            return (
              <NodeConnector
                end={{
                  x: externalNode.x,
                  y: externalNode.y + externalNode.height / 2,
                }}
                start={{ x: node.x + node.width, y: node.y + node.height / 2 }}
              />
            )
          })}
      </svg>

      {nodes.map((node) => (
        <ChatMessageNode
          nodes={nodes}
          setNodes={setNodes}
          node={node}
          key={node.id}
        />
      ))}

      <FlowNodeSidebar
        onAddNode={(newNode: INode) => {
          setNodes((pre) => [...pre, newNode])
        }}
      />
    </div>
  )
}

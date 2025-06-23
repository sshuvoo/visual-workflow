import type { IPoint } from '@/types'

export function NodeConnector({ start, end }: { start: IPoint; end: IPoint }) {
  const isCurveConn = end.x - start.x >= 50
  const round = 10
  const safeArea = 40
  // node half height
  const nodeH = 50
  let d: string = ''

  const arrow = `L${end.x - 8} ${end.y - 8} M${end.x} ${end.y} L${end.x - 8} ${end.y + 8}`

  if (isCurveConn) {
    const offsetX = Math.abs(end.x - start.x) * 0.5
    d = `M${start.x} ${start.y} C${start.x + offsetX} ${start.y} ${end.x - offsetX} ${end.y} ${end.x} ${end.y} ${arrow}`
  } else {
    const isVerticallyDown = end.y > start.y
    if (isVerticallyDown) {
      const isInterupt = end.y - start.y < nodeH + safeArea

      d = `M${start.x} ${start.y} H${start.x + safeArea - round} Q${start.x + safeArea} ${start.y} ${start.x + safeArea} ${start.y + round} V${start.y + nodeH + safeArea - round} Q${start.x + safeArea} ${start.y + nodeH + safeArea} ${start.x + safeArea - round} ${start.y + nodeH + safeArea} H${end.x - safeArea + round} Q${end.x - safeArea} ${start.y + nodeH + safeArea} ${end.x - safeArea} ${start.y + nodeH + safeArea + (isInterupt ? -round : round)} V${end.y + (isInterupt ? round : -round)} Q${end.x - safeArea} ${end.y} ${end.x - safeArea + round} ${end.y} H${end.x} ${arrow}`
    } else {
      const isInterupt = start.y - end.y < nodeH + safeArea

      d = `M${start.x} ${start.y} H${start.x + safeArea - round} Q${start.x + safeArea} ${start.y} ${start.x + safeArea} ${start.y - round} V${start.y - (nodeH + safeArea) + round} Q${start.x + safeArea} ${start.y - (nodeH + safeArea)} ${start.x + safeArea - round} ${start.y - (nodeH + safeArea)} H${end.x - safeArea + round} Q${end.x - safeArea} ${start.y - (nodeH + safeArea)} ${end.x - safeArea} ${start.y - (nodeH + safeArea) + (isInterupt ? round : -round)} V${end.y + (isInterupt ? -round : round)} Q${end.x - safeArea} ${end.y} ${end.x - safeArea + round} ${end.y} H${end.x} ${arrow}`
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 size-full"
    >
      <path
        d={d}
        fill="none"
        stroke="orange"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

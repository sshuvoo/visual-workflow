import { FlowNodeSidebar } from './components/flow-nodes/node-add-sidebar'

export default function App() {
  return (
    <div className="bg-theme-background relative h-screen w-screen overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fixed inset-0 size-full"
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
      </svg>
      <FlowNodeSidebar />
    </div>
  )
}

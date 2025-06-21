import {
  ArrowLeftRight,
  Bot,
  Funnel,
  MessagesSquare,
  Pencil,
  Plus,
  Search,
} from 'lucide-react'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Input } from '../ui/input'

const workflowSteps = [
  {
    icon: MessagesSquare,
    title: 'On Chat Message',
    description:
      'Runs flow when a user send a chat message. For use with AI nodes',
    type: 'chat-message',
  },
  {
    icon: ArrowLeftRight,
    title: 'Switch',
    description: 'Routes items depending on defined expression or rules',
    type: 'switch',
  },
  {
    icon: Pencil,
    title: 'Edit',
    description: 'Modify, Add or Remove item fields',
    status: 'edit',
  },
  {
    icon: Funnel,
    title: 'Filter',
    description: 'Remove items matching a conditions',
    type: 'filter',
  },
  {
    icon: Bot,
    title: 'AI Agent',
    description:
      'Runs the flow when a user send a chat message. For use with AI nodes',
    type: 'ai-agent',
  },
]

export function FlowNodeSidebar() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size="lg"
          variant="outline"
          className="bg-theme-background absolute top-4 right-4 cursor-pointer rounded-lg border-[#bcbcbc] text-[#bcbcbc]"
        >
          <Plus /> Node
        </Button>
      </SheetTrigger>
      <SheetContent className="border-[#2f2f2f] bg-[#1f1f1f] text-[#cbcbcb]">
        <SheetHeader className="bg-[#2e2e2e] p-6">
          <SheetTitle className="text-xl text-[#cbcbcb]">
            What happens next?
          </SheetTitle>
          <SheetDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 py-2">
          <div className="relative">
            <Search
              size={20}
              color="#5c5c5c"
              className="absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input className="h-11 border-[#5c5c5c] px-10" />
          </div>
        </div>
        {workflowSteps.map((step, index) => {
          const IconComponent = step.icon
          const colors = [
            'text-orange-500',
            'text-blue-500',
            'text-green-500',
            'text-sky-500',
            'text-pink-500',
            'text-cyan-500',
          ]
          const iconColor = colors[Math.floor(Math.random() * colors.length)]
          return (
            <div key={index} className="text-[#cbcbcb]">
              <div className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="p-2 shadow-sm">
                    <IconComponent className={`size-8 ${iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="truncate font-medium">{step.title}</h3>
                    </div>
                    <p className="truncate text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </SheetContent>
    </Sheet>
  )
}

import type { INode } from '@/types'
import {
  ArrowLeftRight,
  Bot,
  BotMessageSquare,
  CodeXml,
  Database,
  Funnel,
  Mail,
  MailPlus,
  MessagesSquare,
  NotebookPen,
  Pencil,
  Plus,
  Search,
} from 'lucide-react'
import { Input } from '../ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'

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
    type: 'edit',
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
  {
    icon: Bot,
    title: 'Customer Support Agent',
    description:
      'Runs the flow when a user send a chat message. For use with AI nodes.',
    type: 'support-agent',
  },
  {
    icon: Mail,
    title: 'Send Email',
    description: 'Send email to a user.',
    type: 'email',
  },
  {
    icon: Database,
    title: 'Vector Store',
    description: 'Store and retrieve data from a vector database.',
    type: 'database',
  },
  {
    icon: Database,
    title: 'PgVector',
    description: 'Answer questions with a vector store.',
    type: 'postgresql',
  },
  {
    icon: BotMessageSquare,
    title: 'Ollama Chat Model',
    description:
      'Runs the flow when a user send a chat message. For use with AI nodes.',
    type: 'ollama',
  },
  {
    icon: MailPlus,
    title: 'Gmail Trigger',
    description:
      'Runs the flow when a user send a chat message. For use with AI nodes.',
    type: 'gmail',
  },
  {
    icon: NotebookPen,
    title: 'Create Draft',
    description: 'Creates a draft with specified content and recipients.',
    type: 'draft',
  },
  {
    icon: CodeXml,
    title: 'Embed everything',
    description:
      'Generates text embeddings from input data for use in search or analysis.',
    type: 'embed',
  },
]

interface Props {
  onAddNode: (newNode: INode) => void
}

export function FlowNodeSidebar({ onAddNode }: Props) {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="bg-theme-background absolute top-4 right-4 flex size-auto cursor-pointer items-center gap-2 rounded-lg border-2 border-[#bcbcbc] px-3 py-1.5 text-lg text-[#bcbcbc] transition-all duration-300 hover:border-green-500 hover:bg-transparent hover:text-green-500">
          <Plus className="size-6" /> Node
        </div>
      </SheetTrigger>
      <SheetContent className="border-[#2f2f2f] bg-[#1f1f1f] text-[#cbcbcb]">
        <SheetHeader className="bg-[#2e2e2e] p-6">
          <SheetTitle className="text-xl text-[#cbcbcb]">
            What happens next?
          </SheetTitle>
          <SheetDescription className="sr-only"></SheetDescription>
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
        <div className="w-full overflow-y-auto">
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
            const iconColor = colors[index % colors.length]
            return (
              <div
                onClick={() => {
                  onAddNode({
                    type: step.type,
                    id: crypto.randomUUID(),
                    x: innerWidth / 2,
                    y: innerHeight / 2,
                    width: 150,
                    height: 100,
                    portId: null,
                  })
                }}
                key={index}
                className="w-full cursor-pointer text-[#cbcbcb]"
              >
                <div className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="p-2 shadow-sm">
                      <IconComponent className={`size-8 ${iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-medium text-[#dadada]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="truncate text-start text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="py-20" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

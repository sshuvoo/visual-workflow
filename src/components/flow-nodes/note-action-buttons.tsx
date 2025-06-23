import { MoreHorizontal, Play, Power, Trash2 } from 'lucide-react'

export function NodeActionButtons() {
  return (
    <div className="absolute -top-9 right-4 flex translate-y-2 items-center gap-2 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <button className="cursor-pointer">
        <Trash2 className="size-4 text-red-500" />
      </button>
      <button className="cursor-pointer">
        <Power className="size-4 text-yellow-600" />
      </button>
      <button className="cursor-pointer">
        <Play className="size-4 text-green-600" />
      </button>
      <button className="cursor-pointer">
        <MoreHorizontal className="size-4 text-gray-600" />
      </button>
    </div>
  )
}

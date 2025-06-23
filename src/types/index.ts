export interface IPoint {
  x: number
  y: number
}

export interface IChatMessage extends IPoint {
  id: string
  type: 'chat-message'
  portId: string | null
  width: number
  height: number
}

export type INode = IChatMessage

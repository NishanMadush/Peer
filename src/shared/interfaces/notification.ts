export interface INotification {
  id: string
  code: string
  createdAt: number
  params?: {
    quantity?: string
    user?: string
  }
  unread: boolean
}

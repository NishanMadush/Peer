export interface IActivityLog {
  id: string
  actor: string
  code: string
  createdAt: number
  params?: { [key: string]: string }
}

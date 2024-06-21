import { IUser } from './userInfo'

export interface AuthContextInterface {
  // eslint-disable-next-line @typescript-eslint/ban-types
  hasRole: (roles?: string[]) => {}
  isLoggingIn: boolean
  isLoggingOut: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<any>
  userInfo?: IUser
}

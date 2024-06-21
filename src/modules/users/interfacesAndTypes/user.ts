export * from '../../../shared/interfaces/user'

export interface IUserAddAction {
  isAdding: boolean
  addUser: any
  errorAddUser: any
}

export interface IUserUpdateAction {
  isUpdating: boolean
  updateUser: any
  errorUpdateUser: any
}

export interface IUserDeleteAction {
  isDeleting: boolean
  deleteUsers: any
  errorDeleteUser: any
}

export interface IUserNotifyAction {
  isNotifying: boolean
  notifyUser: any
  errorNotifyUser: any
}

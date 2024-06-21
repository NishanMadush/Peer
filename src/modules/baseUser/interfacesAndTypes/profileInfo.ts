export * from '../../../shared/interfaces/user'

export interface IProfileUpdateAction {
  isUpdating: boolean
  updateProfileInfo: any
  errorUpdateProfileInfo: any
}

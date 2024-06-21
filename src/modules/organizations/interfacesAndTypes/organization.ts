export * from '../../../shared/interfaces/organization'

// export interface IOrganizationInfo {
//   addOrganization?: any
//   deleteOrganizations?: any
//   isAdding?: boolean
//   isDeleting?: boolean
// }
export interface IOrganizationGetAction {
  isLoading: boolean
  getOrganization: any
  errorGetOrganization: any
}
export interface IOrganizationUpdateAction {
  isUpdating: boolean
  updateOrganization: any
  errorUpdate: any
}

export interface IOrganizationAddAction {
  isAdding: boolean
  addOrganization: any
  errorAddOrganization: any
}

export interface IOrganizationDeleteAction {
  isDeleting: boolean
  deleteOrganizations: any
  errorDeleting: any
}

export interface IOrganizationTableHeadCell {
  key: string
  label: string
  align: 'center' | 'left' | 'right'
}

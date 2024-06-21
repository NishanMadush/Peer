export * from '../../../../shared/interfaces/institutionalization'

export interface IFormAddAction {
  isAdding: boolean
  addForm: any
  errorAddForm: any
}

export interface IFormUpdateAction {
  isUpdating: boolean
  updateForm: any
  errorUpdateForm: any
}

export interface IFormDeleteAction {
  isDeleting: boolean
  deleteForms: any
  errorDeleteForm: any
}

export interface IFormTableHeadCell {
  key: string
  label: string
  align: 'center' | 'left' | 'right'
}

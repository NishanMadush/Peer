export * from '../../../shared/interfaces/language'

export interface ILanguageUpdateAction {
  isUpdating: boolean
  updateLanguage: any
  errorUpdate?: any
}

export interface ILanguageAddAction {
  isAdding: boolean
  addLanguage: any
  errorAddLanguage?: any
}

export interface ILanguageDeleteAction {
  isDeleting: boolean
  deleteLanguages: any
  errorDeleting?: any
}

export interface ILanguageTableHeadCell {
  key: string
  label: string
  align: 'center' | 'left' | 'right'
}

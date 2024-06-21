export * from '../../../shared/interfaces/country'

export interface ICountryUpdateAction {
  isUpdating: boolean
  updateCountry: any
  errorUpdate?: any
}

export interface ICountryAddAction {
  isAdding: boolean
  addCountry: any
  errorAddCountry?: any
}

export interface ICountryDeleteAction {
  isDeleting: boolean
  deleteCountries: any
  errorDeleting?: any
}

export interface ICountryTableHeadCell {
  key: string
  label: string
  align: 'center' | 'left' | 'right'
}

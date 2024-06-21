// export interface IBaseCountry {
//   id: string
//   avatar?: string
//   email: string
//   firstName: string
//   job: string
//   lastName: string
//   progress: number
//   role: string
//   newCountry: string
//   isoCode: string
//   name: string
//   website: string
//   contactNumber: string
// }
// export interface ICountry extends IBaseCountry {
//   disabled: boolean
//   appCountry?: 'y' | 'n'
// }
// export interface IAuthCountry extends IBaseCountry {
//   job: string
//   progress: number
// }

export interface ICountry {
  id: string
  code: string
  name: string
  order: number
  isAppCountry: boolean
  status: CountryStatusEnum
  disabled: boolean
  createdBy?: {
    userId: string
    userName: string
    performedAt: string // browser date string
  }
  lastModifiedBy?: {
    userId: string
    userName: string
    performedAt: string // browser date string
  }
  newCountry: string
}

export enum CountryStatusEnum {
  Active = 'Active',
  Disabled = 'Disabled',
  Deleted = 'Deleted',
}

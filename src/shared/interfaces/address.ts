export interface IAddress {
  category: AddressTypeEnum
  line1: string | null
  street: string
  city: string
  postalCode?: string
  countryId?: string
  location?: {
    lat: number
    lng: number
  }
}

export enum AddressTypeEnum {
  Resident = 'Resident',
  Postal = 'Postal',
  Office = 'Office',
}

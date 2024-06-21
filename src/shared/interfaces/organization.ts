import { IAddress } from './address'

export interface IOrganization {
  id: string
  name: string
  description: string
  category: string
  countryId: string
  registeredNo: string
  isLegalEntity: boolean
  vision: string
  mission: string
  organizationType: OrganizationTypeEnum
  geographicArea: GeographicAreaEnum
  status: OrganizationStatusEnum
  departments: string[]
  designations: string[]
  headOffice: IOrganizationBranch
  branches: IOrganizationBranch[]
  createdBy: {
    userId: string
    userName: string
    performedAt: string // browser date string
  }
  lastModifiedBy: {
    userId: string
    userName: string
    performedAt: string // browser date string
  }
}

export enum OrganizationTypeEnum {
  Government = 'Government',
  SemiGovernment = 'Semi Government',
  NonGovernment = 'Non Government',
  Private = 'Private',
  Other = 'Other',
}

export enum GeographicAreaEnum {
  National = 'National',
  Provincial = 'Provincial',
  District = 'District',
  CityMunicipality = 'City Municipality',
  Village = 'Village',
}

export enum OrganizationStatusEnum {
  Active = 'Active',
  Disabled = 'Disabled',
  Deleted = 'Deleted',
}

export interface IOrganizationBranch {
  _id: string
  branchName: string
  isHeadOffice: boolean
  isVirtual: boolean
  contactPerson: string
  email: string
  phoneNumber: string
  address: IAddress
  website: string
  employees: string
}

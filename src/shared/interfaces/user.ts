import { IAddress } from './address'

export interface IBaseUser {
  username: string
  firstName: string
  lastName: string
  email: string
  password?: string
  phoneNumber?: string
  languageId: string
}

export interface IUser extends IBaseUser {
  id: string
  isEmailVerified?: boolean
  role: string
  status: UserStatusEnum
  profile?: {
    gender?: GenderEnum
    address?: IAddress
    profilePicture?: string
    salutation?: string
  }
  employment?: {
    organization: {
      organizationId: any
      organizationName: string
      countryId?: any
    }
    department?: string
    designation?: string
    email?: string
    phoneNumber?: string
    branch?: {
      branchId: string
      branchName: string
    }
  }
  countryProfileSettings?: {
    countryName: string
    nodalAgency: {
      agency: string
      agencyFocalPoint: string
    }
    leadInstitutions: {
      cadre: string
      cadreFocalPoint: string
      mfr: string
      mfrFocalPoint: string
      cssr: string
      cssrFocalPoint: string
      hope: string
      hopeFocalPoint: string
    }
    programYears: string
    geographicCoverage: string
    trainedResponders: {
      cadre: number
      mfr: number
      cssr: number
      hope: number
    }
    trainedInstructors: {
      cadreQualified: number
      mfrQualified: number
      cssrQualified: number
      hopeQualified: number
    }
  }
  previousAccessed?: Date
  lastAccessed?: Date
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
  // progress?: number
}

export interface ILocalUserInfo extends IUser {
  tokens: {
    access: {
      expires: string
      token: string
    }
    refresh: {
      expires: string
      token: string
    }
  }
}

export enum UserStatusEnum {
  Pending = 'Pending',
  Incomplete = 'Incomplete',
  Active = 'Active',
  Disabled = 'Disabled',
  Deleted = 'Deleted',
}

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export interface IRole {
  id: string
  role: string
  permissions: string[]
}

export interface ILanguage {
  id: string
  code: string
  name: string
  description: string
  direction: string
  order: number
  recaptchaLanguageCode: string
  status: LanguageStatusEnum
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
}

export enum LanguageStatusEnum {
  Active = 'Active',
  Disabled = 'Disabled',
  Deleted = 'Deleted',
}

export enum LanguageDirectionEnum {
  ltor = 'ltor',
  rtol = 'rtol',
}

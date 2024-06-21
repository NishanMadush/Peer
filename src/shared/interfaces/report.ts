export interface IInstitutionalizationStatistic {
  level: LevelStatEnum
  countryId: string
  country: string
  countryReviewId: string
  countryReviewTitle: string
  organizationId?: string
  organizationName?: string
  formId?: string
  formTitle?: string
  trainingComponent?: string
  completedDate: Date
  assessmentStatus: string
  assessmentScore: number
  assessmentCount: number
  moduleNo?: string
  moduleScore?: number
  assessmentData?: any
}

export enum LevelStatEnum {
  Global = 'Global',
  Country = 'Country',
  Organization = 'Organization',
  Assessment = 'Assessment',
}

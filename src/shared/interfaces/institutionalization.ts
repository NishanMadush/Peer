export interface IInstitutionalizationIndicatorSubQuestion {
  _id: string
  subQuestion: string
  subAnswer: string
}

export interface IInstitutionalizationIndicator {
  _id: string
  instruction: string
  indicatorNo: string
  question: string
  description: string
  weight: number
  scale: number
  indicatorScore: number
  subQuestions: IInstitutionalizationIndicatorSubQuestion[]
  comments: [
    {
      userId: string
      userFullName: string
      date: Date
      comment: string
    }
  ]
}

export interface IInstitutionalizationModule {
  _id: string
  instruction: string
  moduleNo: string
  condition: string
  indicators: IInstitutionalizationIndicator[]
  moduleScore: number
  moduleClassification: string
  comments: [
    {
      userId: string
      userFullName: string
      date: Date
      comment: string
    }
  ]
}

export interface IInstitutionalizationForm {
  id: string
  version: string
  title: string
  date: Date
  formId?: string
  status: FormStatusEnum
  modules: IInstitutionalizationModule[]
  score: number
  classification: string
  comments: [
    {
      userId: string
      userFullName: string
      date: Date
      comment: string
    }
  ]
}

export interface ITrainingComponent {
  code: string
  name: string
}

export interface IInstitutionalizationCountryReview {
  id: string
  title: string
  year: number
  start: number
  end: number
  timeZone: TimeZoneEnum
  status: AssessmentStatusEnum
  countryId: string
  trainingComponents: ITrainingComponent[]
  score: number
  classification: string
  createdBy?: {
    userId: string
    userFullName: string
    performedAt: string // browser date string
  }
  lastModifiedBy?: {
    userId: string
    userFullName: string
    performedAt: string // browser date string
  }
}

export interface IInstitutionalizationOrganization {
  id: string
  countryId: string
  languageId: string
  organizationId: string
  countryReviewId: string
  trainingComponent: string //TrainingComponentEnum - code
  status: AssessmentStatusEnum
  start: Date
  complete: Date
  timeZone?: any
  score: number
  institutionalization: IInstitutionalizationForm
  comments: [
    {
      userId: string
      date: Date
      comment: string
    }
  ]
  endorse: {
    organizationId: string
    organization: string
    userId: string
    date: string
    comment: string
  }
}

export enum FormStatusEnum {
  Active = 'Active',
  Inactive = 'Inactive',
  Deleted = 'Deleted',
}

export enum AssessmentStatusEnum {
  Pending = 'Pending',
  Progress = 'Progress',
  Complete = 'Complete',
  Disabled = 'Disabled',
  Deleted = 'Deleted',
}

export enum TrainingComponentEnum {
  HOPE = 'HOPE',
  MFR = 'MFR',
  CSSR = 'CSSR',
  CADRE = 'CADRE',
}

export enum TimeZoneEnum {
  Thailand = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Thailand',
  SriLanka = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.SriLanka',
  Bangladesh = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Bangladesh',
  Vietnam = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Vietnam',
  Indonesia = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Indonesia',
  Pakistan = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Pakistan',
  Nepal = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Nepal',
  Malaysia = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Malaysia',
  Maldives = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Maldives',
  Philippines = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Philippines',
  India = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.India',
  Cambodia = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Cambodia',
  China1 = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.China1',
  Bhutan = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Bhutan',
  China2 = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.China2',
  Mongolia = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Mongolia',
  Laos = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Laos',
  Myanmar = 'institutionalization:countryReviewManagement.countryReviewDialog.TimeZoneEnum.Myanmar',
}

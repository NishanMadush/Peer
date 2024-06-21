export * from '../../../../shared/interfaces/institutionalization'

export interface IOrganizationAssessmentGetAction {
  isLoading: boolean
  getAssessment: any
  errorGetAssessment: any
}

export interface IOrganizationAssessmentsGetAction {
  isLoading: boolean
  getAssessments: any
  errorGetAssessments: any
}

export interface IOrganizationAssessmentAddAction {
  isAdding: boolean
  addOrganizationAssessment: any
  errorAddAssessment: any
}

export interface IOrganizationAssessmentUpdateAction {
  isUpdating: boolean
  updateOrganizationAssessment: any
  errorUpdateAssessment: any
}

export interface IOrganizationAssessmentActiveForm {
  isAddingActiveForm: boolean
  activeForm: any
  errorAddActiveForm: any
}

export interface IOrganizationAssessmentActiveCountry {
  isAddingActiveCountry: boolean
  activeCountry: any
  errorAddActiveCountry: any
}

export interface IOrganizationAssessmentProfileInfo {
  isAddingProfileInfo: boolean
  profileInfo: any
  errorAddProfileInfo: any
}
export interface IOrganizationAssessmentTableHeadCell {
  key: string
  label: string
  align: 'center' | 'left' | 'right'
}

export interface IUiTrainingComponent {
  assessmentId?: string
  countryId: string
  organizationId: string
  countryReviewId: string
  trainingComponent: {
    code: string
    name: string
  }
  status?: string
}

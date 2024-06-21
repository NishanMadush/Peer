export * from '../../../../shared/interfaces/institutionalization'

export interface IOrganizationAssessmentGetAction {
  isLoading: boolean
  getAssessment: any
  errorGetAssessment: any
}

export interface IOrganizationAssessmentAddAction {
  isAdding: boolean
  addAssessment: any
  errorAddAssessment: any
}
export interface IOrganizationAssessmentTableHeadCell {
  key: string
  label: string
  align: 'center' | 'left' | 'right'
}

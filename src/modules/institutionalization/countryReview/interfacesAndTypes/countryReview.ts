import { AssessmentStatusEnum } from '../../../../shared/interfaces/institutionalization'

export * from '../../../../shared/interfaces/institutionalization'

export interface ICountryReviewUpdateAction {
  isUpdating: boolean
  updateCountryReview: any
  errorUpdate?: any
}

export interface ICountryReviewAddAction {
  isAdding: boolean
  addCountryReview: any
  errorAddCountry?: any
}

export interface ICountryReviewDeleteAction {
  isDeleting: boolean
  deleteCountryReviews: any
  errorDeleting?: any
}

export interface ICountryReviewStatus {
  isLoading: boolean
  countryId: string
  status: AssessmentStatusEnum
}

export interface ICountryReviewGetAction {
  isLoading: boolean
  getCountryReview: any
  errorGetCountryReview: any
}

export interface IActiveCountryReviewGetAction {
  isLoading: boolean
  getActiveCountryReview: any
  errorGetCountryReview: any
}

export interface ICountryReviewTableHeadCell {
  key: string
  label: string
  align: 'center' | 'left' | 'right'
}

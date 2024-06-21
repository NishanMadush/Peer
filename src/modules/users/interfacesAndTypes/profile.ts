export interface IProfileBasics {
  profileId: string
  organizationId: string
  branchId: string
  countryId: string
  languageId: string
}

export interface IGetProfileBasicsAction {
  isLoading: boolean
  getProfileBasics: any
  errorGetProfileBasics: any
}

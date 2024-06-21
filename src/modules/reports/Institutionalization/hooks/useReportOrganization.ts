import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { IInstitutionalizationOrganization } from '../../../../shared/interfaces/institutionalization'
import { ISearchResult } from '../../../../shared/interfaces/result'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_ORGANIZATIONS_FORMS_QUERY } from '../constants/queryKeys'
import { IOrganizationAssessmentsGetAction } from '../interfacesAndTypes/organization'

const fetchAssessment = async (): Promise<ISearchResult> => {
  const { data } = await ApiService.get<AxiosResponse>(
    INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_CRUD_ENDPOINT
  )
  return data as unknown as ISearchResult
}

export function useReportOrganization(): IOrganizationAssessmentsGetAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(fetchAssessment, {
    onSuccess: (organizationAssessment: ISearchResult) => {
      queryClient.setQueryData<IInstitutionalizationOrganization[]>(
        [INSTITUTIONALIZATION_ORGANIZATIONS_FORMS_QUERY],
        organizationAssessment?.results as IInstitutionalizationOrganization[]
      )
    },
  })

  return {
    isLoading,
    getAssessments: mutateAsync,
    errorGetAssessments: error,
  }
}

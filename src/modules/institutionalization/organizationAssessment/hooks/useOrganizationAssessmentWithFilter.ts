import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { ISearchResult } from '../../../../shared/interfaces/result'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_BY_FILTER_QUERY } from '../constants/queryKeys'
import {
  IInstitutionalizationOrganization,
  IOrganizationAssessmentsGetAction,
} from '../interfacesAndTypes/organization'

const fetchAssessment = async (filter?: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT}${filter ?? ''}`
  )
  const results = data as unknown as ISearchResult
  return results?.results ?? []
}

export function useOrganizationAssessmentWithFilter(
  filter?: string
): IOrganizationAssessmentsGetAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(fetchAssessment, {
    onSuccess: (organizationAssessment: IInstitutionalizationOrganization) => {
      queryClient.setQueryData<IInstitutionalizationOrganization>(
        [INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_BY_FILTER_QUERY],
        organizationAssessment
      )
    },
  })

  return {
    isLoading,
    getAssessments: () => mutateAsync(filter),
    errorGetAssessments: error,
  }
}

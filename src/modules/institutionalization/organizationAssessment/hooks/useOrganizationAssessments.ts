import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { ISearchResult } from '../../../../shared/interfaces/result'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_LIST_QUERY } from '../constants/queryKeys'
import { IInstitutionalizationOrganization } from '../interfacesAndTypes/organization'

const fetchAssessments = async (filter?: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT}${filter ?? ''}`
  )
  const search = data as unknown as ISearchResult
  return search?.results
}

export function useOrganizationAssessments(
  filter?: string
): UseQueryResult<IInstitutionalizationOrganization[]> {
  return useQuery(
    INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_LIST_QUERY,
    () => fetchAssessments(filter)
  )
}

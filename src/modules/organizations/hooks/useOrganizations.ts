import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { IOrganization } from '../../../shared/interfaces/organization'
import { ISearchResult } from '../../../shared/interfaces/result'
import { ORGANIZATIONS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { ORGANIZATION_LIST_QUERY } from '../constants/queryKeys'

export const fetchOrganizations = async (filter?: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${ORGANIZATIONS_CRUD_ENDPOINT}${filter ?? ''}`
  )
  const search = data as unknown as ISearchResult
  return search?.results
}

export function useOrganizations(
  filter?: string
): UseQueryResult<IOrganization[]> {
  return useQuery(ORGANIZATION_LIST_QUERY, () => fetchOrganizations(filter))
}

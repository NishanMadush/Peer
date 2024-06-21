import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { ISearchResult } from '../../../../shared/interfaces/result'
import { INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY } from '../constants/queryKeys'
import { IInstitutionalizationCountryReview } from '../interfacesAndTypes/countryReview'

const fetchCountryReviews = async (filter?: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT}${filter ?? ''}`
  )
  const search = data as unknown as ISearchResult
  return search?.results
}

export function useCountryReviews(
  filter?: string
): UseQueryResult<IInstitutionalizationCountryReview[]> {
  return useQuery(INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY, () =>
    fetchCountryReviews(filter)
  )
}

import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { ISearchResult } from '../../../shared/interfaces/result'
import { COUNTRIES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { COUNTRY_LIST_QUERY } from '../constants/queryKeys'
import { ICountry } from '../interfacesAndTypes/country'

const fetchCountries = async (): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(COUNTRIES_CRUD_ENDPOINT)
  const search = data as unknown as ISearchResult
  return search?.results
}

export function useCountries(): UseQueryResult<ICountry[]> {
  return useQuery(COUNTRY_LIST_QUERY, () => fetchCountries())
}

import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { ISearchResult } from '../../../shared/interfaces/result'
import { LANGUAGES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { LANGUAGE_LIST_QUERY } from '../constants/queryKeys'
import { ILanguage } from '../interfacesAndTypes/language'

const fetchLanguages = async (): Promise<any> => {
  try {
    const { data } = await ApiService.get<AxiosResponse>(
      LANGUAGES_CRUD_ENDPOINT
    )
    const search = data as unknown as ISearchResult
    return search?.results
  } catch (error: any) {
    console.log('~!@# fetch language error: ', error)
  }
}

export function useLanguages(): UseQueryResult<ILanguage[]> {
  return useQuery(LANGUAGE_LIST_QUERY, () => fetchLanguages())
}

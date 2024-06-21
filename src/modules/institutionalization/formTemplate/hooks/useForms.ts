import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { ISearchResult } from '../../../../shared/interfaces/result'
import { INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_FORMS_LIST_QUERY } from '../constants/queryKeys'
import { IInstitutionalizationForm } from '../interfacesAndTypes/forms'

const fetchForms = async (): Promise<any> => {
  try {
    const { data } = await ApiService.get<AxiosResponse>(
      INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT
    )
    const search = data as unknown as ISearchResult
    return search?.results
  } catch (error: any) {
    console.log('~!@# fetch forms error: ', error)
  }
}

export function useForms(): UseQueryResult<IInstitutionalizationForm[]> {
  return useQuery(INSTITUTIONALIZATION_FORMS_LIST_QUERY, () => fetchForms())
}

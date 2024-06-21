import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_FORMS_TEMPLATES_ACTIVE_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_ACTIVE_FORM_QUERY } from '../constants/queryKeys'
import { IInstitutionalizationForm } from '../interfacesAndTypes/forms'

const fetchForm = async (): Promise<any> => {
  try {
    const { data } = await ApiService.get<AxiosResponse>(
      INSTITUTIONALIZATION_FORMS_TEMPLATES_ACTIVE_ENDPOINT
    )
    return data
  } catch (error: any) {
    console.log('~!@# fetch forms error: ', error)
  }
}

export function useActiveFormTemplate(): UseQueryResult<IInstitutionalizationForm> {
  return useQuery(INSTITUTIONALIZATION_ACTIVE_FORM_QUERY, () => fetchForm())
}

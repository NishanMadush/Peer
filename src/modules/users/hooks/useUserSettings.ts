import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { IUserSettings } from '../../../shared/interfaces/base'
import { USER_SETTINGS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { USER_SETTINGS_LIST_QUERY } from '../constants/queryKeys'

const fetchUserSettings = async (): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    USER_SETTINGS_CRUD_ENDPOINT
  )
  return data
}

export function useUserSettings(): UseQueryResult<IUserSettings> {
  return useQuery(USER_SETTINGS_LIST_QUERY, () => fetchUserSettings())
}

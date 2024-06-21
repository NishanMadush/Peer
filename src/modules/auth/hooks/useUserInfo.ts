import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { AUTH_USER_INFO_ENDPOINT } from '../constants/apiEndpoints'
import { AUTH_USER_INFO_QUERY } from '../constants/queryKeys'
import { IUser } from '../interfacesAndTypes/userInfo'

const fetchUserInfo = async (key?: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    AUTH_USER_INFO_ENDPOINT,
    {
      params: { key },
    }
  )
  return data
}

export function useUserInfo(key?: string): UseQueryResult<IUser> {
  return useQuery([AUTH_USER_INFO_QUERY, key], () => fetchUserInfo(key), {
    enabled: !!key,
  })
}

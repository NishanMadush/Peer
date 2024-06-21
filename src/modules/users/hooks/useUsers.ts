import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { USERS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { USER_LIST_QUERY } from '../constants/queryKeys'
import { IUser } from '../interfacesAndTypes/user'

const fetchUsers = async (filter?: string): Promise<any> => {
  // // Pass authentication data to the request. Direct way of configuration. Instead axios inspector is used.
  // const [authkey] = useLocalStorage<any>('authkey', '')
  // const { data } = await ApiService.get<AxiosResponse>(USERS_CRUD_ENDPOINT, {
  //   headers: {
  //     Authorization: `Bearer ${authkey}`,
  //     'Accept-Language': 'si-LK',
  //   },
  // })
  // return data
  const { data } = await ApiService.get<AxiosResponse>(
    `${USERS_CRUD_ENDPOINT}${filter ?? ''}`
  )
  return data
}

export function useUsers(filter?: string): UseQueryResult<IUser[]> {
  return useQuery(USER_LIST_QUERY, () => fetchUsers(filter))
}

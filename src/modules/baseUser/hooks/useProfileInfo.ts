import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { USERS_CRUD_ENDPOINT } from '../../users/constants/apiEndpoints'
import { USER_PROFILE_INFO_QUERY } from '../constants/queryKeys'
import { IUser } from '../interfacesAndTypes/profileInfo'

export const fetchProfileInfo = async (userId: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${USERS_CRUD_ENDPOINT}/${userId}/profile`
  )
  return data
}

export function useProfileInfo(userId: string): UseQueryResult<IUser> {
  return useQuery(USER_PROFILE_INFO_QUERY, () => fetchProfileInfo(userId))
}

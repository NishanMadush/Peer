import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { NOTIFICATION_CURD_ENDPOINT } from '../constants/apiEndpoints'
import { NOTIFICATION_INFO_QUERY } from '../constants/queryKeys'
import { INotification } from '../interfacesAndTypes/notification'

const fetchNotifications = async (): Promise<INotification[]> => {
  const { data } = await ApiService.get<AxiosResponse>(
    NOTIFICATION_CURD_ENDPOINT
  )
  return data as unknown as INotification[]
}

export function useNotifications(): UseQueryResult<INotification[]> {
  return useQuery(NOTIFICATION_INFO_QUERY, () => fetchNotifications(), {
    suspense: false,
  })
}

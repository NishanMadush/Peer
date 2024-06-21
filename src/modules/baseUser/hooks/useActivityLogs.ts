import { AxiosResponse } from 'axios'
import { useQuery, UseQueryResult } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { ACTIVITY_LOGS_ENDPOINT } from '../constants/apiEndpoints'
import { ACTIVITY_LOGS_QUERY } from '../constants/queryKeys'
import { IActivityLog } from '../interfacesAndTypes/activityLog'

const fetchActivityLogs = async (): Promise<IActivityLog[]> => {
  const { data } = await ApiService.get<AxiosResponse>(ACTIVITY_LOGS_ENDPOINT)
  return data as unknown as IActivityLog[]
}

export function useActivityLogs(): UseQueryResult<IActivityLog[]> {
  return useQuery(ACTIVITY_LOGS_QUERY, () => fetchActivityLogs())
}

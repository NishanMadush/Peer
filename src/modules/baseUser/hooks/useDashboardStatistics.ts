import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { IStatisticDashboard } from '../../../shared/interfaces/dashboard'
import { DASHBOARD_STAT_CURD_ENDPOINT } from '../constants/apiEndpoints'
import { DASHBOARD_STAT_QUERY } from '../constants/queryKeys'
import { IDashboardStatisticsGetAction } from '../interfacesAndTypes/dashboard'

// const updateDashboardStatistics = async (): Promise<any> => {
//   const { data } = await ApiService.patch('./dashboard.json')
//   return data
// }

const fetchDashboardStat = async (filter?: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${DASHBOARD_STAT_CURD_ENDPOINT}${filter ?? ''}`
  )
  const dataStat = data as unknown as IStatisticDashboard[]
  return dataStat ? dataStat[0] : {}
}

export function useDashboardStatistics(
  filter?: string
): IDashboardStatisticsGetAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(fetchDashboardStat, {
    onSuccess: (dashboardStatistics: IStatisticDashboard) => {
      queryClient.setQueryData<IStatisticDashboard>(
        [DASHBOARD_STAT_QUERY],
        dashboardStatistics
      )
    },
  })

  return {
    isLoading,
    getDashboardStatistics: () => mutateAsync(filter),
    errorGetDashboardStatistics: error,
  }
}

import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { REPORT_INSTITUTIONALIZATION_STATISTICS_ENDPOINT } from '../constants/apiEndpoints'
import { IStatisticsGetAction } from '../interfacesAndTypes/statistics'

const fetchStatistics = async (level: string): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    level
      ? `${REPORT_INSTITUTIONALIZATION_STATISTICS_ENDPOINT}?level=${level}`
      : `${REPORT_INSTITUTIONALIZATION_STATISTICS_ENDPOINT}`
  )
  return data
}

export function useReportStatistics(): IStatisticsGetAction {
  const { isLoading, mutateAsync, error } = useMutation(fetchStatistics, {})

  return {
    isLoading,
    getStatistics: mutateAsync,
    errorGetStatistics: error,
  }
}

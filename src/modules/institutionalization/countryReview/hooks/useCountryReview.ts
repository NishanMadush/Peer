import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { IInstitutionalizationCountryReview } from '../../../../shared/interfaces/institutionalization'
import { INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_COUNTRIES_ASSESSMENT_BY_ID_QUERY } from '../constants/queryKeys'
import { ICountryReviewGetAction } from '../interfacesAndTypes/countryReview'

export const fetchCountryReview = async (
  countryReviewId: string
): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT}/${countryReviewId}`
  )

  return data as unknown as IInstitutionalizationCountryReview
}

export function useCountryReview(): ICountryReviewGetAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(fetchCountryReview, {
    onSuccess: (countryReview: IInstitutionalizationCountryReview) => {
      queryClient.setQueryData<IInstitutionalizationCountryReview>(
        [INSTITUTIONALIZATION_COUNTRIES_ASSESSMENT_BY_ID_QUERY],
        countryReview
      )
    },
  })

  return {
    isLoading,
    getCountryReview: mutateAsync,
    errorGetCountryReview: error,
  }
}

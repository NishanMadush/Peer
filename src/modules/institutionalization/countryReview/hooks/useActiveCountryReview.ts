import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_COUNTRIES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_COUNTRIES_ASSESSMENT_BY_ID_QUERY } from '../constants/queryKeys'
import {
  IActiveCountryReviewGetAction,
  IInstitutionalizationCountryReview,
} from '../interfacesAndTypes/countryReview'

const fetchCountryAssessment = async (countryId: string): Promise<any> => {
  try {
    const { data } = await ApiService.get<AxiosResponse>(
      `${INSTITUTIONALIZATION_COUNTRIES_CRUD_ENDPOINT}/${countryId}/Progress`
    )
    const activeReviews =
      data as unknown as IInstitutionalizationCountryReview[]
    return activeReviews[0]
    // return data as unknown as IInstitutionalizationCountryReview
  } catch (error: any) {
    console.log('~!@# fetch forms error: ', error)
    throw error
  }
}

export function useActiveCountryReview(): IActiveCountryReviewGetAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(
    fetchCountryAssessment,
    {
      onSuccess: (countryAssessment: IInstitutionalizationCountryReview) => {
        queryClient.setQueryData<IInstitutionalizationCountryReview>(
          [INSTITUTIONALIZATION_COUNTRIES_ASSESSMENT_BY_ID_QUERY],
          countryAssessment
        )
      },
    }
  )

  return {
    isLoading,
    getActiveCountryReview: mutateAsync,
    errorGetCountryReview: error,
  }
}

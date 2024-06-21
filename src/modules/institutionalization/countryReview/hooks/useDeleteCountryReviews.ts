import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { removeMany } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY } from '../constants/queryKeys'
import {
  ICountryReviewDeleteAction,
  IInstitutionalizationCountryReview,
} from '../interfacesAndTypes/countryReview'

const deleteCountryReviews = async (
  countryReviewIds: string[]
): Promise<any> => {
  const deletedCountryReviews = []

  for (const countryReviewId of countryReviewIds) {
    try {
      const { data } = await ApiService.delete<AxiosResponse>(
        `${INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT}/${countryReviewId}`,
        {
          data: countryReviewId,
        }
      )
      // return data
      deletedCountryReviews.push(countryReviewId)
    } catch (error) {
      console.log('~!@# error: ', error)
      throw error
    }
  }

  return deletedCountryReviews
}

export function useDeleteCountryReviews(): ICountryReviewDeleteAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(deleteCountryReviews, {
    onSuccess: (countryReviewIds: string[]) => {
      queryClient.setQueryData<IInstitutionalizationCountryReview[]>(
        [INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY],
        (oldCountryReviews) => removeMany(oldCountryReviews, countryReviewIds)
      )
    },
  })

  return {
    isDeleting: isLoading,
    deleteCountryReviews: mutateAsync,
    errorDeleting: error,
  }
}

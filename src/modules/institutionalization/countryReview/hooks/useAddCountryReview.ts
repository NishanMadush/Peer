import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { addOne } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY } from '../constants/queryKeys'
import {
  ICountryReviewAddAction,
  IInstitutionalizationCountryReview,
} from '../interfacesAndTypes/countryReview'

const addCountryReview = async (
  countryReview: IInstitutionalizationCountryReview
): Promise<IInstitutionalizationCountryReview> => {
  const { data } = await ApiService.post<AxiosResponse>(
    INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT,
    countryReview
  )
  return data as unknown as IInstitutionalizationCountryReview
}

export function useAddCountryReview(): ICountryReviewAddAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(addCountryReview, {
    onSuccess: (countryReview: IInstitutionalizationCountryReview) => {
      queryClient.setQueryData<IInstitutionalizationCountryReview[]>(
        [INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY],
        (oldCountryReviews) => addOne(oldCountryReviews, countryReview)
      )
    },
  })

  return {
    isAdding: isLoading,
    addCountryReview: mutateAsync,
    errorAddCountry: error,
  }
}

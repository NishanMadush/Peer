import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

import { updateOne } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY } from '../constants/queryKeys'
import {
  ICountryReviewUpdateAction,
  IInstitutionalizationCountryReview,
} from '../interfacesAndTypes/countryReview'

const updateCountryReview = async (
  countryReview: Partial<IInstitutionalizationCountryReview>
): Promise<any> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${INSTITUTIONALIZATION_COUNTRIES_ASSESSMENTS_CRUD_ENDPOINT}/${countryReview.id}`,
    lodash.omit(countryReview, ['id'])
  )
  return data
}

export function useUpdateCountryReview(): ICountryReviewUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(updateCountryReview, {
    onSuccess: (countryReview: IInstitutionalizationCountryReview) => {
      queryClient.setQueryData<IInstitutionalizationCountryReview[]>(
        [INSTITUTIONALIZATION_COUNTRIES_LIST_QUERY],
        (oldCountryReviews) => updateOne(oldCountryReviews, countryReview)
      )
    },
  })

  return {
    isUpdating: isLoading,
    updateCountryReview: mutateAsync,
    errorUpdate: error,
  }
}

import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { removeMany } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { COUNTRIES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { COUNTRY_LIST_QUERY } from '../constants/queryKeys'
import { ICountry, ICountryDeleteAction } from '../interfacesAndTypes/country'

const deleteCountries = async (countryIds: string[]): Promise<any> => {
  const deletedCountries = []

  for (const countryId of countryIds) {
    try {
      const { data } = await ApiService.delete<AxiosResponse>(
        `${COUNTRIES_CRUD_ENDPOINT}/${countryId}`,
        {
          data: countryId,
        }
      )
      // return data
      deletedCountries.push(countryId)
    } catch (error) {
      console.log('~!@# error: ', error)
      throw error
    }
  }

  return deletedCountries
}

export function useDeleteCountries(): ICountryDeleteAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(deleteCountries, {
    onSuccess: (countryIds: string[]) => {
      queryClient.setQueryData<ICountry[]>(
        [COUNTRY_LIST_QUERY],
        (oldCountries) => removeMany(oldCountries, countryIds)
      )
    },
  })

  return {
    isDeleting: isLoading,
    deleteCountries: mutateAsync,
    errorDeleting: error,
  }
}

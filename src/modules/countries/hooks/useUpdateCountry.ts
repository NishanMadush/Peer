import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

import { updateOne } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { COUNTRIES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { COUNTRY_LIST_QUERY } from '../constants/queryKeys'
import { ICountry, ICountryUpdateAction } from '../interfacesAndTypes/country'

const updateCountry = async (country: Partial<ICountry>): Promise<any> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${COUNTRIES_CRUD_ENDPOINT}/${country.id}`,
    lodash.omit(country, ['id'])
  )
  return data
}

export function useUpdateCountry(): ICountryUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(updateCountry, {
    onSuccess: (country: ICountry) => {
      queryClient.setQueryData<ICountry[]>(
        [COUNTRY_LIST_QUERY],
        (oldCountries) => updateOne(oldCountries, country)
      )
    },
  })

  return {
    isUpdating: isLoading,
    updateCountry: mutateAsync,
    errorUpdate: error,
  }
}

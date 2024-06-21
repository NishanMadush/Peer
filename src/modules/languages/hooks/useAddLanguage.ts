import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { addOne } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { LANGUAGES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { LANGUAGE_LIST_QUERY } from '../constants/queryKeys'
import { ILanguage, ILanguageAddAction } from '../interfacesAndTypes/language'

const addLanguage = async (language: ILanguage): Promise<ILanguage> => {
  const { data } = await ApiService.post<AxiosResponse>(
    LANGUAGES_CRUD_ENDPOINT,
    language
  )
  return data as unknown as ILanguage
}

export function useAddLanguage(): ILanguageAddAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(addLanguage, {
    onSuccess: (language: ILanguage) => {
      queryClient.setQueryData<ILanguage[]>(
        [LANGUAGE_LIST_QUERY],
        (oldLanguages) => addOne(oldLanguages, language)
      )
    },
  })

  return {
    isAdding: isLoading,
    addLanguage: mutateAsync,
    errorAddLanguage: error,
  }
}

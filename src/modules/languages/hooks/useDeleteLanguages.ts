import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { removeMany } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { LANGUAGES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { LANGUAGE_LIST_QUERY } from '../constants/queryKeys'
import {
  ILanguage,
  ILanguageDeleteAction,
} from '../interfacesAndTypes/language'

const deleteLanguages = async (languageIds: string[]): Promise<any> => {
  const deletedLanguages = []

  for (const languageId of languageIds) {
    try {
      const { data } = await ApiService.delete<AxiosResponse>(
        `${LANGUAGES_CRUD_ENDPOINT}/${languageId}`,
        {
          data: languageId,
        }
      )
      // return data
      deletedLanguages.push(languageId)
    } catch (error) {
      console.log('~!@# error: ', error)
      throw error
    }
  }

  return deletedLanguages
}
export function useDeleteLanguages(): ILanguageDeleteAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(deleteLanguages, {
    onSuccess: (languageIds: string[]) => {
      queryClient.setQueryData<ILanguage[]>(
        [LANGUAGE_LIST_QUERY],
        (oldLanguages) => removeMany(oldLanguages, languageIds)
      )
    },
  })

  return {
    isDeleting: isLoading,
    deleteLanguages: mutateAsync,
    errorDeleting: error,
  }
}

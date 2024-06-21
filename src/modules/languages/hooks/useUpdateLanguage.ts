import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

import { updateOne } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { LANGUAGES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { LANGUAGE_LIST_QUERY } from '../constants/queryKeys'
import {
  ILanguage,
  ILanguageUpdateAction,
} from '../interfacesAndTypes/language'

const updateLanguage = async (language: Partial<ILanguage>): Promise<any> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${LANGUAGES_CRUD_ENDPOINT}/${language.id}`,
    lodash.omit(language, ['id'])
  )
  return data
}

export function useUpdateLanguage(): ILanguageUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(updateLanguage, {
    onSuccess: (language: ILanguage) => {
      queryClient.setQueryData<ILanguage[]>(
        [LANGUAGE_LIST_QUERY],
        (oldLanguages) => updateOne(oldLanguages, language)
      )
    },
  })

  return {
    isUpdating: isLoading,
    updateLanguage: mutateAsync,
    errorUpdate: error,
  }
}

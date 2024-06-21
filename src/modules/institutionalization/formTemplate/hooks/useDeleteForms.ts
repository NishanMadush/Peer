import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { removeMany } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_FORMS_LIST_QUERY } from '../constants/queryKeys'
import {
  IFormDeleteAction,
  IInstitutionalizationForm,
} from '../interfacesAndTypes/forms'

const deleteForms = async (formIds: string[]): Promise<any> => {
  const deletedForms = []

  for (const formId of formIds) {
    try {
      const { data } = await ApiService.delete<AxiosResponse>(
        `${INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT}/${formId}`,
        {
          data: formId,
        }
      )
      // return data
      deletedForms.push(formId)
    } catch (error) {
      console.log('~!@# error: ', error)
      throw error
    }
  }

  return deletedForms
}

export function useDeleteForms(): IFormDeleteAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(deleteForms, {
    onSuccess: (formIds: string[]) => {
      queryClient.setQueryData<IInstitutionalizationForm[]>(
        [INSTITUTIONALIZATION_FORMS_LIST_QUERY],
        (oldForms) => removeMany(oldForms, formIds)
      )
    },
  })

  return {
    isDeleting: isLoading,
    deleteForms: mutateAsync,
    errorDeleteForm: error,
  }
}

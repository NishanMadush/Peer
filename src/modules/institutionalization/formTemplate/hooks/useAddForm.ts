import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { addOne } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_FORMS_LIST_QUERY } from '../constants/queryKeys'
import {
  IFormAddAction,
  IInstitutionalizationForm,
} from '../interfacesAndTypes/forms'

const addForm = async (
  form: IInstitutionalizationForm
): Promise<IInstitutionalizationForm> => {
  const { data } = await ApiService.post<AxiosResponse>(
    INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT,
    form
  )
  return data as unknown as IInstitutionalizationForm
}

export function useAddForm(): IFormAddAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(addForm, {
    onSuccess: (form: IInstitutionalizationForm) => {
      queryClient.setQueryData<IInstitutionalizationForm[]>(
        [INSTITUTIONALIZATION_FORMS_LIST_QUERY],
        (oldForms) => addOne(oldForms, form)
      )
    },
  })

  return { isAdding: isLoading, addForm: mutateAsync, errorAddForm: error }
}

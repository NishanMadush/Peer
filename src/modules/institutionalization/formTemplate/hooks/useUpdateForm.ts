import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

import { updateOne } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_FORMS_LIST_QUERY } from '../constants/queryKeys'
import {
  IFormUpdateAction,
  IInstitutionalizationForm,
} from '../interfacesAndTypes/forms'

const updateForm = async (
  form: Partial<IInstitutionalizationForm>
): Promise<any> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${INSTITUTIONALIZATION_FORMS_TEMPLATES_CRUD_ENDPOINT}/${form.id}`,
    lodash.omit(form, ['id'])
  )
  return data
}

export function useUpdateForm(): IFormUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(updateForm, {
    onSuccess: (form: IInstitutionalizationForm) => {
      queryClient.setQueryData<IInstitutionalizationForm[]>(
        [INSTITUTIONALIZATION_FORMS_LIST_QUERY],
        (oldForms) => updateOne(oldForms, form)
      )
    },
  })

  return {
    isUpdating: isLoading,
    updateForm: mutateAsync,
    errorUpdateForm: error,
  }
}

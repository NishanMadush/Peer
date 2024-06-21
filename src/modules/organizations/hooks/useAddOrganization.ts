import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { addOne } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { ORGANIZATIONS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { ORGANIZATION_LIST_QUERY } from '../constants/queryKeys'
import {
  IOrganization,
  IOrganizationAddAction,
} from '../interfacesAndTypes/organization'

const addOrganization = async (
  organization: IOrganization
): Promise<IOrganization> => {
  const { data } = await ApiService.post<AxiosResponse>(
    ORGANIZATIONS_CRUD_ENDPOINT,
    organization
  )
  return data as unknown as IOrganization
}

export function useAddOrganization(): IOrganizationAddAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(addOrganization, {
    onSuccess: (organization: IOrganization) => {
      queryClient.setQueryData<IOrganization[]>(
        [ORGANIZATION_LIST_QUERY],
        (oldOrganizations) => addOne(oldOrganizations, organization)
      )
    },
  })

  return {
    isAdding: isLoading,
    addOrganization: mutateAsync,
    errorAddOrganization: error,
  }
}

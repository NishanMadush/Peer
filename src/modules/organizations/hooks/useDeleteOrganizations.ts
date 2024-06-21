import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { removeMany } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { ORGANIZATIONS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { ORGANIZATION_LIST_QUERY } from '../constants/queryKeys'
import {
  IOrganization,
  IOrganizationDeleteAction,
} from '../interfacesAndTypes/organization'

const deleteOrganizations = async (organizationIds: string[]): Promise<any> => {
  const deletedOrganizations = []

  for (const organizationId of organizationIds) {
    try {
      const { data } = await ApiService.delete<AxiosResponse>(
        `${ORGANIZATIONS_CRUD_ENDPOINT}/${organizationId}`,
        {
          data: organizationId,
        }
      )
      // return data
      deletedOrganizations.push(organizationId)
    } catch (error) {
      console.log('~!@# error: ', error)
      throw error
    }
  }

  return deletedOrganizations
}

export function useDeleteOrganizations(): IOrganizationDeleteAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(deleteOrganizations, {
    onSuccess: (organizationIds: string[]) => {
      queryClient.setQueryData<IOrganization[]>(
        [ORGANIZATION_LIST_QUERY],
        (oldOrganizations) => removeMany(oldOrganizations, organizationIds)
      )
    },
  })

  return {
    isDeleting: isLoading,
    deleteOrganizations: mutateAsync,
    errorDeleting: error,
  }
}

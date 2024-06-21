import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { IOrganization } from '../../../shared/interfaces/organization'
import { ORGANIZATIONS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { ORGANIZATION_LIST_QUERY_BY_ID } from '../constants/queryKeys'
import { IOrganizationGetAction } from '../interfacesAndTypes/organization'

export const fetchOrganization = async (
  organizationId: string
): Promise<any> => {
  const { data } = await ApiService.get<AxiosResponse>(
    `${ORGANIZATIONS_CRUD_ENDPOINT}/${organizationId}`
  )

  return data as unknown as IOrganization
}

export function useOrganization(): IOrganizationGetAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(fetchOrganization, {
    onSuccess: (organization: IOrganization) => {
      queryClient.setQueryData<IOrganization>(
        [ORGANIZATION_LIST_QUERY_BY_ID],
        organization
      )
    },
  })

  return {
    isLoading,
    getOrganization: mutateAsync,
    errorGetOrganization: error,
  }
}

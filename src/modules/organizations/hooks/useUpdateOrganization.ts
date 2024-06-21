import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

// import { IisUpdateUserInfo } from '../../../base/types/profileInfo'
import { updateOne } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { ORGANIZATIONS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { ORGANIZATION_LIST_QUERY } from '../constants/queryKeys'
import {
  IOrganization,
  IOrganizationUpdateAction,
} from '../interfacesAndTypes/organization'

const updateOrganization = async (
  organization: Partial<IOrganization>
): Promise<any> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${ORGANIZATIONS_CRUD_ENDPOINT}/${organization.id}`,
    lodash.omit(organization, ['id'])
  )
  return data
}

export function useUpdateOrganization(): IOrganizationUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(updateOrganization, {
    onSuccess: (organization: IOrganization) => {
      queryClient.setQueryData<IOrganization[]>(
        [ORGANIZATION_LIST_QUERY],
        (oldOrganizations) => updateOne(oldOrganizations, organization)
      )
    },
  })

  return {
    isUpdating: isLoading,
    updateOrganization: mutateAsync,
    errorUpdate: error,
  }
}

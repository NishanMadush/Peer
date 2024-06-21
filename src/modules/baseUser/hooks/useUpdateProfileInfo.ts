import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { USERS_CRUD_ENDPOINT } from '../../users/constants/apiEndpoints'
import { USER_PROFILE_INFO_QUERY } from '../constants/queryKeys'
import { IProfileUpdateAction, IUser } from '../interfacesAndTypes/profileInfo'

const updateProfileInfo = async (profileInfo: Partial<IUser>): Promise<any> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${USERS_CRUD_ENDPOINT}/${profileInfo.id}/profile`,
    profileInfo
  )
  return data
}

export function useUpdateProfileInfo(): IProfileUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(updateProfileInfo, {
    onSuccess: (profileInfo: IUser) => {
      queryClient.setQueryData([USER_PROFILE_INFO_QUERY], profileInfo)
    },
  })

  return {
    isUpdating: isLoading,
    updateProfileInfo: mutateAsync,
    errorUpdateProfileInfo: error,
  }
}

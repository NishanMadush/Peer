import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { AUTH_USER_UPDATE_PASSWORD_ENDPOINT } from '../constants/apiEndpoints'
import { IAuthUpdatePasswordAction } from '../interfacesAndTypes/authActions'

const updatePassword = async ({
  username,
  oldPassword,
  newPassword,
}: {
  username: string
  oldPassword: string
  newPassword: string
}) => {
  const { data } = await ApiService.post<AxiosResponse>(
    AUTH_USER_UPDATE_PASSWORD_ENDPOINT,
    {
      username,
      oldPassword,
      password: newPassword,
    }
  )
  return data
}

export function useUpdatePassword(): IAuthUpdatePasswordAction {
  const { isLoading, mutateAsync, error } = useMutation(updatePassword)
  return {
    isUpdating: isLoading,
    updatePassword: mutateAsync,
    errorUpdate: error,
  }
}

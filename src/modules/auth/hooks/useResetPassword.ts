import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { AUTH_USER_RESET_PASSWORD_ENDPOINT } from '../constants/apiEndpoints'
import { IAuthResetPasswordAction } from '../interfacesAndTypes/authActions'

const resetPassword = async ({
  code,
  newPassword,
}: {
  code: string
  newPassword: string
}): Promise<any> => {
  const { data } = await ApiService.post<AxiosResponse>(
    `${AUTH_USER_RESET_PASSWORD_ENDPOINT}?token=${code}`,
    {
      code,
      password: newPassword,
    }
  )
  return data
}

export function useResetPassword(): IAuthResetPasswordAction {
  const { isLoading, mutateAsync } = useMutation(resetPassword)
  return { isLoading, resetPassword: mutateAsync }
}

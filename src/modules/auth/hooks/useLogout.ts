import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { AUTH_USER_LOGOUT_ENDPOINT } from '../constants/apiEndpoints'
import { IAuthLogoutAction } from '../interfacesAndTypes/authActions'

const logout = async (token?: string): Promise<any> => {
  const { data } = await ApiService.post<AxiosResponse>(
    AUTH_USER_LOGOUT_ENDPOINT,
    {
      refreshToken: token,
    }
  )
  return data
}

export function useLogout(): IAuthLogoutAction {
  const { isLoading, mutateAsync, error } = useMutation(logout)
  return { isLoggingOut: isLoading, logout: mutateAsync, errorLogout: error }
}

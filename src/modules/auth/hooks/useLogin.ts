import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { AUTH_USER_LOGIN_ENDPOINT } from '../constants/apiEndpoints'
import { IAuthLoginAction } from '../interfacesAndTypes/authActions'

const login = async ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<any> => {
  const { data } = await ApiService.post<AxiosResponse>(
    AUTH_USER_LOGIN_ENDPOINT,
    {
      username: email,
      password,
    }
  )
  return data
}

export function useLogin(): IAuthLoginAction {
  const { isLoading, mutateAsync, error } = useMutation(login)
  return { isLoggingIn: isLoading, login: mutateAsync, errorLogin: error }
}

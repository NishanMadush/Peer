import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { AUTH_USER_CREATE_PASSWORD_ENDPOINT } from '../constants/apiEndpoints'
import { IAuthCreatePasswordAction } from '../interfacesAndTypes/authActions'

const createPassword = async ({
  code,
  password,
}: {
  code: string
  password: string
}): Promise<any> => {
  const { data } = await ApiService.post<AxiosResponse>(
    `${AUTH_USER_CREATE_PASSWORD_ENDPOINT}?token=${code}`,
    {
      code,
      password,
    }
  )
  return data
}

export function useCreatePassword(): IAuthCreatePasswordAction {
  const { isLoading, mutateAsync } = useMutation(createPassword)
  return { isLoading, createPassword: mutateAsync }
}

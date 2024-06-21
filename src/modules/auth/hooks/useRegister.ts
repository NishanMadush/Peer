import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import { AUTH_USER_REGISTER_ENDPOINT } from '../constants/apiEndpoints'
import { IAuthRegisterAction } from '../interfacesAndTypes/authActions'
import { IUser } from '../interfacesAndTypes/userInfo'

const register = async (userInfo: IUser): Promise<any> => {
  const { data } = await ApiService.post<AxiosResponse>(
    AUTH_USER_REGISTER_ENDPOINT,
    {
      userInfo,
    }
  )
  return data
}

export function useRegister(): IAuthRegisterAction {
  const { isLoading, mutateAsync } = useMutation(register)
  return { isRegistering: isLoading, register: mutateAsync }
}

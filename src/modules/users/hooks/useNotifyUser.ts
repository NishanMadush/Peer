import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../services/ApiService'
import {
  USER_NOTIFY_POSTFIX,
  USERS_CRUD_ENDPOINT,
} from '../constants/apiEndpoints'
import { IUser, IUserNotifyAction } from '../interfacesAndTypes/user'

const notifyUser = async (user: Partial<IUser>): Promise<any> => {
  const { data } = await ApiService.post<AxiosResponse>(
    `${USERS_CRUD_ENDPOINT}/${user.id}/${USER_NOTIFY_POSTFIX}`,
    lodash.omit(user, ['id'])
  )
  return data
}

export function useNotifyUser(): IUserNotifyAction {
  const { isLoading, mutateAsync, error } = useMutation(notifyUser, {})

  return {
    isNotifying: isLoading,
    notifyUser: mutateAsync,
    errorNotifyUser: error,
  }
}

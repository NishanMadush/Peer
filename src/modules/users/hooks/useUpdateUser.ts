import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

import { updateOne } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { USERS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { USER_LIST_QUERY } from '../constants/queryKeys'
import { IUser, IUserUpdateAction } from '../interfacesAndTypes/user'

const updateUser = async (user: Partial<IUser>): Promise<any> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${USERS_CRUD_ENDPOINT}/${user.id}`,
    lodash.omit(user, ['id'])
  )
  return data
}

export function useUpdateUser(): IUserUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(updateUser, {
    onSuccess: (user: IUser) => {
      // queryClient.setQueryData<IUser[]>([USER_LIST_QUERY], (oldUsers) =>
      //   updateOne(oldUsers, user)
      // )
      void queryClient.invalidateQueries(USER_LIST_QUERY)
    },
  })

  return {
    isUpdating: isLoading,
    updateUser: mutateAsync,
    errorUpdateUser: error,
  }
}

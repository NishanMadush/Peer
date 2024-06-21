import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { addOne } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { USERS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { USER_LIST_QUERY } from '../constants/queryKeys'
import { IUser, IUserAddAction } from '../interfacesAndTypes/user'

const addUser = async (user: IUser): Promise<IUser> => {
  const { data } = await ApiService.post<AxiosResponse>(
    USERS_CRUD_ENDPOINT,
    user
  )
  return data as unknown as IUser
}

export function useAddUser(): IUserAddAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(addUser, {
    onSuccess: (user: IUser) => {
      // queryClient.setQueryData<IUser[]>([USER_LIST_QUERY], (oldUsers) =>
      //   addOne(oldUsers, user)
      // )
      void queryClient.invalidateQueries(USER_LIST_QUERY)
    },
  })

  return { isAdding: isLoading, addUser: mutateAsync, errorAddUser: error }
}

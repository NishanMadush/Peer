import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { removeMany } from '../../../core/utils/crudUtils'
import { ApiService } from '../../../services/ApiService'
import { USERS_CRUD_ENDPOINT } from '../constants/apiEndpoints'
import { USER_LIST_QUERY } from '../constants/queryKeys'
import { IUser, IUserDeleteAction } from '../interfacesAndTypes/user'

const deleteUsers = async (userIds: string[]): Promise<any> => {
  const deletedUsers = []

  for (const userId of userIds) {
    try {
      const { data } = await ApiService.delete<AxiosResponse>(
        `${USERS_CRUD_ENDPOINT}/${userId}`,
        {
          data: userId,
        }
      )
      // return data
      deletedUsers.push(userId)
    } catch (error) {
      console.log('~!@# error: ', error)
      throw error
    }
  }

  return deletedUsers
}

export function useDeleteUsers(): IUserDeleteAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(deleteUsers, {
    onSuccess: (userIds: string[]) => {
      // queryClient.setQueryData<IUser[]>([USER_LIST_QUERY], (oldUsers) =>
      //   removeMany(oldUsers, userIds)
      // )
      void queryClient.invalidateQueries(USER_LIST_QUERY)
    },
  })

  return {
    isDeleting: isLoading,
    deleteUsers: mutateAsync,
    errorDeleteUser: error,
  }
}

import { useMutation, useQueryClient } from 'react-query'

import { USER_PROFILE_BASICS_QUERY } from '../../baseUser/constants/queryKeys'
import { fetchProfileInfo } from '../../baseUser/hooks/useProfileInfo'
import { fetchOrganization } from '../../organizations/hooks/useOrganization'
import { IOrganization } from '../../organizations/interfacesAndTypes/organization'
import {
  IGetProfileBasicsAction,
  IProfileBasics,
} from '../interfacesAndTypes/profile'
import { IUser } from '../interfacesAndTypes/user'

const getBasics = async (userId: string): Promise<IProfileBasics> => {
  // Get user profile
  const profileData = await fetchProfileInfo(`${userId}`)
  const profiles = profileData as unknown as IUser

  // Get user organization
  const organizationData = await fetchOrganization(
    `${profiles?.employment?.organization.organizationId}`
  )
  const organization = organizationData as unknown as IOrganization

  const basics = {
    profileId: `${userId}`,
    organizationId: `${organization?.id}`,
    branchId: `${profiles?.employment?.branch?.branchId}`,
    countryId: `${organization?.countryId}`,
    languageId: `${profiles?.languageId}`,
  }

  return basics
}

export function useProfileBasics(): IGetProfileBasicsAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(getBasics, {
    onSuccess: (profileBasic: IProfileBasics) => {
      queryClient.setQueryData<IProfileBasics>(
        USER_PROFILE_BASICS_QUERY,
        profileBasic
      )
    },
  })

  return {
    isLoading,
    getProfileBasics: mutateAsync,
    errorGetProfileBasics: error,
  }
}

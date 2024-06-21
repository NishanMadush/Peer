import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { addOne } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_LIST_QUERY } from '../constants/queryKeys'
import {
  IInstitutionalizationOrganization,
  IOrganizationAssessmentAddAction,
} from '../interfacesAndTypes/organization'

const addOrganizationAssessment = async (
  organizationAssessment: IInstitutionalizationOrganization
): Promise<IInstitutionalizationOrganization> => {
  const { data } = await ApiService.post<AxiosResponse>(
    INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT,
    organizationAssessment
  )
  return data as unknown as IInstitutionalizationOrganization
}

export function useAddOrganizationAssessment(): IOrganizationAssessmentAddAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(
    addOrganizationAssessment,
    {
      onSuccess: (
        organizationAssessment: IInstitutionalizationOrganization
      ) => {
        queryClient.setQueryData<IInstitutionalizationOrganization[]>(
          [INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_LIST_QUERY],
          (oldCountryAssessments) =>
            addOne(oldCountryAssessments, organizationAssessment)
        )
      },
    }
  )

  return {
    isAdding: isLoading,
    addOrganizationAssessment: mutateAsync,
    errorAddAssessment: error,
  }
}

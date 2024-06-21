import { AxiosResponse } from 'axios'
import lodash from 'lodash'
import { useMutation, useQueryClient } from 'react-query'

import { updateOne } from '../../../../core/utils/crudUtils'
import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENT_UPDATE_QUERY } from '../constants/queryKeys'
import {
  IInstitutionalizationOrganization,
  IOrganizationAssessmentUpdateAction,
} from '../interfacesAndTypes/organization'

const updateOrganizationAssessment = async (
  organizationAssessment: IInstitutionalizationOrganization
): Promise<IInstitutionalizationOrganization> => {
  const { data } = await ApiService.patch<AxiosResponse>(
    `${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT}/${organizationAssessment.id}`,
    lodash.omit(organizationAssessment, [
      'id',
      'countryId',
      'languageId',
      'trainingComponent',
      'organizationId',
      'countryReviewId',
    ])
  )
  return data as unknown as IInstitutionalizationOrganization
}

export function useUpdateOrganizationAssessment(): IOrganizationAssessmentUpdateAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(
    updateOrganizationAssessment,
    {
      onSuccess: (
        organizationAssessment: IInstitutionalizationOrganization
      ) => {
        queryClient.setQueryData<IInstitutionalizationOrganization[]>(
          [INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENT_UPDATE_QUERY],
          (oldCountryAssessments) =>
            updateOne(oldCountryAssessments, organizationAssessment)
        )
      },
    }
  )

  return {
    isUpdating: isLoading,
    updateOrganizationAssessment: mutateAsync,
    errorUpdateAssessment: error,
  }
}

import { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { ApiService } from '../../../../services/ApiService'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT } from '../constants/apiEndpoints'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENT_BY_ID_QUERY } from '../constants/queryKeys'
import {
  IInstitutionalizationOrganization,
  IOrganizationAssessmentGetAction,
} from '../interfacesAndTypes/organization'

const fetchAssessment = async (assessmentId: string): Promise<any> => {
  try {
    const { data } = await ApiService.get<AxiosResponse>(
      `${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_ENDPOINT}/${assessmentId}`
    )
    return data as unknown as IInstitutionalizationOrganization
  } catch (error: any) {
    console.log('~!@# fetch assessment error: ', error)
  }
}

export function useOrganizationAssessment(): IOrganizationAssessmentGetAction {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync, error } = useMutation(fetchAssessment, {
    onSuccess: (organizationAssessment: IInstitutionalizationOrganization) => {
      queryClient.setQueryData<IInstitutionalizationOrganization>(
        [INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENT_BY_ID_QUERY],
        organizationAssessment
      )
    },
  })

  return {
    isLoading,
    getAssessment: mutateAsync,
    errorGetAssessment: error,
  }
}

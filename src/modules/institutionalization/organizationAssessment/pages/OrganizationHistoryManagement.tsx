import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Fab, IconButton, InputAdornment, TextField } from '@mui/material'
import lodash, { groupBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../../auth/contexts/AuthProvider'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import {
  accessType,
  authorization,
} from '../../../baseUser/config/authorization'
import {
  DEFAULT_OBJECT_ID,
  DefaultUsers,
} from '../../../baseUser/constants/helper'
import { ROOT_ROUTE } from '../../../baseUser/constants/routes'
import { useCountries } from '../../../countries/hooks/useCountries'
import { useOrganizations } from '../../../organizations/hooks/useOrganizations'
import { useCountryReview } from '../../countryReview/hooks/useCountryReview'
import { useCountryReviews } from '../../countryReview/hooks/useCountryReviews'
import AssessmentHistoryGraph from '../components/AssessmentHistoryGraph'
import AssessmentHistoryTable from '../components/AssessmentHistoryTable'
import {
  INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE,
} from '../constants/routes'
import { useActiveCountryReview } from '../hooks/useActiveCountryReview'
import { useOrganizationAssessmentWithFilter } from '../hooks/useOrganizationAssessmentWithFilter'
import {
  AssessmentStatusEnum,
  IInstitutionalizationCountryReview,
  IInstitutionalizationOrganization,
  IUiTrainingComponent,
} from '../interfacesAndTypes/organization'

const pathPage =
  'institutionalization.organizationAssessment.pages.OrganizationHistoryManagement'

const InstitutionalizationOrganizationCourseManagement = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { userInfo } = useAuth() // Step1: Get logged in user information
  const { isLoading, getCountryReview } = useCountryReview()
  const { data: dataCountryReviews } = useCountryReviews()
  const { data: countriesData } = useCountries()
  const { data: detailedBranch } = useOrganizations()
  const filter =
    userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR ||
    userInfo.role === DefaultUsers.ADPC_ADMINISTRATOR
      ? ``
      : userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR
      ? `?countryId=${
          userInfo?.employment?.organization?.organizationId?.countryId ??
          DEFAULT_OBJECT_ID
        }`
      : userInfo.role === DefaultUsers.ORGANIZATION_USER
      ? `?organizationId=${
          userInfo?.employment?.organization?.organizationId?.id ??
          DEFAULT_OBJECT_ID
        }`
      : `?countryId=${DEFAULT_OBJECT_ID}`

  const { isLoading: isLoadingAssessments, getAssessments } =
    useOrganizationAssessmentWithFilter(filter)

  const [showTable, setShowTable] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [assessmentHistory, setAssessmentHistory] = useState<
    IInstitutionalizationOrganization[] | undefined
  >(undefined)
  const [detailCountryReviews, setDetailCountryReviews] = useState<
    IInstitutionalizationOrganization[] | undefined
  >(undefined)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  // Extract the countryReviewId from the query parameters
  const countryReviewIdParam = searchParams.get('countryReviewId')
  useEffect(() => {
    const getUiTrainingComponents = async () => {
      try {
        // Get assessments for my organization
        const myOrganizationAssessments = await getAssessments({})

        // Filter assessments by countryReviewId if the parameter is present in the URL
        const filteredAssessments = countryReviewIdParam
          ? lodash.filter(myOrganizationAssessments, {
              countryReviewId: countryReviewIdParam,
            })
          : myOrganizationAssessments

        setAssessmentHistory(filteredAssessments ?? [])
      } catch (error) {
        console.log('~!@# catch error: ', error)
      }
    }

    // Call the API to get the assessments and filter the results
    void getUiTrainingComponents().catch((error) => {
      console.log('~!@# catch error: ', error)
    })
  }, [showTable, countryReviewIdParam])

  // useEffect(() => {
  //   const getActiveReview = async () => {
  //     try {
  //       // Get assessments for my organization
  //       await getCountryReview()

  //       // Filter assessments by countryReviewId if the parameter is present in the URL

  //       setDetailCountryReview
  //     } catch (error) {
  //       console.log('~!@# catch error: ', error)
  //     }
  //   }

  // Call the API to get the assessments and filter the results
  //   void getActiveReview().catch((error) => {
  //     console.log('~!@# catch error: ', error)
  //   })
  // }, [])

  const processing = false //isLoading

  const handleSelectedChange = () => {
    // setOpenFormModuleDialog(true)
  }

  // const handleAddAssessmentHistory = (id: any) => {
  //   const selectedAssessment = assessmentHistory?.find(
  //     (assessment) => assessment.id === id
  //   )
  //   const selectedCountryReview = assessmentHistory?.find((assessment) => {
  //     return dataCountryReviews?.some(
  //       (countryReview) => countryReview.id === assessment.countryReviewId
  //     )
  //   })

  //   // if (selectedAssessment) {
  //   //   if (selectedAssessment.status === AssessmentStatusEnum.Progress) {
  //   //     // Hide the table
  //   //     setShowTable(false)
  //   //     navigate(
  //   //       `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE}`
  //   //     )
  //   //   } else if (selectedAssessment.status === AssessmentStatusEnum.Complete) {
  //   //     // Navigate to the desired link
  //   //     navigate(
  //   //       `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${id}`
  //   //     )
  //   //   }
  //   // }

  //   if (selectedAssessment) {
  //     if (selectedAssessment.status === AssessmentStatusEnum.Progress) {
  //       if (selectedCountryReview. === AssessmentStatusEnum.Progress) {
  //         // Navigate to courses management when both assessment and country review are in progress
  //         navigate(
  //           `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE}`
  //         )
  //       } else {
  //         // Navigate to assessment management when assessment is in progress but country review isn't
  //         navigate(
  //           `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${id}`
  //         )
  //       }
  //     } else if (selectedAssessment.status === AssessmentStatusEnum.Complete) {
  //       // Navigate to assessment management for completed assessments
  //       navigate(
  //         `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${id}`
  //       )
  //     }
  //   }
  // }
  const handleAddAssessmentHistory = (id: any) => {
    const selectedAssessment = assessmentHistory?.find(
      (assessment) => assessment.id === id
    )

    if (selectedAssessment) {
      const selectedCountryReview = dataCountryReviews?.find(
        (countryReview) =>
          countryReview.id === selectedAssessment.countryReviewId
      )

      if (selectedCountryReview) {
        if (selectedAssessment.status === AssessmentStatusEnum.Progress) {
          if (selectedCountryReview.status === AssessmentStatusEnum.Progress) {
            // Navigate to courses management when both assessment and country review are in progress
            navigate(
              `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE}`
            )
          } else {
            // Navigate to assessment management when assessment is in progress but country review isn't
            navigate(
              `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${id}`
            )
          }
        } else if (
          selectedAssessment.status === AssessmentStatusEnum.Complete
        ) {
          // Navigate to assessment management for completed assessments
          navigate(
            `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${id}`
          )
        }
      }
    }
  }

  const handleDrawChart = (data: IInstitutionalizationOrganization[]) => {
    setDetailCountryReviews(data)
  }

  // const [searchQuery, setSearchQuery] = useState('')

  // const [filteredAssessments, setFilteredCountryReviews] =
  //   useState(assessmentHistory)

  // const handleSearch = () => {
  //   const filteredAssessments = assessmentHistory?.filter((assessment) =>
  //     assessment.countryReviewId
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase())
  //   )

  //   setFilteredCountryReviews(filteredAssessments)
  // }

  // const handleSearchChange = (event: any) => {
  //   const newSearchQuery = event.target.value
  //   setSearchQuery(newSearchQuery)

  //   if (newSearchQuery === '') {
  //     setFilteredCountryReviews(assessmentHistory)
  //   }
  // }

  return (
    <React.Fragment>
      <BaseAppBar>
        <BaseToolbar
          title={t(
            'institutionalization:organizationCourseManagement.toolbar.title'
          )}
        >
          {authorization(
            userInfo?.role,
            pathPage,
            'button.add',
            accessType.Enable
          ) && (
            <Fab
              aria-label="manage-training-components"
              color="primary"
              disabled={processing}
              size="small"
              href={`${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE}`}
            >
              <AddIcon />
            </Fab>
          )}
        </BaseToolbar>
      </BaseAppBar>

      {detailCountryReviews ? (
        <AssessmentHistoryGraph
          processing={processing}
          detailCountryReviews={detailCountryReviews}
        />
      ) : assessmentHistory ? (
        <AssessmentHistoryTable
          processing={processing}
          organizationAssessments={assessmentHistory}
          countryReviews={dataCountryReviews}
          countries={countriesData}
          organizations={detailedBranch}
          onDetailAssessmentHistory={handleAddAssessmentHistory}
          onSelectedChange={handleSelectedChange}
          selected={selected}
          onDrawChart={handleDrawChart}
          auth={userInfo}
        />
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}

export default InstitutionalizationOrganizationCourseManagement

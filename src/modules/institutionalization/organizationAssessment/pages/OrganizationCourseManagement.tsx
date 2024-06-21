import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SchoolIcon from '@mui/icons-material/School'
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Fab,
  Grid,
  Typography,
} from '@mui/material'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ReactComponent as StartupSvg } from '../../../../core/assets/startup.svg'
import SvgContainer from '../../../../core/components/SvgContainer'
import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import { useAuth } from '../../../auth/contexts/AuthProvider'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import { DefaultUsers } from '../../../baseUser/constants/helper'
import { ROOT_ROUTE } from '../../../baseUser/constants/routes'
import { IProfileBasics } from '../../../users/interfacesAndTypes/profile'
import { useActiveFormTemplate } from '../../formTemplate/hooks/useActiveForm'
import {
  INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE,
} from '../constants/routes'
import { useActiveCountryReview } from '../hooks/useActiveCountryReview'
import { useAddOrganizationAssessment } from '../hooks/useAddOrganizationAssesment'
import { useOrganizationAssessmentWithFilter } from '../hooks/useOrganizationAssessmentWithFilter'
import { useProfileBasics } from '../hooks/useProfileBasics'
import {
  AssessmentStatusEnum,
  IInstitutionalizationOrganization,
  IUiTrainingComponent,
} from '../interfacesAndTypes/organization'

const InstitutionalizationOrganizationCourseManagement = (): JSX.Element => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const { getProfileBasics } = useProfileBasics()
  const { isLoading, getActiveCountryReview } = useActiveCountryReview()
  const { data: activeEmptyForm } = useActiveFormTemplate()
  const { isAdding, addOrganizationAssessment } = useAddOrganizationAssessment()
  const { isLoading: isLoadingAssessments, getAssessments } =
    useOrganizationAssessmentWithFilter()

  const [uiTrainingComponentsGlobal, setUiTrainingComponentsGlobal] = useState<
    IUiTrainingComponent[] | undefined
  >(undefined)
  const [profileBasics, setProfileBasics] = useState<
    IProfileBasics | undefined
  >(undefined)

  const processing = false

  useEffect(() => {
    if (!userInfo) {
      snackbar.error('Relevant user information is not available')
      return
    }
    if (userInfo.role !== DefaultUsers.ORGANIZATION_USER) {
      snackbar.error('You are not authorized to access ongoing assessments!')
      return
    }
    console.log('~!@# userInfo: ', userInfo?.id)

    getProfileBasics(userInfo?.id)
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
      .then((profileBasics: IProfileBasics) => {
        console.log('~!@# profileBasics: ', profileBasics)
        if (!profileBasics) {
          snackbar.error('Relevant profile information is not available')
          return
        }
        setProfileBasics(profileBasics)
      })
  }, [userInfo])

  useEffect(() => {
    const getUiTrainingComponents = async () => {
      try {
        if (!profileBasics) {
          // snackbar.error('Relevant profile information is not available')
          return
        }
        // Get assessments for my organization
        const myOrganizationAssessments = await getAssessments({})
        const filteredAssessments = profileBasics.organizationId
          ? lodash.filter(myOrganizationAssessments, {
              organizationId: profileBasics.organizationId,
            })
          : myOrganizationAssessments

        console.log('------------------------> 1')
        console.log('~!@# myOrganizationAssessments: ', filteredAssessments)
        // Below sections only need for the training modules
        // Note: Otherwise all the errors will show ones
        // Check for a on going country review
        const countryReview = await getActiveCountryReview(
          profileBasics.countryId
        )
        console.log('~!@# countryReview: ', countryReview)
        console.log('------------------------> 3')
        if (!countryReview) {
          snackbar.error(
            'There is no on going PEER review process for your country. Please contact administrator for more information'
          )
          return
        }
        if (!countryReview?.trainingComponents) {
          snackbar.error(
            'There is no on going PEER review training components for your country. Please contact administrator for more information'
          )
          return
        }

        // Update with filter
        // Check the currently filled assessments
        let currentAnswers: any[] = []
        if (filteredAssessments) {
          // Get the current organization assessment status under the country review
          currentAnswers = lodash.filter(filteredAssessments, {
            countryReviewId: countryReview?.id,
          })
        }
        console.log('------------------------> 4')
        console.log('------------------------> currentAnswers', currentAnswers)
        // Check the status for each training component
        const uiTrainingComponents: IUiTrainingComponent[] = []
        countryReview.trainingComponents.forEach((course: any) => {
          console.log('------------------------> course', course)
          try {
            const userAnswer = lodash.find(currentAnswers, {
              trainingComponent: course.code,
            })
            console.log('------------------------> userAnswer', userAnswer)
            if (userAnswer) {
              uiTrainingComponents.push({
                assessmentId: userAnswer.id,
                countryId: userAnswer.countryId,
                organizationId: userAnswer.organizationId,
                countryReviewId: userAnswer.countryReviewId,
                trainingComponent: {
                  code: userAnswer.trainingComponent,
                  name: course.name ?? undefined,
                },
                status: userAnswer.status,
              })
            } else {
              uiTrainingComponents.push({
                assessmentId: undefined,
                countryId: profileBasics.countryId,
                organizationId: profileBasics.organizationId,
                countryReviewId: countryReview.id,
                trainingComponent: {
                  code: course.code,
                  name: course.name,
                },
                status: undefined,
              })
            }
          } catch (error) {
            console.log('~!@# catch error: ', error)
          }
        })
        setUiTrainingComponentsGlobal(uiTrainingComponents)
      } catch (error) {
        console.log('~!@# catch error: ', error)
      }
    }
    void getUiTrainingComponents().catch((error) => {
      console.log('~!@# catch error: ', error)
    })
  }, [profileBasics])
  const handleCardClick = (component: any) => {
    console.log(component)

    const addOrganizationAssessmentParams = {
      countryId: component?.countryId,
      organizationId: component?.organizationId,
      countryReviewId: component?.countryReviewId,
      trainingComponent: component?.trainingComponent.code,
      status: AssessmentStatusEnum.Progress,
      start: Date.now(),
      complete: Date.now(),
      timeZone: 'Colombo',
      languageId: userInfo?.languageId,
      institutionalization: {
        formId: activeEmptyForm?.id,
        ...lodash.omit(activeEmptyForm, ['id']),
      },
    }

    if (component?.assessmentId) {
      navigate(
        `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${component.assessmentId}`
      )
    } else {
      addOrganizationAssessment(addOrganizationAssessmentParams)
        .then((answer: any) => {
          console.log(answer)
          navigate(
            `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${answer.id}`
          )
        })
        .catch((error: any) => {
          console.log(error)
          snackbar.error(
            error?.message ?? t('Unexpected error. Please try again later')
          )
        })
    }
  }

  return (
    <React.Fragment>
      <BaseAppBar>
        <BaseToolbar
          title={t(
            'institutionalization:organizationCourseManagement.toolbar.title'
          )}
        >
          <Fab
            aria-label="back-institutionalization-organization"
            color="secondary"
            disabled={processing}
            size="small"
            href={`${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}`}
          >
            <ArrowBackIcon />
          </Fab>
        </BaseToolbar>
      </BaseAppBar>
      <Container maxWidth="xs" sx={{ mt: 3 }}>
        <SvgContainer>
          <StartupSvg /*fill="black" stroke="#ac0b0b"*/ />
        </SvgContainer>
      </Container>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {uiTrainingComponentsGlobal?.map((component, index) => (
          <Grid item xs={12} md={6} lg={3} key={`course${index}`}>
            <Card>
              <CardActionArea
                disabled={false}
                onClick={() => handleCardClick(component)}
              >
                <CardHeader
                  avatar={
                    <Avatar aria-label="Guides icon">
                      <SchoolIcon />
                    </Avatar>
                  }
                  title={component?.trainingComponent?.code}
                />
                <CardContent>
                  <Chip
                    color={
                      component?.status === AssessmentStatusEnum.Progress
                        ? 'primary'
                        : 'default'
                    }
                    label={component?.status ?? AssessmentStatusEnum.Pending}
                    disabled={processing}
                    size="small"
                    sx={{ marginTop: -3 }}
                  />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {component?.trainingComponent?.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  )
}

export default InstitutionalizationOrganizationCourseManagement

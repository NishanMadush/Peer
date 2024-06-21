import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BarChartIcon from '@mui/icons-material/BarChart'
import PrintIcon from '@mui/icons-material/Print'
import { Fab } from '@mui/material'
import { indigo } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import ConfirmDialog from '../../../../core/components/ConfirmDialog'
import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import { ROOT_ROUTE } from '../../../baseUser/constants/routes'
import { useCountryReview } from '../../countryReview/hooks/useCountryReview'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE } from '../../print/constants/routes'
import AssessmentTable from '../components/AssessmentAnswer'
import {
  INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE,
} from '../constants/routes'
import { useOrganizationAssessment } from '../hooks/useOrganizationAssessment'
import { useUpdateOrganizationAssessment } from '../hooks/useUpdateOrganizationAssesment'
import {
  AssessmentStatusEnum,
  IInstitutionalizationCountryReview,
  IInstitutionalizationOrganization,
} from '../interfacesAndTypes/organization'

const InstitutionalizationOrganizationAssessmentManagement =
  (): JSX.Element => {
    const location = useLocation()
    const { t } = useTranslation()
    const snackbar = useSnackbar()
    const navigate = useNavigate()
    const { isLoading, getAssessment } = useOrganizationAssessment()
    const { isUpdating, updateOrganizationAssessment } =
      useUpdateOrganizationAssessment()
    const { isLoading: isLoadingReview, getCountryReview } = useCountryReview()

    const [openConfirmAnswerSaveDialog, setOpenConfirmAnswerSaveDialog] =
      useState(false)
    const [organizationAssessment, setOrganizationAssessment] = useState<
      undefined | IInstitutionalizationOrganization
    >(undefined)
    const [assessmentAnswerCalculated, setAssessmentAnswerCalculated] =
      useState<undefined | IInstitutionalizationOrganization>(undefined)
    const [readOnly, setReadOnly] = useState<boolean>(false)

    const processing = isLoading || isUpdating || isLoadingReview

    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
      if (refresh) {
        setRefresh(false)
      }
    }, [refresh])

    useEffect(() => {
      // Note: href pop order matters
      const hrefParts = location.pathname.split('/')
      const assessmentId = hrefParts.pop()

      if (assessmentId && assessmentId?.length === 24) {
        getAssessment(assessmentId)
          .then((resultAssessment: IInstitutionalizationOrganization) => {
            setReadOnly(
              resultAssessment.status === AssessmentStatusEnum.Progress
                ? false
                : true
            )
            setOrganizationAssessment(resultAssessment)
            // If the related country review is not active, make the assessment read only
            getCountryReview(resultAssessment?.countryReviewId)
              .then((review: IInstitutionalizationCountryReview) => {
                if (review?.status !== AssessmentStatusEnum.Progress) {
                  setReadOnly(true)
                }
              })
              .catch((error: Error) => {
                console.error(error)
              })
          })
          .catch((err: Error) => {
            snackbar.error(
              err.message ?? t('common.errors.unexpected.subTitle')
            )
          })
      }
    }, [location.pathname])

    const handleSaveAnswer = async (assessmentAnswerUpdated: any, id: any) => {
      // TODO: Do necessary calculations, and decide whether a compete or partly save

      let completedAnswer = true

      // setOpenFormModuleDialog(true)
      if (assessmentAnswerUpdated) {
        // Calculate indicator scores
        assessmentAnswerUpdated.institutionalization.modules.forEach(
          (module: any) => {
            module.indicators.forEach((indicator: any) => {
              indicator.indicatorScore = (
                indicator.weight * indicator.scale
              ).toFixed(2)
              if (indicator.scale <= 0) completedAnswer = false
            })
            // Calculate module score
            const totalIndicatorScore = module.indicators.reduce(
              (total: any, indicator: any) =>
                total + Number(indicator.indicatorScore),
              0
            )
            module.moduleScore = totalIndicatorScore.toFixed(2)

            // Assign module classification based on the module score
            if (module.moduleScore < 3) {
              module.moduleClassification = 'A'
            } else if (module.moduleScore === 3) {
              module.moduleClassification = 'B'
            } else {
              module.moduleClassification = 'C'
            }
          }
        )
        // console.log('#$%^', completedAnswer)

        // Calculate institutionalization score
        const totalModuleScore =
          assessmentAnswerUpdated.institutionalization.modules.reduce(
            (total: any, module: any) => total + Number(module.moduleScore),
            0
          )
        assessmentAnswerUpdated.institutionalization.score = (
          totalModuleScore /
            assessmentAnswerUpdated.institutionalization.modules.length || 0
        ).toFixed(2)

        // Assign classification based on the score
        if (assessmentAnswerUpdated.institutionalization.score < 3) {
          assessmentAnswerUpdated.institutionalization.classification = 'A'
        } else if (assessmentAnswerUpdated.institutionalization.score === 3) {
          assessmentAnswerUpdated.institutionalization.classification = 'B'
        } else {
          assessmentAnswerUpdated.institutionalization.classification = 'C'
        }

        if (assessmentAnswerUpdated.status === AssessmentStatusEnum.Progress) {
          if (completedAnswer) {
            setOpenConfirmAnswerSaveDialog(true)
            setAssessmentAnswerCalculated(assessmentAnswerUpdated)
          } else {
            void updateAssessmentAnswer(assessmentAnswerUpdated)
          }
        } else {
          snackbar.error('Cannot update assessment in this status')
          setOpenConfirmAnswerSaveDialog(false)
        }
      } else {
        snackbar.error('Nothing to update')
        setOpenConfirmAnswerSaveDialog(false)
      }
    }

    const updateAssessmentAnswer = async (answerCalculated: any) => {
      const updateResult = await updateOrganizationAssessment({
        ...answerCalculated,
      }).catch((error: any) => {
        snackbar.error(error?.message ?? 'error')
      })

      if (updateResult) {
        snackbar.success('Assessment updated')
      } else {
        snackbar.error('Update failed')
        setOpenConfirmAnswerSaveDialog(false)
      }
    }
    const handleSaveConfirmAnswerSaveDialog = () => {
      if (organizationAssessment) {
        const updatedAnswerCalculated = {
          ...assessmentAnswerCalculated,
          status: AssessmentStatusEnum.Complete,
        }

        // Call the updateAssessmentAnswer function with the updated answer
        void updateAssessmentAnswer(updatedAnswerCalculated)

        // if (organizationAssessment.id) {
        //   const path = `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${organizationAssessment.id}`

        //   // Call the navigate function with the path
        //   navigate(path)

        //   setOrganizationAssessment
        // }

        setOpenConfirmAnswerSaveDialog(false)
      }
    }

    const handleCloseConfirmAnswerSaveDialog = () => {
      setOpenConfirmAnswerSaveDialog(false)
      void updateAssessmentAnswer(assessmentAnswerCalculated)
    }

    return (
      <React.Fragment>
        {organizationAssessment &&
          organizationAssessment.status === AssessmentStatusEnum.Complete && (
            <BaseAppBar>
              <BaseToolbar
                title={t(
                  'institutionalization:organizationAssessmentManagement.toolbar.title'
                )}
              >
                <>
                  <Fab
                    aria-label="back-institutionalization-organization"
                    color="secondary"
                    disabled={processing}
                    size="small"
                    href={`${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}`}
                    style={{ marginRight: 10 }}
                  >
                    <ArrowBackIcon />
                  </Fab>
                  <Fab
                    aria-label="delete-institutionalization-forms"
                    color="secondary"
                    disabled={processing}
                    href={`/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE}/${organizationAssessment?.id}/graph`}
                    size="small"
                    style={{ marginRight: 10 }}
                  >
                    <BarChartIcon />
                  </Fab>
                  <Fab
                    aria-label="delete-institutionalization-forms"
                    color="primary"
                    disabled={processing}
                    href={`/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE}/${organizationAssessment?.id}/report`}
                    size="small"
                    style={{ marginRight: 10 }}
                  >
                    <PrintIcon />
                  </Fab>
                </>
              </BaseToolbar>
            </BaseAppBar>
          )}

        {organizationAssessment && (
          <AssessmentTable
            processing={processing}
            readOnly={readOnly}
            assessmentAnswer={organizationAssessment}
            onSaveAnswer={handleSaveAnswer}
          />
        )}

        <ConfirmDialog
          description={t(
            'institutionalization:organizationAssessmentManagement.confirmations.saveAnswer'
          )}
          pending={processing}
          onClose={handleCloseConfirmAnswerSaveDialog}
          onConfirm={handleSaveConfirmAnswerSaveDialog}
          open={openConfirmAnswerSaveDialog}
          title={t('common:common.confirmation')}
        />
      </React.Fragment>
    )
  }

export default InstitutionalizationOrganizationAssessmentManagement

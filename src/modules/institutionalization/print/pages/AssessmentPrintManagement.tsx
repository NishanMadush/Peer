import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PrintIcon from '@mui/icons-material/Print'
import { Fab, Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import NotFound from '../../../../core/pages/NotFound'
import { IInstitutionalizationOrganization } from '../../../../shared/interfaces/institutionalization'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import { ROOT_ROUTE } from '../../../baseUser/constants/routes'
import { useOrganizations } from '../../../organizations/hooks/useOrganizations'
import { useCountryReviews } from '../../countryReview/hooks/useCountryReviews'
import { INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE } from '../../organizationAssessment/constants/routes'
import PrintAssessment from '../components/PrintAssessment'
import PrintGraph from '../components/PrintGraph'
import {
  INSTITUTIONALIZATION_PRINT_ROUTE_POSTFIX_GRAPH,
  INSTITUTIONALIZATION_PRINT_ROUTE_POSTFIX_REPORT,
} from '../constants/routes'
import { useOrganizationAssessment } from '../hooks/useOrganizationAssessment'

const InstitutionalizationAssessmentPrint = (): JSX.Element => {
  const location = useLocation()
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const { data: organizations } = useOrganizations()
  const { data: dataCountryReviews } = useCountryReviews()
  const { isLoading, getAssessment } = useOrganizationAssessment()

  const [organizationAssessment, setOrganizationAssessment] = useState<
    undefined | IInstitutionalizationOrganization
  >(undefined)
  const [isPrinting, setIsPrinting] = useState<boolean>(true)
  const [itemType, setItemType] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    // Note: href pop order matters
    const hrefParts = location.pathname.split('/')
    const assessmentItem = hrefParts.pop()
    const assessmentId = hrefParts.pop()

    console.log('assessmentId ', assessmentId)
    console.log('assessmentItem ', assessmentItem)

    setItemType(assessmentItem)

    if (assessmentId && assessmentId?.length === 24) {
      getAssessment(assessmentId)
        .then((resultAssessment: IInstitutionalizationOrganization) => {
          setOrganizationAssessment(resultAssessment)
        })
        .catch((err: Error) => {
          snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
        })
    }
  }, [location.pathname])

  // useEffect(() => {
  //   if (isPrinting) {
  //     window.focus()
  //     window.print()
  //   }
  // }, [isPrinting])

  const handleStartPrinting = () => {
    setIsPrinting(true)
  }

  const handleStopPrinting = () => {
    setIsPrinting(false)
  }

  const processing = isLoading || true

  return (
    <React.Fragment>
      <Box
        sx={{
          bgcolor: 'white',
          // maxWidth: '2480px', // A4 size
          // width: isPrinting ? '2480px' : '100%',
        }}
      >
        <Box displayPrint="none">
          {isPrinting ? (
            <Box sx={{ float: 'right', margin: '16px' }}>
              {/* <Fab
                aria-label="delete-institutionalization-forms"
                disabled={false}
                onClick={handleStopPrinting}
                size="small"
                sx={{ float: 'right', marginTop: '16px' }}
              >
                <CloseIcon />
              </Fab> */}
              <Fab
                aria-label="delete-institutionalization-forms"
                color="default"
                onClick={() => {
                  navigate(
                    `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATION_ASSESSMENT_MANAGEMENT_ROUTE}/${organizationAssessment?.id}`
                  )
                }}
                size="small"
                sx={{ marginRight: '10px' }}
              >
                <ArrowBackIcon />
              </Fab>
              <Fab
                aria-label="print-institutionalization-form"
                color="primary"
                onClick={() => {
                  window.focus()
                  window.print()
                }}
                size="small"
              >
                <PrintIcon />
              </Fab>
            </Box>
          ) : (
            <BaseAppBar>
              <BaseToolbar
                title={t('institutionalization:formManagement.toolbar.title')}
              >
                <Fab
                  aria-label="delete-institutionalization-forms"
                  color="primary"
                  onClick={handleStartPrinting}
                  size="small"
                >
                  <PrintIcon />
                </Fab>
              </BaseToolbar>
            </BaseAppBar>
          )}
        </Box>

        <Box
          sx={{
            bgcolor: 'white',
            padding: isPrinting ? '0px' : '80px',
            maxWidth: '2480px', // A4 size
            paddingBottom: '40px',
            // '@media print': {
            //   padding: '0px', // Adjust padding for printing
            // },
          }}
        >
          {itemType?.toLowerCase() ===
          INSTITUTIONALIZATION_PRINT_ROUTE_POSTFIX_REPORT ? (
            <PrintAssessment
              processing={processing}
              organizationAssessment={organizationAssessment}
              onClose={handleStopPrinting}
              organizations={organizations}
              countryReviews={dataCountryReviews}
            />
          ) : itemType?.toLowerCase() ===
            INSTITUTIONALIZATION_PRINT_ROUTE_POSTFIX_GRAPH ? (
            <PrintGraph
              processing={processing}
              organizationAssessment={organizationAssessment}
            />
          ) : (
            <NotFound />
          )}
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default InstitutionalizationAssessmentPrint

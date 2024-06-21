import ViewModuleIcon from '@mui/icons-material/ViewModule'
import {
  Avatar,
  Box,
  FormControlLabel,
  MenuItem,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import lodash from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '../../../../core/components/Empty'
import { useSettings } from '../../../../core/contexts/SettingsProvider'
import {
  IInstitutionalizationCountryReview,
  IInstitutionalizationOrganization,
} from '../../../../shared/interfaces/institutionalization'
import { dateToString } from '../../../../utils/helper'
import { IOrganization } from '../../../organizations/interfacesAndTypes/organization'
import {
  assessmentLeftStyles,
  assessmentRightStyles,
} from '../constants/styles'

type PrintReportProps = {
  processing: boolean
  organizationAssessment?: IInstitutionalizationOrganization
  organizations?: IOrganization[]
  countryReviews?: IInstitutionalizationCountryReview[]
  onClose: () => void
}

const PrintAssessment = ({
  processing,
  organizationAssessment,
  organizations = [],
  countryReviews = [],
  onClose,
}: PrintReportProps): JSX.Element => {
  const { direction } = useSettings()
  const { t } = useTranslation()
  // const { data: organizations } = useOrganizations()
  const styleSxProps: any =
    direction === 'ltr'
      ? assessmentLeftStyles.report
      : assessmentRightStyles.report

  const answerOptions = [
    t('Achievements are negligible or minor'),
    t('Achievements are incomplete'),
    t('Achievements are moderate'),
    t('Substantial achievement'),
    t('Comprehensive achievement'),
  ]

  if (
    !processing &&
    (!organizationAssessment || !organizationAssessment.institutionalization)
  ) {
    return (
      <Empty
        title={t('institutionalization:assessmentManagement.nodata.assessment')}
      />
    )
  }

  return (
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            borderCollapse: 'separate',
            borderSpacing: '0rem',
          }}
        >
          <TableBody>
            <TableRow
              key={`BaseInformation`}
              sx={{
                '& td': {
                  border: 0,
                },
              }}
            >
              <TableCell
                key={`BaseInformationCell`}
                padding="checkbox"
                colSpan={4}
                sx={styleSxProps?.base?.textAlign}
              >
                <Typography color="textPrimary" variant="body1" mb={2}>
                  {dateToString(organizationAssessment?.complete)}
                </Typography>

                <Typography component="div" variant="h5" color="textPrimary">
                  {organizationAssessment?.organizationId && organizations
                    ? organizations.find(
                        (org) =>
                          org.id === organizationAssessment.organizationId
                      )?.name
                    : 'No Organization'}
                </Typography>

                <Typography component="div" variant="h5" color="textPrimary">
                  {organizationAssessment?.countryReviewId && countryReviews
                    ? countryReviews.find(
                        (country) =>
                          country.id === organizationAssessment.countryReviewId
                      )?.title
                    : 'No Country Reviews'}
                </Typography>
                <Typography component="div" variant="h6" mb={2}>
                  {organizationAssessment?.trainingComponent}
                </Typography>

                <Typography component="div" variant="h5" color="primary">
                  {`Course Specific instituionalization Score: ${organizationAssessment?.institutionalization.score}`}
                </Typography>
              </TableCell>
            </TableRow>
            {organizationAssessment?.institutionalization?.modules.map(
              (module, moduleIndex) => {
                return (
                  <>
                    {/* Show modules */}
                    <TableRow
                      key={`${moduleIndex}Module`}
                      sx={{
                        '& td': {
                          border: 0,
                          paddingTop: '80px',
                        },
                        display: 'flex',
                      }}
                    >
                      <TableCell
                        key={`No${moduleIndex}Module`}
                        colSpan={1}
                        sx={
                          {
                            // ...styleSxProps.module.textAlign, // Apply textAlign style
                          }
                        }
                      >
                        <Typography
                          component="div"
                          variant="h5"
                          color="primary"
                          // sx={styleSxProps.module.textSpace} // Apply textSpace style
                        >
                          {module.moduleNo}
                        </Typography>
                      </TableCell>
                      <TableCell
                        key={`Condition${moduleIndex}Module`}
                        colSpan={2}
                        sx={
                          {
                            // ...styleSxProps.module.textAlign,
                          }
                        }
                      >
                        <Typography
                          component="div"
                          variant="h5"
                          color="primary"
                          sx={{
                            // ...styleSxProps.module.textSpace,
                            whiteSpace: 'nowrap', // Prevent wrapping
                          }}
                        >
                          {module.condition}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="primary"
                          // sx={styleSxProps?.module?.textSpace}
                        >
                          {`Module Score : ${module.moduleScore}`}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {module.indicators.map((indicator, indicatorIndex) => {
                      return (
                        <>
                          {/* Show indicators */}
                          <TableRow
                            key={`${moduleIndex}Module${indicatorIndex}Indicator`}
                            sx={{
                              '& td': {
                                border: 0,
                              },
                              display: 'flex',
                            }}
                          >
                            <TableCell
                              sx={{
                                width: '0px',
                              }}
                            />

                            <TableCell
                              // colSpan={1}
                              sx={{
                                // flex: 1, // Make the first column flexible
                                ...styleSxProps.module.textAlign, // Apply textAlign style
                              }}
                            >
                              <Typography
                                component="div"
                                variant="h6"
                                color="primary"
                                sx={
                                  {
                                    // marginBottom: 1,
                                  }
                                }
                              >
                                {indicator.indicatorNo}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                component="div"
                                variant="h6"
                                color="primary"
                                sx={{
                                  // ...styleSxProps.module.textSpace,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {indicator.question}
                              </Typography>
                              <Typography
                                variant="body1"
                                color="primary"
                                // sx={styleSxProps?.module?.textSpace}
                              >
                                {`Answer : ${
                                  answerOptions[indicator.scale - 1]
                                }`}
                              </Typography>

                              <Typography
                                variant="body1"
                                color="primary"
                                // sx={styleSxProps?.module?.textSpace}
                              >
                                {`Comment : ${
                                  indicator?.comments &&
                                  indicator?.comments[0] &&
                                  indicator?.comments[0]?.comment
                                    ? indicator?.comments[0]?.comment
                                    : ''
                                }`}
                              </Typography>
                            </TableCell>
                          </TableRow>

                          {indicator.subQuestions.map(
                            (subQuestion, subQuestionIndex) => (
                              // Show sub questions

                              <TableRow
                                key={`${moduleIndex}Module${indicatorIndex}Indicator${subQuestionIndex}SubQuestionIndex`}
                                sx={{
                                  '& td': {
                                    border: 0,
                                    paddingTop: '0px',
                                  },
                                  display: 'flex',
                                }}
                              >
                                <TableCell
                                  style={{
                                    width: '0px',
                                  }}
                                />
                                <TableCell
                                  style={{
                                    width: '0px',
                                  }}
                                />
                                <TableCell
                                  style={{
                                    width: '0px',
                                  }}
                                />

                                <TableCell
                                  sx={{
                                    flex: 1, // Make the first column flexible
                                    ...styleSxProps.module.textAlign,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Box>
                                      <Typography component="div" variant="h6">
                                        {subQuestion.subQuestion}
                                      </Typography>
                                      <Typography
                                        color="textPrimary"
                                        variant="body1"
                                      >
                                        {`Answer : ${subQuestion.subAnswer}`}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </>
                      )
                    })}
                  </>
                )
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  )
}

export default PrintAssessment

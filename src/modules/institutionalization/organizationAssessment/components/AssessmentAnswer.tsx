import { Scale } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Box,
  Chip,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Form, Formik } from 'formik'
import { isEqual } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import Empty from '../../../../core/components/Empty'
import { useSettings } from '../../../../core/contexts/SettingsProvider'
import { useAuth } from '../../../auth/contexts/AuthProvider'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import { ROOT_ROUTE } from '../../../baseUser/constants/routes'
import {
  INSTITUTIONALIZATION_ORGANIZATIONS_COURSES_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE,
} from '../constants/routes'
import {
  assessmentLeftStyles,
  assessmentRightStyles,
} from '../constants/styles'
import {
  AssessmentStatusEnum,
  IInstitutionalizationForm,
  IInstitutionalizationIndicator,
  IInstitutionalizationIndicatorSubQuestion,
  IInstitutionalizationModule,
  IInstitutionalizationOrganization,
} from '../interfacesAndTypes/organization'

function EnhancedTableHead(): JSX.Element {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow key={-1} sx={{ '& th': { border: 0 } }}>
        <TableCell key="headerCell" align="left" sx={{ py: 0 }} colSpan={3}>
          {t(
            'institutionalization:organizationAssessmentManagement.assessmentTable.headers.description'
          )}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

//#region Form Module row

type FormModuleRowProps = {
  moduleIndex: number
  formId?: string
  module: IInstitutionalizationModule
  processing: boolean
  direction: string
  t: any
}

const FormModuleRow = ({
  moduleIndex,
  formId,
  module,
  processing,
  direction,
  t,
}: FormModuleRowProps) => {
  const styleSxProps: any =
    direction === 'ltr'
      ? assessmentLeftStyles.assessmentTable
      : assessmentRightStyles.assessmentTable

  return (
    <TableRow
      tabIndex={-1}
      key={`${moduleIndex}Module`}
      sx={{
        '& td': {
          bgcolor: 'background.paper',
          border: 0,
        },
      }}
      style={{
        borderLeft: 10,
        marginLeft: 20,
        paddingLeft: 10,
      }}
    >
      <TableCell
        key={`Id${moduleIndex}Module`}
        padding="checkbox"
        sx={styleSxProps.rowStart}
        colSpan={3}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <ViewModuleIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {/* {moduleIndex + page * rowsPerPage} */}
              {t(
                `institutionalizationform:${formId}.modules.${moduleIndex}.moduleNo`
              )}
            </Typography>
            <Typography color="textSecondary" variant="h6">
              {/* {module.condition} */}
              {t(
                `institutionalizationform:${formId}.modules.${moduleIndex}.condition`
              )}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell
        key={`Action${module._id}Module`}
        align="right"
        sx={styleSxProps.rowEnd}
      ></TableCell>
    </TableRow>
  )
}

// #endregion

//#region Form Module Indicator row

type FormModuleIndicatorRowProps = {
  indicatorIndex: number
  formId?: string
  moduleIndex: number
  indicator: IInstitutionalizationIndicator
  processing: boolean
  readOnly: boolean
  direction: string
  showContent: boolean
  onClickRow: (moduleIndex: number, indicatorIndex: number) => void
  onUpdateIndicator: (
    moduleIndex: number,
    indicatorIndex: number,
    content: any
  ) => void
  t: any
}

const FormModuleIndicatorRow = ({
  indicatorIndex,
  formId,
  moduleIndex,
  indicator,
  processing,
  readOnly,
  direction,
  showContent,
  onClickRow,
  onUpdateIndicator,
  t,
}: FormModuleIndicatorRowProps) => {
  const styleSxProps: any =
    direction === 'ltr'
      ? assessmentLeftStyles.assessmentTable
      : assessmentRightStyles.assessmentTable

  const [showDescription, setShowDescription] = useState<boolean>(false)

  const handleShowDescription = () => {
    setShowDescription(!showDescription)
  }

  const handleOnClickRow = (_moduleIndex: number, _indicatorIndex: number) => {
    onClickRow(_moduleIndex, _indicatorIndex)
  }

  // Check whether formik has changed. If values have been changed, called for submit.
  const SubmitListener = (props: any) => {
    const [lastValues, updateState] = React.useState(props.formik.values)

    React.useEffect(() => {
      const valuesEqualLastValues = isEqual(lastValues, props.formik.values)
      const valuesEqualInitialValues =
        props.formik.values === props.formik.initialValues

      if (!valuesEqualLastValues) {
        updateState(props.formik.values)
      }

      if (!valuesEqualLastValues && !valuesEqualInitialValues) {
        props.formik.submitForm()
      }
    }, [
      lastValues,
      props.formik.values,
      props.formik.initialValues,
      props.onChange,
      props.formik,
    ])

    return null
  }

  return (
    <TableRow
      key={`${indicatorIndex}Indicator`}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        key={`start${indicatorIndex}Indicator`}
        style={{ backgroundColor: '#ECEFF1', width: '0px' }}
      />
      <TableCell
        key={`question${indicatorIndex}Indicator`}
        colSpan={2}
        sx={styleSxProps.rowStart}
      >
        <Formik
          initialValues={{
            scale: indicator?.scale ?? 0,
            comment: indicator?.comments[0]?.comment ?? '',
          }}
          validationSchema={Yup.object({})}
          onSubmit={(values: any) => {
            onUpdateIndicator(moduleIndex, indicatorIndex, {
              scale: values.scale,
              comment: values.comment,
            })
          }}
        >
          {(formikProps: any) => {
            return (
              <Form>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'start',
                  }}
                >
                  <Fab
                    color="primary"
                    size="small"
                    disabled={processing}
                    sx={{ mr: 3, minWidth: 40 }}
                    onClick={() => {
                      handleOnClickRow(moduleIndex, indicatorIndex)
                    }}
                  >
                    <ViewListIcon />
                  </Fab>

                  <Box sx={{ width: '100%' }}>
                    <div
                      onClick={() => {
                        handleOnClickRow(moduleIndex, indicatorIndex)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <Typography component="div" color="primary" variant="h6">
                        {/* {indicator.indicatorNo} */}
                        {t(
                          `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${indicatorIndex}.indicatorNo`
                        )}
                      </Typography>
                      <Typography
                        variant="body1"
                        // variant="h6"
                        color="primary"
                      >
                        {/* {indicator.question} */}
                        {t(
                          `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${indicatorIndex}.question`
                        )}
                      </Typography>
                    </div>

                    <Box
                      sx={{
                        display: showContent === true ? 'block' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Box mt={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            color={'default'}
                            label={t(
                              `institutionalizationform:assessmentAnswerForm.modules.indicators.description`
                            )}
                            disabled={processing}
                            size="small"
                            icon={
                              showDescription ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )
                            }
                            clickable={true}
                            onClick={handleShowDescription}
                          />
                        </Box>
                        {showDescription && (
                          <Typography
                            color="textSecondary"
                            variant="body2"
                            mt={2}
                          >
                            {/* {indicator.description} */}
                            {t(
                              `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${indicatorIndex}.description`
                            )}
                          </Typography>
                        )}
                      </Box>

                      <Box
                        mt={2}
                        sx={
                          readOnly
                            ? { pointerEvents: 'none', cursor: 'auto' }
                            : {}
                        }
                      >
                        <FormControl
                          key={`${indicatorIndex}radio${indicator?.scale}`}
                        >
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            id="scale"
                            name="scale"
                            value={formikProps.values.scale}
                            onChange={formikProps.handleChange}
                          >
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label={t(
                                `institutionalizationform:assessmentAnswerForm.radioButtons.title1.label`
                              )}
                              disabled={processing}
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio />}
                              label={t(
                                `institutionalizationform:assessmentAnswerForm.radioButtons.title2.label`
                              )}
                              disabled={processing}
                            />
                            <FormControlLabel
                              value="3"
                              control={<Radio />}
                              label={t(
                                `institutionalizationform:assessmentAnswerForm.radioButtons.title3.label`
                              )}
                              disabled={processing}
                            />
                            <FormControlLabel
                              value="4"
                              control={<Radio />}
                              label={t(
                                `institutionalizationform:assessmentAnswerForm.radioButtons.title4.label`
                              )}
                              disabled={processing}
                            />
                            <FormControlLabel
                              value="5"
                              control={<Radio />}
                              label={t(
                                `institutionalizationform:assessmentAnswerForm.radioButtons.title5.label`
                              )}
                              disabled={processing}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box
                        mt={2}
                        sx={
                          readOnly
                            ? { pointerEvents: 'none', cursor: 'auto' }
                            : {}
                        }
                      >
                        <TextField
                          margin="normal"
                          fullWidth
                          id="comment"
                          name="comment"
                          label={t(
                            `institutionalizationform:assessmentAnswerForm.modules.indicators.comment`
                          )}
                          multiline
                          minRows={2}
                          disabled={processing}
                          value={formikProps.values.comment}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.comment &&
                            Boolean(formikProps.errors.comment)
                          }
                          helperText={
                            formikProps.touched.comment &&
                            formikProps.errors.comment
                          }
                        />
                      </Box>

                      <Box sx={{ flex: 1, float: 'right' }}>
                        <Fab
                          aria-label="delete-institutionalization-forms"
                          color="default"
                          disabled={processing}
                          size="small"
                          style={{ marginRight: 10 }}
                          onClick={() =>
                            handleOnClickRow(moduleIndex, indicatorIndex - 1)
                          }
                        >
                          <ExpandLessIcon />
                        </Fab>
                        <Fab
                          aria-label="delete-institutionalization-forms"
                          color="primary"
                          disabled={processing}
                          size="small"
                          onClick={() =>
                            handleOnClickRow(moduleIndex, indicatorIndex + 1)
                          }
                        >
                          <ExpandMoreIcon />
                        </Fab>
                      </Box>
                      <SubmitListener formik={formikProps} />
                    </Box>
                  </Box>
                </Box>
              </Form>
            )
          }}
        </Formik>
      </TableCell>
      <TableCell
        key={`end${indicator._id}Indicator`}
        align="right"
        sx={styleSxProps.rowEnd}
      />
    </TableRow>
  )
}

// #endregion

//#region Form Module Indicator Sub-Question row

type FormModuleIndicatorSubQuestionRowProps = {
  moduleIndex: number
  formId?: string
  subQuestionIndex: number
  indicatorIndex: number
  subQuestion: IInstitutionalizationIndicatorSubQuestion
  processing: boolean
  readOnly: boolean
  direction: string
  onUpdateSubQuestion: (
    moduleIndex: number,
    subQuestionIndex: number,
    indicatorIndex: number,
    content: {
      subAnswer: string
    }
  ) => void
  t: any
}

const FormModuleIndicatorSubQuestionRow = ({
  moduleIndex,
  formId,
  subQuestionIndex,
  indicatorIndex,
  subQuestion,
  onUpdateSubQuestion,
  processing,
  readOnly,
  direction,
  t,
}: FormModuleIndicatorSubQuestionRowProps) => {
  const styleSxProps: any =
    direction === 'ltr'
      ? assessmentLeftStyles.assessmentTable
      : assessmentRightStyles.assessmentTable

  // Check whether formik has changed. If values have been changed, called for submit.
  const SubmitListener = (props: any) => {
    const [lastValues, updateState] = React.useState(props.formik.values)

    React.useEffect(() => {
      const valuesEqualLastValues = isEqual(lastValues, props.formik.values)
      const valuesEqualInitialValues =
        props.formik.values === props.formik.initialValues

      if (!valuesEqualLastValues) {
        updateState(props.formik.values)
      }

      if (!valuesEqualLastValues && !valuesEqualInitialValues) {
        props.formik.submitForm()
      }
    }, [
      lastValues,
      props.formik.values,
      props.formik.initialValues,
      props.onChange,
      props.formik,
    ])

    return null
  }

  return (
    <TableRow
      key={`${moduleIndex}${indicatorIndex}-${subQuestionIndex}SubQuestion`}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        key={`${moduleIndex}${indicatorIndex}-start${subQuestionIndex}SubQuestion`}
        style={{ backgroundColor: '#ECEFF1', width: '0px' }}
      ></TableCell>
      <TableCell
        key={`${moduleIndex}${indicatorIndex}-startSpace${subQuestionIndex}SubQuestion`}
        style={{ backgroundColor: '#ECEFF1', width: '0px' }}
      ></TableCell>
      <TableCell
        key={`${moduleIndex}${indicatorIndex}-questions${subQuestionIndex}SubQuestion`}
        sx={styleSxProps.rowStart}
      >
        <Formik
          initialValues={{
            subAnswer: subQuestion?.subAnswer ?? '',
          }}
          validationSchema={Yup.object({})}
          onSubmit={(values: any) => {
            onUpdateSubQuestion(moduleIndex, indicatorIndex, subQuestionIndex, {
              subAnswer: values.subAnswer,
            })
          }}
        >
          {(formikProps: any) => {
            return (
              <Form>
                <Box
                  sx={{
                    display: 'flex',
                    // alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ mr: 3 }}>
                    <ViewHeadlineIcon />
                  </Avatar>
                  <Box style={{ width: '100%' }}>
                    <Typography color="textPrimary" variant="body1">
                      {/* {subQuestion.subQuestion} */}
                      {t(
                        `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${indicatorIndex}.subQuestions.${subQuestionIndex}.subQuestion`
                      )}
                    </Typography>
                    <Box mt={1}>
                      <Box
                        mt={2}
                        sx={
                          readOnly
                            ? { pointerEvents: 'none', cursor: 'auto' }
                            : {}
                        }
                      >
                        <TextField
                          margin="normal"
                          fullWidth
                          id="subAnswer"
                          name="subAnswer"
                          label={t(
                            `institutionalizationform:assessmentAnswerForm.modules.subQuestion.answer`
                          )}
                          multiline
                          minRows={2}
                          disabled={processing}
                          value={formikProps.values.subAnswer}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.subAnswer &&
                            Boolean(formikProps.errors.subAnswer)
                          }
                          helperText={
                            formikProps.touched.subAnswer &&
                            formikProps.errors.subAnswer
                          }
                        />
                      </Box>
                      <SubmitListener formik={formikProps} />
                    </Box>
                  </Box>
                </Box>
              </Form>
            )
          }}
        </Formik>
      </TableCell>
      <TableCell
        key={`${moduleIndex}${indicatorIndex}-end${subQuestionIndex}SubQuestion`}
        align="right"
        sx={styleSxProps.rowEnd}
      ></TableCell>
    </TableRow>
  )
}

// #endregion

//#region Form Modules Table

type AssessmentTableProps = {
  processing: boolean
  readOnly: boolean
  assessmentAnswer: IInstitutionalizationOrganization
  onSaveAnswer: any
}

const AssessmentTable = ({
  processing,
  readOnly,
  assessmentAnswer,
  onSaveAnswer,
}: AssessmentTableProps): JSX.Element => {
  const { userInfo } = useAuth()
  const { t } = useTranslation()
  const { direction } = useSettings()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(1)
  const [showRow, setShowRow] = useState('00')
  const [assessmentAnswerUpdated, setAssessmentAnswerUpdated] =
    useState<IInstitutionalizationOrganization>(assessmentAnswer)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage)
    setShowRow(`${newPage * rowsPerPage}${0}`)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  //#region

  const handleUpdateIndicator = (
    moduleIndex: number,
    indicatorIndex: number,
    content: any
  ) => {
    if (
      !assessmentAnswerUpdated ||
      !assessmentAnswerUpdated.institutionalization
    ) {
      console.error('assessmentAnswerUpdated is not properly initialized.')
      return
    }

    const updatedContent = assessmentAnswerUpdated

    // Update the comment
    if (content?.comment && content.comment.length > 0) {
      const updateComment = {
        userId: userInfo.id,
        userFullName: `${userInfo.firstName} ${userInfo.lastName}`,
        date: new Date(),
        comment: content.comment,
      }
      updatedContent.institutionalization.modules[moduleIndex].indicators[
        indicatorIndex
      ]['comments'] = [updateComment]
    }

    // Update the scale
    if (content?.scale && content?.scale > 0) {
      updatedContent.institutionalization.modules[moduleIndex].indicators[
        indicatorIndex
      ]['scale'] = content?.scale
    }

    setAssessmentAnswerUpdated(updatedContent)
    console.log('~!@# updatedContent: ', updatedContent)
  }

  const handleUpdateSubQuestion = (
    moduleIndex: number,
    indicatorIndex: number,
    subQuestionIndex: number,
    content: {
      subAnswer: string
    }
  ) => {
    // Update the sub question's answer
    if (content?.subAnswer && content.subAnswer.length > 0) {
      const updatedContent = assessmentAnswerUpdated

      updatedContent.institutionalization.modules[moduleIndex].indicators[
        indicatorIndex
      ].subQuestions[subQuestionIndex]['subAnswer'] = content.subAnswer

      setAssessmentAnswerUpdated(updatedContent)
      console.log('~!@# updatedContent: ', updatedContent)
    }
  }

  const handleOnClickRow = (moduleIndex: number, indicatorIndex: number) => {
    const rowIdentifier = `${moduleIndex}${indicatorIndex}`

    setShowRow((prevRow) => (prevRow === rowIdentifier ? '' : rowIdentifier))
  }

  //#endregion

  if (
    !assessmentAnswerUpdated ||
    !assessmentAnswerUpdated?.institutionalization
  ) {
    return <Empty title={t('institutionalization.nodata.modules')} />
  }

  return (
    <React.Fragment>
      {assessmentAnswer &&
        assessmentAnswer.status !== AssessmentStatusEnum.Complete && (
          <BaseAppBar>
            <BaseToolbar
              title={t(
                'institutionalization:organizationAssessmentManagement.toolbar.title'
              )}
            >
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
              {!readOnly && (
                <Fab
                  color="primary"
                  disabled={processing}
                  onClick={() => {
                    onSaveAnswer(assessmentAnswerUpdated)
                  }}
                  size="small"
                >
                  <CheckIcon />
                </Fab>
              )}
            </BaseToolbar>
          </BaseAppBar>
        )}

      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: 'separate',
            borderSpacing: '0 1rem',
          }}
        >
          <EnhancedTableHead />
          <TableBody>
            {assessmentAnswerUpdated?.institutionalization?.modules
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((module, moduleIndex) => {
                return (
                  <React.Fragment key={`fragment${moduleIndex}Module`}>
                    {/* Show modules */}
                    <FormModuleRow
                      key={`${moduleIndex + page * rowsPerPage}`}
                      moduleIndex={moduleIndex + page * rowsPerPage}
                      formId={
                        assessmentAnswerUpdated?.institutionalization?.formId
                      }
                      module={module}
                      processing={processing}
                      direction={direction}
                      t={t}
                    />

                    {module.indicators.map((indicator, indicatorIndex) => {
                      return (
                        <React.Fragment
                          key={`fragment${indicatorIndex}Indicator`}
                        >
                          {/* Show indicators */}
                          <FormModuleIndicatorRow
                            key={`${
                              moduleIndex + page * rowsPerPage
                            }${indicatorIndex}`}
                            indicatorIndex={indicatorIndex}
                            formId={
                              assessmentAnswerUpdated?.institutionalization
                                ?.formId
                            }
                            moduleIndex={moduleIndex + page * rowsPerPage}
                            indicator={indicator}
                            processing={processing}
                            readOnly={readOnly}
                            direction={direction}
                            showContent={
                              showRow ===
                              `${
                                moduleIndex + page * rowsPerPage
                              }${indicatorIndex}`
                            }
                            onClickRow={handleOnClickRow}
                            onUpdateIndicator={handleUpdateIndicator}
                            t={t}
                          />

                          {/* Show sub question if only indicator is showing */}
                          {showRow ===
                            `${
                              moduleIndex + page * rowsPerPage
                            }${indicatorIndex}` &&
                            indicator.subQuestions.map(
                              (subQuestion, subQuestionIndex) => {
                                return (
                                  <React.Fragment
                                    key={`fragment${subQuestionIndex}subQuestion`}
                                  >
                                    <FormModuleIndicatorSubQuestionRow
                                      key={`${moduleIndex}${indicatorIndex}-${subQuestionIndex}`}
                                      moduleIndex={
                                        moduleIndex + page * rowsPerPage
                                      }
                                      formId={
                                        assessmentAnswerUpdated
                                          ?.institutionalization?.formId
                                      }
                                      subQuestionIndex={subQuestionIndex}
                                      indicatorIndex={indicatorIndex}
                                      subQuestion={subQuestion}
                                      processing={processing}
                                      t={t}
                                      onUpdateSubQuestion={
                                        handleUpdateSubQuestion
                                      }
                                      readOnly={readOnly}
                                      direction={direction}
                                    />
                                  </React.Fragment>
                                )
                              }
                            )}
                        </React.Fragment>
                      )
                    })}
                  </React.Fragment>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage={t(
          'institutionalization:organizationAssessmentManagement.assessmentTable.pagination.labelRowsPerPage'
        )}
        rowsPerPageOptions={[1, 5, 10]}
        component="div"
        count={assessmentAnswer?.institutionalization?.modules.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

export default AssessmentTable

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  MenuItem,
  Tab,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { FieldArray, Form, Formik, useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import { useAuth } from '../../../auth/contexts/AuthProvider'
import { ILocalUserInfo } from '../../../auth/interfacesAndTypes/userInfo'
import { DefaultUsers } from '../../../baseUser/constants/helper'
import { useCountries } from '../../../countries/hooks/useCountries'
import { CountryStatusEnum } from '../../../countries/interfacesAndTypes/country'
import timeZones from '../components/timeZones.json'
import {
  AssessmentStatusEnum,
  IInstitutionalizationCountryReview,
  TimeZoneEnum,
  TrainingComponentEnum,
} from '../interfacesAndTypes/countryReview'

const countryReviewStatus = [
  AssessmentStatusEnum.Pending,
  AssessmentStatusEnum.Progress,
  AssessmentStatusEnum.Complete,
  AssessmentStatusEnum.Deleted,
  AssessmentStatusEnum.Disabled,
]
type CountryReviewDialogProps = {
  onAdd: (countryReviews: Partial<IInstitutionalizationCountryReview>) => void
  onClose: () => void
  onUpdate: (
    countryReviews: Partial<IInstitutionalizationCountryReview>
  ) => void
  open: boolean
  processing: boolean
  countryReviews?: IInstitutionalizationCountryReview
}

const CountryReviewDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  countryReviews,
}: CountryReviewDialogProps): JSX.Element => {
  const { t } = useTranslation()
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()

  const editMode = Boolean(countryReviews && countryReviews.id)

  const { data: countriesData } = useCountries()

  const filteredCountriesData = countriesData?.filter(
    (country) => country.status === CountryStatusEnum.Active
  )

  const handleSubmit = (values: any) => {
    console.log('values:', values)

    const addCountryReviewParams = {
      id: values.id,
      title: values.title,
      year: values.year,
      start: values.start,
      end: values.end,
      timeZone: values.timeZone,
      status: values.status,
      countryId: values.countryId,
      trainingComponents: values.trainingComponents,
      score: values.score,
      classification: values.classification,
    }
    if (countryReviews && countryReviews.id) {
      const { title, countryId, ...paramsWithoutTitleAndCountryId } =
        addCountryReviewParams
      onUpdate({ ...paramsWithoutTitleAndCountryId, id: countryReviews.id })
    } else {
      onAdd({ ...addCountryReviewParams, year: values.year })
    }
  }
  const [tabValue, setTabValue] = useState('1')
  // const [activeTab, setActiveTab] = useState('1')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="country-assessment-dialog-title"
    >
      <DialogTitle id="country-assessment-dialog-title">
        {editMode
          ? t(
              'institutionalization:countryReviewManagement.countryReviewDialog.modal.edit.title'
            )
          : t(
              'institutionalization:countryReviewManagement.countryReviewDialog.modal.add.title'
            )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', typography: 'body1', mb: 1, mt: 1 }}>
          <Formik
            initialValues={{
              title: countryReviews ? countryReviews.title : '',
              year: countryReviews ? countryReviews.year : 2023,
              start: countryReviews
                ? new Date(countryReviews.start)
                : new Date(),
              end: countryReviews ? new Date(countryReviews.end) : new Date(),
              timeZone: countryReviews ? countryReviews.timeZone : '',
              status: countryReviews?.status ?? AssessmentStatusEnum.Progress,
              countryId:
                countryReviews?.countryId ??
                userInfo?.employment?.organization?.organizationId?.countryId ??
                '',
              // score: countryReviews ? countryReviews.score : 0,
              trainingComponents: countryReviews?.trainingComponents ?? [
                {
                  code: TrainingComponentEnum.CADRE,
                  name: TrainingComponentEnum.CADRE,
                },
                {
                  code: TrainingComponentEnum.CSSR,
                  name: TrainingComponentEnum.CSSR,
                },
                {
                  code: TrainingComponentEnum.HOPE,
                  name: TrainingComponentEnum.HOPE,
                },
                {
                  code: TrainingComponentEnum.MFR,
                  name: TrainingComponentEnum.MFR,
                },
              ],
              // classification: countryReviews
              //   ? countryReviews.classification
              //   : '',

              createdBy: countryReviews ? countryReviews.createdBy : null,
              lastModifiedBy: countryReviews
                ? countryReviews.lastModifiedBy
                : null,
            }}
            validationSchema={Yup.object({
              title: Yup.string()
                .max(20, t('common.validations.max', { size: 20 }))
                .required(
                  t(
                    'institutionalization:countryReviewManagement.countryReviewDialog.form.title.required'
                  )
                ),
              year: Yup.number()
                .max(9999, t('common.validations.max', { size: 9999 }))
                .required(
                  t(
                    'institutionalization:countryReviewManagement.countryReviewDialog.form.year.required'
                  )
                ),
              timeZone: Yup.string().required(
                t(
                  'institutionalization:countryReviewManagement.countryReviewDialog.form.timeZone.required'
                )
              ),
              status: Yup.string().required(
                t(
                  'institutionalization:countryReviewManagement.countryReviewDialog.form.status.required'
                )
              ),
              countryId: Yup.string().required(
                t(
                  'institutionalization:countryReviewManagement.countryReviewDialog.form.countryId.required'
                )
              ),
            })}
            onSubmit={handleSubmit}
          >
            {(formikProps: any) => {
              useEffect(() => {
                if (
                  formikProps.submitCount > 0 &&
                  Object.keys(formikProps.errors).length > 0
                ) {
                  // Show the error message as a pop-up
                  snackbar.error(t('common:formik.validation.failed'))
                }
              }, [formikProps.submitCount, formikProps.errors])

              // const isProgressStatus =
              //   formikProps.values.status === AssessmentStatusEnum.Progress

              return (
                <Form>
                  <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList
                        onChange={handleTabChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.tab.basic'
                          )}
                          value="1"
                        />
                        <Tab
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.tab.trainingComponents'
                          )}
                          value="2"
                        />
                      </TabList>
                    </Box>
                    {/* Tabs start */}
                    {/* Tab 1 */}
                    <TabPanel value="1">
                      {/* <form onSubmit={formikProps.handleSubmit} noValidate> */}
                      <DialogContent>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          select
                          id="countryId"
                          name="countryId"
                          autoComplete="countryId"
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.countryId.label'
                          )}
                          disabled={
                            processing ||
                            editMode ||
                            userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR
                          }
                          value={formikProps.values.countryId}
                          onChange={formikProps.handleChange}
                        >
                          {filteredCountriesData &&
                            filteredCountriesData.map((countries) => (
                              <MenuItem key={countries.id} value={countries.id}>
                                {countries.name}
                              </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="title"
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.title.label'
                          )}
                          name="title"
                          autoComplete="family-name"
                          disabled={
                            processing ||
                            (editMode &&
                              formikProps.values.status !==
                                AssessmentStatusEnum.Pending)
                          }
                          value={formikProps.values.title}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.title &&
                            Boolean(formikProps.errors.title)
                          }
                          helperText={
                            formikProps.touched.title &&
                            formikProps.errors.title
                          }
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="year"
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.year.label'
                          )}
                          name="year"
                          autoComplete="family-name"
                          disabled={
                            processing ||
                            (editMode &&
                              formikProps.values.status !==
                                AssessmentStatusEnum.Pending)
                          }
                          value={formikProps.values.year}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.year &&
                            Boolean(formikProps.errors.year)
                          }
                          helperText={
                            formikProps.touched.year && formikProps.errors.year
                          }
                        />

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker
                              label={t(
                                'institutionalization:countryReviewManagement.countryReviewDialog.form.start.label'
                              )}
                              disabled={
                                processing ||
                                (editMode &&
                                  formikProps.values.status !==
                                    AssessmentStatusEnum.Pending)
                              }
                              value={formikProps.values.start}
                              onChange={(date) =>
                                formikProps.setFieldValue('start', date)
                              }
                              sx={{ mt: 1, mb: 1 }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker
                              label={t(
                                'institutionalization:countryReviewManagement.countryReviewDialog.form.end.label'
                              )}
                              disabled={
                                processing ||
                                (editMode &&
                                  formikProps.values.status !==
                                    AssessmentStatusEnum.Pending)
                              }
                              value={formikProps.values.end}
                              onChange={(date) =>
                                formikProps.setFieldValue('end', date)
                              }
                              sx={{ mt: 1, mb: 1 }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          select
                          id="timeZone"
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.timeZone.label'
                          )}
                          name="timeZone"
                          autoComplete="family-name"
                          disabled={
                            processing ||
                            (editMode &&
                              formikProps.values.status !==
                                AssessmentStatusEnum.Pending)
                          }
                          value={formikProps.values.timeZone}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.timeZone &&
                            Boolean(formikProps.errors.timeZone)
                          }
                          helperText={
                            formikProps.touched.timeZone &&
                            formikProps.errors.timeZone
                          }
                        >
                          {timeZones &&
                            timeZones.map((countryTimeZone, index) => (
                              <MenuItem
                                key={index}
                                value={countryTimeZone.timeZone}
                              >
                                {t(countryTimeZone.timeZone)}
                              </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          select
                          id="status"
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.status.label'
                          )}
                          name="status"
                          autoComplete="family-name"
                          disabled={processing}
                          value={formikProps.values.status}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.status &&
                            Boolean(formikProps.errors.status)
                          }
                          helperText={
                            formikProps.touched.status &&
                            formikProps.errors.status
                          }
                        >
                          {countryReviewStatus.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </TextField>

                        {/* <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="score"
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.score.label'
                          )}
                          name="score"
                          autoComplete="family-name"
                          disabled={editMode}
                          value={formikProps.values.score}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.score &&
                            Boolean(formikProps.errors.score)
                          }
                          helperText={
                            formikProps.touched.score &&
                            formikProps.errors.score
                          }
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="classification"
                          label={t(
                            'institutionalization:countryReviewManagement.countryReviewDialog.form.classification.label'
                          )}
                          name="classification"
                          autoComplete="family-name"
                          disabled={editMode}
                          value={formikProps.values.classification}
                          onChange={formikProps.handleChange}
                          error={
                            formikProps.touched.classification &&
                            Boolean(formikProps.errors.classification)
                          }
                          helperText={
                            formikProps.touched.classification &&
                            formikProps.errors.classification
                          }
                        ></TextField> */}
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={onClose}>{t('common.cancel')}</Button>
                        <LoadingButton
                          loading={processing}
                          type="submit"
                          variant="contained"
                          onClick={() => setTabValue('2')}
                        >
                          {t('common.next')}
                        </LoadingButton>{' '}
                      </DialogActions>
                      {/* </form> */}
                    </TabPanel>
                    {/* Tab2 */}
                    <TabPanel value="2">
                      <DialogContent>
                        <Box sx={{ mb: 1 }}>
                          <Typography>
                            Standard training components codes should be:
                          </Typography>
                          <Typography color="textSecondary">
                            {`${TrainingComponentEnum.CADRE}, ${TrainingComponentEnum.CSSR}, ${TrainingComponentEnum.HOPE} and ${TrainingComponentEnum.MFR}`}
                          </Typography>
                        </Box>
                        <FieldArray
                          name="trainingComponents"
                          render={(arrayHelpers) => (
                            <div>
                              {formikProps.values.trainingComponents &&
                              formikProps.values.trainingComponents.length >
                                0 ? (
                                formikProps.values.trainingComponents.map(
                                  (course: any, index: number) => (
                                    <div
                                      key={index}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <TextField
                                        key={`trainingComponents${index}code`}
                                        margin="normal"
                                        required
                                        id={`trainingComponents.${index}.code`}
                                        name={`trainingComponents.${index}.code`}
                                        label={t(
                                          'institutionalization:countryReviewManagement.countryReviewDialog.form.code.label'
                                        )}
                                        autoComplete="family-name"
                                        disabled={
                                          processing ||
                                          (editMode &&
                                            formikProps.values.status !==
                                              AssessmentStatusEnum.Pending)
                                        }
                                        value={course?.code}
                                        onChange={formikProps.handleChange}
                                        style={{
                                          flex: 1,
                                          marginRight: '10px',
                                        }}
                                      />
                                      <TextField
                                        key={`trainingComponents${index}name`}
                                        margin="normal"
                                        required
                                        id={`trainingComponents.${index}.name`}
                                        name={`trainingComponents.${index}.name`}
                                        label={t(
                                          'institutionalization:countryReviewManagement.countryReviewDialog.form.name.label'
                                        )}
                                        autoComplete="family-name"
                                        disabled={
                                          processing ||
                                          (editMode &&
                                            formikProps.values.status !==
                                              AssessmentStatusEnum.Pending)
                                        }
                                        value={course?.name}
                                        onChange={formikProps.handleChange}
                                        style={{ flex: 1 }}
                                      />
                                      <Grid>
                                        <Fab
                                          aria-label="logout"
                                          color="default"
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          disabled={
                                            processing ||
                                            (editMode &&
                                              formikProps.values.status !==
                                                AssessmentStatusEnum.Pending)
                                          }
                                          size="small"
                                          sx={{ ml: 1, mr: 1 }}
                                        >
                                          <RemoveIcon />
                                        </Fab>
                                      </Grid>
                                      <Grid>
                                        <Fab
                                          aria-label="logout"
                                          color="primary"
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.insert(index + 1, '')
                                          }
                                          disabled={
                                            processing ||
                                            (editMode &&
                                              formikProps.values.status !==
                                                AssessmentStatusEnum.Pending)
                                          }
                                          size="small"
                                        >
                                          <AddIcon />
                                        </Fab>
                                      </Grid>
                                    </div>
                                  )
                                )
                              ) : (
                                <Button
                                  type="button"
                                  onClick={() => {
                                    arrayHelpers.push({
                                      code: TrainingComponentEnum.CADRE,
                                      name: TrainingComponentEnum.CADRE,
                                    })
                                    arrayHelpers.push({
                                      code: TrainingComponentEnum.CSSR,
                                      name: TrainingComponentEnum.CSSR,
                                    })
                                    arrayHelpers.push({
                                      code: TrainingComponentEnum.HOPE,
                                      name: TrainingComponentEnum.HOPE,
                                    })
                                    arrayHelpers.push({
                                      code: TrainingComponentEnum.MFR,
                                      name: TrainingComponentEnum.MFR,
                                    })
                                  }}
                                  disabled={
                                    processing ||
                                    (editMode &&
                                      formikProps.values.status !==
                                        AssessmentStatusEnum.Pending)
                                  }
                                >
                                  <AddIcon />
                                  Add Standard Courses
                                </Button>
                              )}
                            </div>
                          )}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={onClose}>{t('common.cancel')}</Button>
                        <LoadingButton
                          loading={processing}
                          type="submit"
                          variant="contained"
                        >
                          {editMode
                            ? t(
                                'institutionalization:countryReviewManagement.countryReviewDialog.actions.edit'
                              )
                            : t(
                                'institutionalization:countryReviewManagement.countryReviewDialog.actions.add'
                              )}
                        </LoadingButton>
                      </DialogActions>
                    </TabPanel>
                  </TabContext>
                </Form>
              )
            }}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CountryReviewDialog

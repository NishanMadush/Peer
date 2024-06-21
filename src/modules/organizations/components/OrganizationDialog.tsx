/* eslint-disable prettier/prettier */
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { LoadingButton } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Snackbar,
  Tab,
  TextField,
} from '@mui/material';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useSnackbar } from '../../../core/contexts/SnackbarProvider';
import { useAuth } from '../../auth/contexts/AuthProvider';
import { DefaultUsers } from '../../baseUser/constants/helper';
import { useCountries } from '../../countries/hooks/useCountries';
import { CountryStatusEnum } from '../../countries/interfacesAndTypes/country';
import { categories } from '../constants/CountryUtil';
import { useOrganizations } from '../hooks/useOrganizations';
import {
  GeographicAreaEnum,
  IOrganization,
  OrganizationStatusEnum,
  OrganizationTypeEnum,
} from '../interfacesAndTypes/organization';

const organizationTypes = [
  'Government',
  'Semi Government',
  'Non Government',
  'Private',
  'Other',
];

const geographicAreas = [
  'National',
  'Provincial',
  'District',
  'City Municipality',
  'Village',
];

type OrganizationDialogProps = {
  onAdd: (organization: Partial<IOrganization>) => void;
  onClose: () => void;
  onUpdate: (organization: Partial<IOrganization>) => void;
  open: boolean;
  processing: boolean;
  organization?: IOrganization;
};

const OrganizationDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  organization,
}: OrganizationDialogProps): JSX.Element => {
  const { t } = useTranslation();
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()

  const editMode = Boolean(organization && organization.id);

  const { data: countriesData } = useCountries();

  const filteredCountriesData = countriesData?.filter(country => country.status === CountryStatusEnum.Active);
  // const {data: oraganizationData} = useOrganizations();

  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values);

    const addOrganizationParams = {
      name: values.name,
      isLegalEntity: values.isLegalEntity,
      description: values.description,
      category: values.category,
      countryId: values.countryId,
      registeredNo: values.registeredNo,
      vision: values.vision,
      mission: values.mission,
      organizationType: values.organizationType ?? OrganizationTypeEnum.Other,
      geographicArea: values.geographicArea ?? GeographicAreaEnum.National,
      status: values.status ?? OrganizationStatusEnum.Active,
      departments: values.departments,
      designations: values.designations,
      branches: values.branches,
    };
    if (organization && organization.id) {
      onUpdate({ ...addOrganizationParams, id: organization.id });
    } else {
      onAdd({ ...addOrganizationParams, name: values.name });
    }
  };

  const [tabValue, setTabValue] = useState('1');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="organization-dialog-title"
    >
      {/* <form onSubmit={formikProps.handleSubmit} noValidate> */}
        <DialogTitle id="organization-dialog-title">
          {editMode
            ? t('organizations:organizationManagement.modal.edit.title')
            : t('organizations:organizationManagement.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', typography: 'body1', mb: 1, mt: 1 }}>
            <Formik
              initialValues={{
                isLegalEntity: organization?.isLegalEntity ?? false,
                name: organization?.name ?? '',
                description: organization?.description ?? '',
                category: organization?.category ?? '',
                countryId: organization?.countryId ?? userInfo?.employment?.organization?.organizationId?.countryId ?? '',
                registeredNo: organization?.registeredNo ?? '',
                vision: organization?.vision ?? '',
                mission: organization?.mission ?? '',
                organizationType:
                  organization?.organizationType ?? OrganizationTypeEnum.Other,
                geographicArea:
                  organization?.geographicArea ?? GeographicAreaEnum.National,
                status: organization?.status ?? OrganizationStatusEnum.Active,
                departments: organization?.departments ?? [],
                designations: organization?.designations ?? [],
                branches: organization?.branches ?? [],
              }}
              validationSchema={Yup.object({
                name: Yup.string()
                .max(20, t('common.validations.max', { size: 20 }))
                .required(
                  t(
                    'organizations:organizationManagement.form.name.required'
                  )
                ),
                description: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.description.required'
                  )
                ),
                category: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.category.required'
                  )
                ),
                countryId: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.countryId.required'
                  )
                ),
                registeredNo: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.registeredNo.required'
                  )
                ),
                vision: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.vision.required'
                  )
                ),
                mission: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.mission.required'
                  )
                ),
                organizationType: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.organizationType.required'
                  )
                ),
                geographicArea: Yup.string()
                .required(
                  t(
                    'organizations:organizationManagement.form.geographicArea.required'
                  )
                ),
                // status: Yup.string()
                // .required(
                //   t(
                //     'organizations:organizationManagement.form.status.required'
                //   )
                // ),
              })}  
              onSubmit={handleSubmit}
            >
              
              {(formikProps: any) => {
                useEffect(() => {
                  if (formikProps.submitCount > 0 && Object.keys(formikProps.errors).length > 0) {
                    // Show the error message as a pop-up
                    snackbar.error(t('common:formik.validation.failed'))
                  }
                }, [formikProps.submitCount, formikProps.errors])
                return (
                  <Form>
                    <TabContext value={tabValue}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                          onChange={handleTabChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab label={t(
                              'organizations:organizationManagement.form.tab1.organizations'
                            )} value="1" />
                          <Tab label={t(
                              'organizations:organizationManagement.form.tab2.departments'
                            )} value="2" />
                          <Tab label={t(
                              'organizations:organizationManagement.form.tab3.designations'
                            )} value="3" />
                        </TabList>
                      </Box>

                      {/* tab start */}
                      {/* tab 1 */}
                      <TabPanel value="1">
                        <DialogContent>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            id="countryId"
                            disabled={processing || userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR}
                            label={t(
                              'organizations:organizationManagement.form.countryId.label'
                            )}
                            name="countryId"
                            autoComplete="given-name"
                            value={formikProps.values.countryId }
                            onChange={formikProps.handleChange}
                          >
                            {filteredCountriesData &&
                              filteredCountriesData.map((countries) => (
                                <MenuItem
                                  key={countries.id}
                                  value={countries.id}
                                >
                                  {countries.name}
                                </MenuItem>
                              ))}
                          </TextField>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            id="category"
                            label={t(
                              'organizations:organizationManagement.form.category.label'
                            )}
                            name="category"
                            disabled={processing}
                            value={formikProps.values.category}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.category &&
                              Boolean(formikProps.errors.category)
                            }
                            helperText={
                              formikProps.touched.category &&
                              formikProps.errors.category
                            }
                          >
                            {categories.map((category) => (
                              <MenuItem key={category} value={category}>
                                {category}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label={t(
                              'organizations:organizationManagement.form.name.label'
                            )}
                            name="name"
                            autoComplete="given-name"
                            disabled={processing}
                            value={formikProps.values.name}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.name &&
                              Boolean(formikProps.errors.name)
                            }
                            helperText={
                              formikProps.touched.name &&
                              formikProps.errors.name
                            }
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label={t(
                              'organizations:organizationManagement.form.description.label'
                            )}
                            name="description"
                            autoComplete="given-name"
                            multiline
                            minRows={4}
                            disabled={processing}
                            value={formikProps.values.description}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.description &&
                              Boolean(formikProps.errors.description)
                            }
                            helperText={
                              formikProps.touched.description &&
                              formikProps.errors.description
                            }
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="registeredNo"
                            label={t(
                              'organizations:organizationManagement.form.registeredNo.label'
                            )}
                            name="registeredNo"
                            autoComplete="given-name"
                            disabled={processing}
                            value={formikProps.values.registeredNo}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.registeredNo &&
                              Boolean(formikProps.errors.registeredNo)
                            }
                            helperText={
                              formikProps.touched.registeredNo &&
                              formikProps.errors.registeredNo
                            }
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="vision"
                            label={t(
                              'organizations:organizationManagement.form.vision.label'
                            )}
                            name="vision"
                            autoComplete="given-name"
                            multiline
                            minRows={4}
                            disabled={processing}
                            value={formikProps.values.vision}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.vision &&
                              Boolean(formikProps.errors.vision)
                            }
                            helperText={
                              formikProps.touched.vision &&
                              formikProps.errors.vision
                            }
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="mission"
                            label={t(
                              'organizations:organizationManagement.form.mission.label'
                            )}
                            name="mission"
                            autoComplete="given-name"
                            multiline
                            minRows={4}
                            disabled={processing}
                            value={formikProps.values.mission}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.mission &&
                              Boolean(formikProps.errors.mission)
                            }
                            helperText={
                              formikProps.touched.mission &&
                              formikProps.errors.mission
                            }
                          />
                          <FormControl component="fieldset" margin="normal">
                            <FormControlLabel
                              name="isLegalEntity"
                              disabled={processing}
                              onChange={formikProps.handleChange}
                              checked={formikProps.values.isLegalEntity}
                              control={<Checkbox />}
                              label={t(
                                'organizations:organizationManagement.form.isLegalEntity.label'
                              )}
                            />
                          </FormControl>
                          <TextField
                            margin="normal"
                            required
                            id="organizationType"
                            disabled={processing}
                            fullWidth
                            select
                            label={t(
                              'organizations:organizationManagement.form.organizationType.label'
                            )}
                            name="organizationType"
                            value={formikProps.values.organizationType}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.organizationType &&
                              Boolean(formikProps.errors.organizationType)
                            }
                            helperText={
                              formikProps.touched.organizationType &&
                              formikProps.errors.organizationType
                            }
                          >
                            {organizationTypes.map((organizationType) => (
                              <MenuItem
                                key={organizationType}
                                value={organizationType}
                              >
                                {organizationType}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            margin="normal"
                            required
                            id="geographicArea"
                            disabled={processing}
                            fullWidth
                            select
                            label={t(
                              'organizations:organizationManagement.form.geographicArea.label'
                            )}
                            name="geographicArea"
                            value={formikProps.values.geographicArea}
                            onChange={formikProps.handleChange}
                            error={
                              formikProps.touched.geographicArea &&
                              Boolean(formikProps.errors.geographicArea)
                            }
                            helperText={
                              formikProps.touched.geographicArea &&
                              formikProps.errors.geographicArea
                            }
                          >
                            {geographicAreas.map((geographicArea) => (
                              <MenuItem
                                key={geographicArea}
                                value={geographicArea}
                              >
                                {geographicArea}
                              </MenuItem>
                            ))}
                          </TextField>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={onClose}>
                            {t('common.cancel')}
                          </Button>
                          <LoadingButton
                            loading={processing}
                            type="submit"
                            variant="contained"
                            onClick={() => setTabValue('2')}
                          >
                            {t('common.next')}
                          </LoadingButton>{' '}
                        </DialogActions>
                      </TabPanel>
                      {/* tab 2 */}
                      <TabPanel value="2">
                        <DialogContent>
                          <FieldArray
                            name="departments"
                            render={(arrayHelpers) => (
                              <>
                                {formikProps.values.departments &&
                                formikProps.values.departments.length > 0 ? (
                                  formikProps.values.departments.map(
                                    (department: string, index: number) => (
                                      <Grid
                                        container
                                        spacing={2}
                                        sx={{ alignItems: 'center', mb: 1 }}
                                        key={`department-${index}`}
                                      >
                                        <Grid>
                                          <TextField
                                            key={`departments${index}`}
                                            margin="normal"
                                            // required
                                            fullWidth
                                            id={`departments.${index}`}
                                            name={`departments.${index}`}
                                            label={t(
                                              'organizations:organizationManagement.form.departments.label'
                                            )}
                                            autoComplete="given-name"
                                            disabled={processing}
                                            value={department}
                                            onChange={formikProps.handleChange}
                                            error={
                                              formikProps.touched.departments &&
                                              Boolean(formikProps.errors.departments)
                                            }
                                            helperText={
                                              formikProps.touched.departments &&
                                              formikProps.errors.departments
                                            }
                                          />
                                        </Grid>
                                        <Grid>
                                          <Fab
                                            aria-label="logout"
                                            color="default"
                                            type="button"
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                            disabled={processing}
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
                                            disabled={processing}
                                            size="small"
                                          >
                                            <AddIcon />
                                          </Fab>
                                        </Grid>
                                      </Grid>
                                    )
                                  )
                                ) : (
                                  <Button
                                    type="button"
                                    onClick={() => arrayHelpers.push('')}
                                  >
                                    <AddIcon />
                                    {t(
                                              'organizations:organizationManagement.form.tab2.buttonTitle'
                                            )}
                                  </Button>
                                )}
                              </>
                            )}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={onClose}>
                            {t('common.cancel')}
                          </Button>
                          <LoadingButton
                            loading={processing}
                            type="submit"
                            variant="contained"
                            onClick={() => setTabValue('3')}
                          >
                            {t('common.next')}
                          </LoadingButton>{' '}
                        </DialogActions>
                      </TabPanel>

                      {/* tab 3 */}
                      <TabPanel value="3">
                        <DialogContent>
                          <FieldArray
                            name="designations"
                            render={(arrayHelpers) => (
                              <div>
                                {formikProps.values.designations &&
                                formikProps.values.designations.length > 0 ? (
                                  formikProps.values.designations.map(
                                    (designation: string, index: number) => (
                                      <Grid
                                        container
                                        spacing={2}
                                        sx={{ alignItems: 'center', mb: 1 }}
                                        key={`designation-${index}`}
                                      >
                                        <Grid>
                                          <TextField
                                            margin="normal"
                                            // required
                                            fullWidth
                                            id={`designations.${index}`}
                                            name={`designations.${index}`}
                                            label={t(
                                              'organizations:organizationManagement.form.designations.label'
                                            )}
                                            autoComplete="given-name"
                                            disabled={processing}
                                            value={designation}
                                            onChange={formikProps.handleChange}
                                            error={
                                              formikProps.touched.designations &&
                                              Boolean(formikProps.errors.designations)
                                            }
                                            helperText={
                                              formikProps.touched.designations &&
                                              formikProps.errors.designations
                                            }
                                          />
                                        </Grid>
                                        <Grid>
                                          <Fab
                                            aria-label="logout"
                                            color="default"
                                            type="button"
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                            disabled={processing}
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
                                            disabled={processing}
                                            size="small"
                                          >
                                            <AddIcon />
                                          </Fab>
                                        </Grid>
                                      </Grid>
                                    )
                                  )
                                ) : (
                                  <Button
                                    type="button"
                                    onClick={() => arrayHelpers.push('')}
                                  >
                                    <AddIcon />
                                    {t(
                                              'organizations:organizationManagement.form.tab3.buttonTitle'
                                            )}
                                  </Button>
                                )}
                              </div>
                            )}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={onClose}>
                            {t('common.cancel')}
                          </Button>
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
                );
              }}
            </Formik>
          </Box>
        </DialogContent>
      {/* </form> */}
    </Dialog>
  );
};

export default OrganizationDialog;

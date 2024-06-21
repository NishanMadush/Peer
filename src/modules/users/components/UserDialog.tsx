import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Tab,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import lodash from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { AddressTypeEnum } from '../../../shared/interfaces/address'
import {
  IOrganizationExt,
  IUserSettings,
} from '../../../shared/interfaces/base'
import { AssessmentStatusEnum } from '../../../shared/interfaces/institutionalization'
import { useAuth } from '../../auth/contexts/AuthProvider'
import { DefaultUsers } from '../../baseUser/constants/helper'
import { useCountries } from '../../countries/hooks/useCountries'
import { CountryStatusEnum } from '../../countries/interfacesAndTypes/country'
import { GenderEnum, IUser, UserStatusEnum } from '../interfacesAndTypes/user'

const genders = [
  {
    label: 'users:userManagement.form.gender.options.f',
    value: GenderEnum.Female,
  },
  {
    label: 'users:userManagement.form.gender.options.m',
    value: GenderEnum.Male,
  },
  {
    label: 'users:userManagement.form.gender.options.o',
    value: GenderEnum.Other,
  },
]

// const userStatus = [
//   {
//     label: 'users:userManagement.form.userStatus.options.active',
//     value: UserStatusEnum.Active,
//   },
//   {
//     label: 'users:userManagement.form.userStatus.options.deleted',
//     value: UserStatusEnum.Deleted,
//   },
//   {
//     label: 'users:userManagement.form.userStatus.options.disabled',
//     value: UserStatusEnum.Disabled,
//   },
//   {
//     label: 'users:userManagement.form.userStatus.options.incomplete',
//     value: UserStatusEnum.Incomplete,
//   },
//   {
//     label: 'users:userManagement.form.userStatus.options.pending',
//     value: UserStatusEnum.Pending,
//   },
// ]
const userStatus = [
  UserStatusEnum.Active,
  UserStatusEnum.Deleted,
  UserStatusEnum.Disabled,
  UserStatusEnum.Incomplete,
  UserStatusEnum.Pending,
]
const addressTypes = [
  AddressTypeEnum.Resident,
  AddressTypeEnum.Postal,
  AddressTypeEnum.Office,
]

type UserDialogProps = {
  onAdd: (user: Partial<IUser>) => void
  onClose: () => void
  onUpdate: (user: Partial<IUser>) => void
  open: boolean
  processing: boolean
  user?: IUser
  userSettings?: IUserSettings
}

const UserDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  user,
  userSettings,
}: UserDialogProps): JSX.Element => {
  const { t } = useTranslation()
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const [errorMessage, setErrorMessage] = useState('')

  const editMode = Boolean(user && user.id)
  const settingRoles = userSettings?.roles
  const settingLanguages = userSettings?.languages
  const settingSalutations = userSettings?.salutation
  const settingCountries = userSettings?.countries
  const settingOrganizations = userSettings?.organizations
  const [userOrganization, setUserOrganization] = useState<
    IOrganizationExt | undefined
  >(undefined)
  const { data: countriesData } = useCountries()
  const isSuperAdministrator =
    userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR

  const filteredCountriesData = countriesData?.filter(
    (country) => country.status === CountryStatusEnum.Active
  )

  useEffect(() => {
    // To manage user with both country-id and without
    const userOrganizationId = lodash.has(
      user,
      'employment.organization.organizationId.id'
    )
      ? user?.employment?.organization?.organizationId?.id
      : user?.employment?.organization?.organizationId

    setUserOrganization(
      lodash.find(userSettings?.organizations, {
        id: userOrganizationId,
      })
    )
  }, [user, userSettings])

  const handleSubmit = (values: any) => {
    const addUserParams = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      role: values.role,
      isEmailVerified: false,
      phoneNumber: values.phoneNumber,
      status: values.status,
      languageId: values.languageId,
      profile: {
        gender: values.profile.gender ?? undefined,
        address: {
          category: values.profile?.address?.category ?? undefined,
          line1: values.profile?.address?.line1 ?? undefined,
          street: values.profile?.address?.street ?? undefined,
          city: values.profile?.address?.city ?? undefined,
          postalCode: values.profile?.address?.postalCode ?? undefined,
          countryId: values.profile?.address?.countryId ?? undefined,
          location: undefined,
        },
        profilePicture: undefined,
        salutation: values.profile.salutation ?? undefined,
      },
      employment: {
        organization: {
          organizationId: userOrganization?.id ?? undefined,
          organizationName: userOrganization?.name ?? '',
          countryId: userOrganization?.countryId ?? undefined,
        },
        department: values.employment.department ?? undefined,
        designation: values.employment.designation ?? undefined,
        email: values.employment.email ?? undefined,
        phoneNumber: values.employment.phoneNumber ?? undefined,
        branch: {
          branchId: values.employment.branch.branchId,
          branchName:
            lodash.find(userOrganization?.branches, {
              _id: values.employment.branch.branchId,
            })?.branchName ?? '',
        },
      },
    }

    if (user && user.id) {
      // Omit countryId from organization object during update
      const {
        organization: { countryId, ...organizationRest },
        ...otherEmployment
      } = addUserParams.employment
      onUpdate({
        ...addUserParams,
        id: user.id,
        employment: {
          ...otherEmployment,
          organization: organizationRest,
        },
      })
    } else {
      onAdd({ ...addUserParams, username: values.email })
    }
  }

  const formik = useFormik({
    initialValues: {
      email: user?.email ?? undefined,
      username: user?.username ?? undefined,
      password: user?.password ?? undefined,
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
      phoneNumber: user?.phoneNumber ?? undefined,
      role: user?.role ?? undefined,
      status: user?.status ?? undefined,
      isEmailVerified: user?.isEmailVerified ?? false,
      languageId: user?.languageId ?? undefined,
      profile: {
        gender: user?.profile?.gender ?? undefined,
        address: {
          category: user?.profile?.address?.category ?? undefined,
          line1: user?.profile?.address?.line1 ?? undefined,
          street: user?.profile?.address?.street ?? undefined,
          city: user?.profile?.address?.city ?? undefined,
          postalCode: user?.profile?.address?.postalCode ?? undefined,
          countryId:
            user?.profile?.address?.countryId ??
            userInfo?.employment?.organization?.organizationId?.countryId,
          location: undefined,
        },
        profilePicture: user?.profile?.profilePicture ?? undefined,
        salutation: user?.profile?.salutation ?? undefined,
      },
      employment: {
        organization: {
          organizationId:
            user?.employment?.organization?.organizationId?.id ?? undefined,
          organizationName: `${userOrganization?.name}`,
          // countryId: `${userOrganization?.countryId}`,
        },
        branch: {
          branchId: user?.employment?.branch?.branchId ?? undefined,
          branchName: user?.employment?.branch?.branchName ?? undefined,
        },
        department: user?.employment?.department ?? undefined,
        designation: user?.employment?.designation ?? undefined,
        email: user?.employment?.email ?? undefined,
        phoneNumber: user?.employment?.phoneNumber ?? undefined,
      },
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('common.validations.email'))
        .required(t('common.validations.required')),
      firstName: Yup.string()
        .max(20, t('common.validations.max', { size: 20 }))
        .required(t('common.validations.required')),
      lastName: Yup.string()
        .max(30, t('common.validations.max', { size: 30 }))
        .required(t('common.validations.required')),
      role: Yup.string().required(t('common.validations.required')),
      languageId: Yup.string().required(t('common.validations.required')),

      employment: Yup.object().shape({
        organization: Yup.object().shape({
          organizationId: Yup.string().required('Organization is required'),
        }),
        branch: Yup.object().shape({
          branchId: Yup.string().required('Branch is required'),
        }),
      }),
    }),
    onSubmit: handleSubmit,
  })

  const [tabValue, setTabValue] = useState('1')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    if (
      formik.submitCount > 0 &&
      formik.errors &&
      Object.keys(formik.errors).length > 0
    ) {
      snackbar.error(t('common:formik.validation.failed'))
    } else {
      setErrorMessage('')
    }
  }, [formik.submitCount, formik.errors])

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="user-dialog-title">
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="user-dialog-title">
          {editMode
            ? t('users:userManagement.modal.edit.title')
            : t('users:userManagement.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <Grid item xs={12} md={8} marginTop={3}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={handleTabChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label={t('users:userManagement.form.tabs.basic')}
                        value="1"
                      />
                      <Tab
                        label={t('users:userManagement.form.tabs.information')}
                        value="2"
                      />
                      <Tab
                        label={t('users:userManagement.form.tabs.employment')}
                        value="3"
                      />
                    </TabList>
                  </Box>
                  {/* Tabs start */}
                  {/* Tab 1 */}
                  <TabPanel value="1">
                    {/* <form onSubmit={formik.handleSubmit} noValidate> */}
                    <DialogContent>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        autoComplete="email"
                        label={t('users:userManagement.form.email.label')}
                        autoFocus
                        disabled={editMode}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label={t('users:userManagement.form.firstName.label')}
                        name="firstName"
                        autoComplete="given-name"
                        disabled={processing}
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.firstName &&
                          Boolean(formik.errors.firstName)
                        }
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label={t('users:userManagement.form.lastName.label')}
                        name="lastName"
                        autoComplete="family-name"
                        disabled={processing}
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.lastName &&
                          Boolean(formik.errors.lastName)
                        }
                        helperText={
                          formik.touched.lastName && formik.errors.lastName
                        }
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        id="languageId"
                        label={t(
                          'users:userManagement.form.profile.languageId.label'
                        )}
                        name="languageId"
                        autoComplete="languageId"
                        disabled={processing}
                        value={formik.values.languageId}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.languageId &&
                          Boolean(formik.errors.languageId)
                        }
                        helperText={
                          formik.touched.languageId && formik.errors.languageId
                        }
                      >
                        {settingLanguages &&
                          settingLanguages.map((userLanguage) => (
                            <MenuItem
                              key={userLanguage.id}
                              value={userLanguage.id}
                            >
                              {userLanguage.name}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        margin="normal"
                        required
                        id="role"
                        disabled={processing}
                        fullWidth
                        select
                        label={t('users:userManagement.form.role.label')}
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.role && Boolean(formik.errors.role)
                        }
                        helperText={formik.touched.role && formik.errors.role}
                      >
                        {settingRoles &&
                          settingRoles.map((userRole) => (
                            <MenuItem key={userRole.role} value={userRole.role}>
                              {userRole.role}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        margin="normal"
                        required
                        id="status"
                        disabled={!editMode || processing}
                        fullWidth
                        select
                        label={t('users:userManagement.form.status.label')}
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.status && Boolean(formik.errors.status)
                        }
                        helperText={
                          formik.touched.status && formik.errors.status
                        }
                      >
                        {userStatus.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </TextField>
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
                      <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">
                          {t('users:userManagement.form.gender.label')}
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="gender"
                          id="profile.gender"
                          name="profile.gender"
                          value={formik.values.profile.gender}
                          onChange={formik.handleChange}
                        >
                          {genders.map((gender) => (
                            <FormControlLabel
                              key={gender.value}
                              disabled={processing}
                              value={gender.value}
                              control={<Radio />}
                              label={t(gender.label)}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <TextField
                        margin="normal"
                        // required
                        fullWidth
                        select
                        id="profile.salutation"
                        name="profile.salutation"
                        autoComplete="profile.salutation"
                        label={t(
                          'users:userManagement.form.profile.salutation.label'
                        )}
                        disabled={processing}
                        value={formik.values.profile.salutation}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.salutation && Boolean(formik.errors.salutation)
                        // }
                        // helperText={formik.touched.salutation && formik.errors.salutation}
                      >
                        {settingSalutations &&
                          settingSalutations.map((userSalutation) => (
                            <MenuItem
                              key={userSalutation}
                              value={userSalutation}
                            >
                              {userSalutation}
                            </MenuItem>
                          ))}
                      </TextField>
                      {/* <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="profilePicture"
                          label={t(
                            'users:userManagement.form.profile.profilePicture.label'
                          )}
                          name="profilePicture"
                          disabled={processing}
                          value={
                            user && user.profile
                              ? user.profile.profilePicture
                              : ''
                          }
                          onChange={formik.handleChange}
                          error={
                            formik.touched.profile.profilePicture &&
                            Boolean(formik.errors.profilePicture)
                          }
                          helperText={
                            formik.touched.profilePicture &&
                            formik.errors.profilePicture
                          }
                        /> */}
                      <TextField
                        margin="normal"
                        // required
                        fullWidth
                        id="phoneNumber"
                        label={t('users:userManagement.form.phoneNumber.label')}
                        name="phoneNumber"
                        autoComplete="phoneNumber"
                        disabled={processing}
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.phoneNumber &&
                          Boolean(formik.errors.phoneNumber)
                        }
                        helperText={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }
                      />
                      <TextField
                        margin="normal"
                        // required
                        id="profile.address.category"
                        name="profile.address.category"
                        disabled={processing}
                        fullWidth
                        select
                        label={t('users:userManagement.form.category.label')}
                        value={formik.values.profile.address.category}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.category && Boolean(formik.errors.category)
                        // }
                        // helperText={
                        //   formik.touched.category && formik.errors.category
                        // }
                      >
                        {addressTypes.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        margin="normal"
                        // required
                        id="profile.address.line1"
                        name="profile.address.line1"
                        autoComplete="line1"
                        label={t('users:userManagement.form.line1.label')}
                        disabled={processing}
                        value={formik.values.profile.address.line1}
                        onChange={formik.handleChange}
                        style={{ width: '90%', float: 'right' }}
                        // error={
                        //   formik.touched.line1 && Boolean(formik.errors.line1)
                        // }
                        // helperText={
                        //   formik.touched.line1 && formik.errors.line1
                        // }
                      />
                      <TextField
                        margin="normal"
                        // required
                        id="profile.address.street"
                        name="profile.address.street"
                        autoComplete="street"
                        label={t('users:userManagement.form.street.label')}
                        disabled={processing}
                        value={formik.values.profile.address.street}
                        onChange={formik.handleChange}
                        style={{ width: '90%', float: 'right' }}
                        // error={
                        //   formik.touched.street && Boolean(formik.errors.street)
                        // }
                        // helperText={
                        //   formik.touched.street && formik.errors.street
                        // }
                      />
                      <TextField
                        margin="normal"
                        // required
                        id="profile.address.city"
                        name="profile.address.city"
                        autoComplete="city"
                        label={t('users:userManagement.form.city.label')}
                        disabled={processing}
                        value={formik.values.profile.address.city}
                        onChange={formik.handleChange}
                        style={{ width: '90%', float: 'right' }}
                        // error={
                        //   formik.touched.city && Boolean(formik.errors.city)
                        // }
                        // helperText={
                        //   formik.touched.city && formik.errors.city
                        // }
                      />
                      <TextField
                        margin="normal"
                        // required
                        id="profile.address.postalCode"
                        name="profile.address.postalCode"
                        autoComplete="postalCode"
                        label={t('users:userManagement.form.postalCode.label')}
                        disabled={processing}
                        value={formik.values.profile.address.postalCode}
                        onChange={formik.handleChange}
                        style={{ width: '90%', float: 'right' }}
                        // error={
                        //   formik.touched.postalCode && Boolean(formik.errors.postalCode)
                        // }
                        // helperText={
                        //   formik.touched.postalCode && formik.errors.postalCode
                        // }
                      />
                      <TextField
                        margin="normal"
                        // required
                        // fullWidth
                        select
                        id="profile.address.countryId"
                        name="profile.address.countryId"
                        autoComplete="countryId"
                        label={t('users:userManagement.form.countryId.label')}
                        disabled={
                          processing ||
                          userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR
                        }
                        value={formik.values.profile.address.countryId}
                        onChange={formik.handleChange}
                        style={{ width: '90%', float: 'right' }}
                        // error={
                        //   formik.touched.countryId && Boolean(formik.errors.countryId)
                        // }
                        // helperText={
                        //   formik.touched.countryId && formik.errors.countryId
                        // }
                      >
                        {filteredCountriesData &&
                          filteredCountriesData.map((userCountry) => (
                            <MenuItem
                              key={userCountry.id}
                              value={userCountry.id}
                            >
                              {userCountry.name}
                            </MenuItem>
                          ))}
                      </TextField>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={onClose}>{t('common.cancel')}</Button>
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
                  {/* Tab3 */}
                  <TabPanel value="3">
                    <DialogContent>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        id="employment.organization.organizationId"
                        name="employment.organization.organizationId"
                        label={t(
                          'users:userManagement.form.employment.organizationId.label'
                        )}
                        disabled={processing}
                        value={
                          formik.values.employment.organization.organizationId
                        }
                        onChange={(e) => {
                          console.log('~!@# e --> ', e.target.value)
                          const selectedOrganization = lodash.find(
                            settingOrganizations,
                            {
                              id: e.target.value,
                            }
                          )
                          setUserOrganization(selectedOrganization)
                          formik.handleChange(e)
                        }}
                        error={
                          formik.touched.employment?.organization
                            ?.organizationId &&
                          Boolean(
                            formik.errors.employment?.organization
                              ?.organizationId
                          )
                        }
                        helperText={
                          formik.touched.employment?.organization
                            ?.organizationId &&
                          formik.errors.employment?.organization?.organizationId
                        }
                      >
                        {settingOrganizations &&
                          settingOrganizations.map((currentOrganization) => (
                            <MenuItem
                              key={currentOrganization.id}
                              value={currentOrganization.id}
                            >
                              {currentOrganization.name}
                            </MenuItem>
                          ))}
                      </TextField>

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        id="employment.branch.branchId"
                        name="employment.branch.branchId"
                        autoComplete="employment.branchId"
                        label={t(
                          'users:userManagement.form.employment.branch.branchId.label'
                        )}
                        // disabled={editMode || processing}
                        value={formik.values.employment.branch.branchId}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.employment?.branch?.branchId &&
                          Boolean(formik.errors.employment?.branch?.branchId)
                        }
                        helperText={
                          formik.touched.employment?.branch?.branchId &&
                          formik.errors.employment?.branch?.branchId
                        }
                      >
                        {/* <MenuItem key={''} value={''}>
                          {' '}
                        </MenuItem> */}
                        {userOrganization?.branches &&
                          userOrganization?.branches.map((branch) => (
                            <MenuItem key={branch._id} value={branch._id}>
                              {branch.branchName}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        margin="normal"
                        // required
                        fullWidth
                        select
                        id="employment.department"
                        name="employment.department"
                        autoComplete="employment.department"
                        label={t(
                          'users:userManagement.form.employment.department.label'
                        )}
                        disabled={processing}
                        value={formik.values.employment.department}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.employment?.department &&
                        //   Boolean(formik.errors.employment?.department)
                        // }
                        // helperText={
                        //   formik.touched.employment?.department &&
                        //   formik.errors.employment?.department
                        // }
                      >
                        {userOrganization?.departments &&
                          userOrganization.departments.map((department) => (
                            <MenuItem key={department} value={department}>
                              {department}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        margin="normal"
                        // required
                        fullWidth
                        select
                        id="employment.designation"
                        name="employment.designation"
                        autoComplete="employment.designation"
                        label={t(
                          'users:userManagement.form.employment.designation.label'
                        )}
                        disabled={processing}
                        value={formik.values.employment.designation}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.employment?.designation &&
                        //   Boolean(formik.errors.employment?.designation)
                        // }
                        // helperText={
                        //   formik.touched.employment?.designation &&
                        //   formik.errors.employment?.designation
                        // }
                      >
                        {userOrganization?.designations &&
                          userOrganization.designations.map((designation) => (
                            <MenuItem key={designation} value={designation}>
                              {designation}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        margin="normal"
                        // required
                        fullWidth
                        id="employment.email"
                        name="employment.email"
                        autoComplete="email"
                        label={t(
                          'users:userManagement.form.employment.email.label'
                        )}
                        disabled={processing}
                        value={formik.values.employment.email}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.email && Boolean(formik.errors.email)
                        // }
                        // helperText={formik.touched.email && formik.errors.email}
                      />
                      <TextField
                        margin="normal"
                        // required
                        fullWidth
                        id="employment.phoneNumber"
                        name="employment.phoneNumber"
                        autoComplete="phoneNumber"
                        label={t(
                          'users:userManagement.form.employment.phoneNumber.label'
                        )}
                        disabled={processing}
                        value={formik.values.employment.phoneNumber}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.phoneNumber &&
                          Boolean(formik.errors.phoneNumber)
                        }
                        helperText={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }
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
                          ? t('users:userManagement.modal.edit.action')
                          : t('users:userManagement.modal.add.action')}
                      </LoadingButton>
                    </DialogActions>
                  </TabPanel>
                </TabContext>
              </Box>
            </Box>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default UserDialog

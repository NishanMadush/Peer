import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import PersonIcon from '@mui/icons-material/Person'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Tab,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { AddressTypeEnum } from '../../../shared/interfaces/address'
import { IOrganizationExt } from '../../../shared/interfaces/base'
import {
  GeographicCoverageEnum,
  ICountryProfile,
  ProgramYearsEnum,
} from '../../../shared/interfaces/countryProfile'
import {
  GenderEnum,
  IUser,
  UserStatusEnum,
} from '../../../shared/interfaces/user'
import { useAuth } from '../../auth/contexts/AuthProvider'
import { useUpdatePassword } from '../../auth/hooks/useUpdatePassword'
import { useUserSettings } from '../../users/hooks/useUserSettings'
import BaseAppBar from '../components/BaseAppBar'
import BaseToolbar from '../components/BaseToolbar'
import { accessType, authorization } from '../config/authorization'
import { DefaultUsers } from '../constants/helper'
import { useProfileInfo } from '../hooks/useProfileInfo'
import { useUpdateProfileInfo } from '../hooks/useUpdateProfileInfo'
import CircleProgressWidget from '../widgets/CircleProgressWidget'

const pathPage = 'baseUser.pages.Profile'

const Profile = (): JSX.Element => {
  const { isLoggingOut, logout, userInfo } = useAuth()
  const { data: user } = useProfileInfo(userInfo.id)
  const { isUpdating, updateProfileInfo } = useUpdateProfileInfo()
  const { isUpdating: isUpdatingPassword, updatePassword } = useUpdatePassword()
  const { data: userSettings } = useUserSettings()

  const snackbar = useSnackbar()
  const { t } = useTranslation()

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
  const courses = [
    {
      label: '> 20 years ',
      value: ProgramYearsEnum.MoreThanTwenty,
    },
    {
      label: '15-20 years',
      value: ProgramYearsEnum.BetweenfifteenAndTwenty,
    },
    {
      label: '10-15 years',
      value: ProgramYearsEnum.BetweenTenAndfifteen,
    },
    {
      label: '5-10 years',
      value: ProgramYearsEnum.BetweenFiveAndTen,
    },
    {
      label: '< 5 years',
      value: ProgramYearsEnum.LessThanFive,
    },
  ]
  const geographicCoverages = [
    {
      label: 'National',
      value: GeographicCoverageEnum.National,
    },
    {
      label: 'Provincial',
      value: GeographicCoverageEnum.Provincial,
    },
    {
      label: 'District',
      value: GeographicCoverageEnum.District,
    },
    {
      label: 'Village',
      value: GeographicCoverageEnum.Village,
    },
  ]

  const handleLogout = () => {
    logout().catch((error: any) =>
      snackbar.error(error?.message ?? t('common.errors.unexpected.subTitle'))
    )
  }

  const processing = isUpdating || isUpdatingPassword

  const userRoles = userSettings?.roles
  const userLanguages = userSettings?.languages
  const userSalutations = userSettings?.salutation
  const userCountries = userSettings?.countries
  const userOrganizations = userSettings?.organizations
  const [userOrganization, setUserOrganization] = useState<
    IOrganizationExt | undefined
  >(undefined)

  let progress = 0

  useEffect(() => {
    setUserOrganization(
      lodash.find(userSettings?.organizations, {
        id: user?.employment?.organization?.organizationId,
      })
    )
  }, [user, userSettings])

  const handleSubmit = (values: any) => {
    // console.log('~!@# values: ', values)

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
        gender: values.profile.gender,
        address: {
          category: values.profile?.address?.category ?? '',
          line1: values.profile?.address?.line1 ?? '',
          street: values.profile?.address?.street ?? '',
          city: values.profile?.address?.city ?? '',
          postalCode: values.profile?.address?.postalCode ?? '',
          countryId: values.profile?.address?.countryId ?? '',
          location: {
            lat: -1,
            lng: -1,
          },
        },
        // profilePicture: values.profile.profilePicture ?? 'picture',
        salutation: values.profile.salutation,
      },
      employment: {
        organization: {
          organizationId: `${userOrganization?.id}`,
          organizationName: `${userOrganization?.name}`,
        },
        department: values.employment.department,
        designation: values.employment.designation,
        email: values.employment.email,
        phoneNumber: values.employment.phoneNumber,
        branch: {
          branchId: values.employment.branch.branchId,
          branchName:
            lodash.find(userOrganization?.branches, {
              _id: values.employment.branch.branchId,
            })?.branchName ?? '',
        },
      },
      countryProfileSettings: {
        countryName: values.countryProfileSettings.countryName,
        nodalAgency: {
          agency: values.countryProfileSettings?.nodalAgency?.agency ?? '',
          agencyFocalPoint:
            values.countryProfileSettings?.nodalAgency?.agencyFocalPoint ?? '',
        },
        leadInstitutions: {
          cadre: values.countryProfileSettings?.leadInstitutions?.cadre ?? '',
          cadreFocalPoint:
            values.countryProfileSettings?.leadInstitutions?.cadreFocalPoint ??
            '',
          mfr: values.countryProfileSettings?.leadInstitutions?.mfr ?? '',
          mfrFocalPoint:
            values.countryProfileSettings?.leadInstitutions?.mfrFocalPoint ??
            '',
          cssr: values.countryProfileSettings?.leadInstitutions?.cssr ?? '',
          cssrFocalPoint:
            values.countryProfileSettings?.leadInstitutions?.cssrFocalPoint ??
            '',
          hope: values.countryProfileSettings?.leadInstitutions?.hope ?? '',
          hopeFocalPoint:
            values.countryProfileSettings?.leadInstitutions?.hopeFocalPoint ??
            '',
        },

        programYears: values.countryProfileSettings.programYears ?? undefined,
        geographicCoverage:
          values.countryProfileSettings.geographicCoverage ?? undefined,

        trainedResponders: {
          cadre: values.countryProfileSettings?.trainedResponders?.cadre ?? 0,
          mfr: values.countryProfileSettings?.trainedResponders?.mfr ?? 0,
          cssr: values.countryProfileSettings?.trainedResponders?.cssr ?? 0,
          hope: values.countryProfileSettings?.trainedResponders?.hope ?? 0,
        },
        trainedInstructors: {
          cadreQualified:
            values.countryProfileSettings?.trainedInstructors?.cadreQualified ??
            0,
          mfrQualified:
            values.countryProfileSettings?.trainedInstructors?.mfrQualified ??
            0,
          cssrQualified:
            values.countryProfileSettings?.trainedInstructors?.cssrQualified ??
            0,
          hopeQualified:
            values.countryProfileSettings?.trainedInstructors?.hopeQualified ??
            0,
        },
      },
    }

    // if (
    //   !(addUserParams?.profile?.address?.countryId &&
    //   addUserParams?.profile?.address?.countryId.length > 0)
    // ) {
    // }

    // console.log('~!@# updating values: ', addUserParams)
    updateProfileInfo({ ...addUserParams, id: userInfo.id })
      .then((user: IUser) => {
        snackbar.success(
          t('users:userManagement.notifications.updateSuccess', {
            user: `${user?.firstName} ${user?.lastName}`,
          })
        )
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const initialUser = {
    email: user?.email ?? '',
    username: user?.username ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    role: user?.role ?? '',
    status: user?.status ?? UserStatusEnum.Pending,
    // isEmailVerified: user?.isEmailVerified ?? false,
    languageId: user?.languageId ?? '',
    profile: {
      gender: user?.profile?.gender ?? undefined,
      address: {
        category: user?.profile?.address?.category ?? AddressTypeEnum.Resident,
        line1: user?.profile?.address?.line1 ?? '',
        street: user?.profile?.address?.street ?? '',
        city: user?.profile?.address?.city ?? '',
        postalCode: user?.profile?.address?.postalCode ?? '',
        countryId:
          user?.profile?.address?.countryId ??
          userInfo?.employment?.organization?.organizationId?.countryId,
        location: {
          lat: -1,
          lng: -1,
        },
      },
      // profilePicture: user?.profile?.profilePicture ?? '',
      salutation: user?.profile?.salutation ?? '',
    },
    employment: {
      organization: {
        organizationId:
          user?.employment?.organization?.organizationId ?? undefined,
        organizationName: `${userOrganization?.name}`,
        countryId: `${userOrganization?.countryId}`,
      },
      branch: {
        branchId: user?.employment?.branch?.branchId ?? undefined,
        branchName: user?.employment?.branch?.branchName ?? undefined,
      },
      department: user?.employment?.department ?? undefined,
      designation: user?.employment?.designation ?? undefined,
      email: user?.employment?.email ?? undefined,
      phoneNumber: user?.employment?.phoneNumber ?? '',
    },
    countryProfileSettings: {
      countryName: user?.countryProfileSettings?.countryName ?? '',
      nodalAgency: {
        agency: user?.countryProfileSettings?.nodalAgency?.agency ?? '',
        agencyFocalPoint:
          user?.countryProfileSettings?.nodalAgency?.agencyFocalPoint ?? '',
      },
      leadInstitutions: {
        cadre: user?.countryProfileSettings?.leadInstitutions?.cadre ?? '',
        cadreFocalPoint:
          user?.countryProfileSettings?.leadInstitutions?.cadreFocalPoint ?? '',
        mfr: user?.countryProfileSettings?.leadInstitutions?.mfr ?? '',
        mfrFocalPoint:
          user?.countryProfileSettings?.leadInstitutions?.mfrFocalPoint ?? '',
        cssr: user?.countryProfileSettings?.leadInstitutions?.cssr ?? '',
        cssrFocalPoint:
          user?.countryProfileSettings?.leadInstitutions?.cssrFocalPoint ?? '',
        hope: user?.countryProfileSettings?.leadInstitutions?.hope ?? '',
        hopeFocalPoint:
          user?.countryProfileSettings?.leadInstitutions?.hopeFocalPoint ?? '',
      },
      programYears: user?.countryProfileSettings?.programYears ?? undefined,
      geographicCoverage:
        user?.countryProfileSettings?.geographicCoverage ?? undefined,
      trainedResponders: {
        cadre: user?.countryProfileSettings?.trainedResponders?.cadre ?? 0,
        mfr: user?.countryProfileSettings?.trainedResponders?.mfr ?? 0,
        cssr: user?.countryProfileSettings?.trainedResponders?.cssr ?? 0,
        hope: user?.countryProfileSettings?.trainedResponders?.hope ?? 0,
      },
      trainedInstructors: {
        cadreQualified:
          user?.countryProfileSettings?.trainedInstructors?.cadreQualified ?? 0,
        mfrQualified:
          user?.countryProfileSettings?.trainedInstructors?.mfrQualified ?? 0,
        cssrQualified:
          user?.countryProfileSettings?.trainedInstructors?.cssrQualified ?? 0,
        hopeQualified:
          user?.countryProfileSettings?.trainedInstructors?.hopeQualified ?? 0,
      },
    },
  }

  // Calculate profile progress
  let keys = 0
  let count = 0
  Object.entries(initialUser).forEach(([key, value]) => {
    if (key === 'profile' || key === 'employment') {
      Object.entries(initialUser[key]).forEach(([key1, value1]) => {
        if (key1 === 'address') {
          Object.entries(value1).forEach(([key2, value2]) => {
            // console.log(`~!@# ${key} .... ${key1} .... ${key2} -->: ${value2}`)
            keys++
            if (!lodash.isEmpty(value2)) count++
          })
        } else {
          // console.log(`~!@# ${key} .... ${key1} -->: ${value1}`)
          keys++
          if (!lodash.isEmpty(value1)) count++
        }
      })
    } else {
      // console.log(`~!@# ${key} =>: ${value}`)
      keys++
      if (!lodash.isEmpty(value)) count++
    }
  })

  // console.log(`~!@# ${keys} -->: ${count}`)
  progress = parseInt(`${(count / keys) * 100}`, 10)
  // console.log('~!@# profile progress: ', progress)

  const formik = useFormik({
    initialValues: initialUser,
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
      profile: Yup.object().shape({
        address: Yup.object().shape({
          countryId: Yup.string()
            .required('Country is required')
            .min(8, t('common.validations.min', { size: 8 })),
        }),
      }),
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

  // const formik = useFormik({
  //   initialValues: initialCountryProfile,
  //   validationSchema: null,
  //   onSubmit: handleSubmit,
  // })

  const formikPassword = useFormik({
    initialValues: {
      username: userInfo?.username,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .min(8, t('common.validations.min', { size: 8 }))
        .required(t('common.validations.required')),
      newPassword: Yup.string()
        .min(8, t('common.validations.min', { size: 8 }))
        .required(t('common.validations.required')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], t('common.validations.passwordMatch'))
        .required(t('common.validations.required')),
    }),
    onSubmit: (values: any) =>
      handleUpdatePassword(
        values.username,
        values.oldPassword,
        values.newPassword
      ),
  })

  const handleUpdatePassword = async (
    username: string,
    oldPassword: string,
    newPassword: string
  ) => {
    updatePassword({ username, oldPassword, newPassword })
      .then(() => {
        formikPassword.resetForm()
        snackbar.success(t('profile.notifications.passwordChanged'))
      })
      .catch((error: Error) => {
        snackbar.error(
          error?.message
            ? error.message
            : t('common.errors.unexpected.subTitle')
        )
      })
  }

  // const editMode = Boolean(countryReviews && countryReviews.id)

  const [tabValue, setTabValue] = useState('1')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  return (
    <React.Fragment>
      <BaseAppBar>
        <BaseToolbar>
          <Fab
            aria-label="logout"
            color="secondary"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            <ExitToAppIcon />
          </Fab>
        </BaseToolbar>
      </BaseAppBar>
      <Grid container spacing={12}>
        <Grid item xs={12} md={4} marginTop={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              mb: 6,
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'background.paper',
                mb: 3,
                height: 160,
                width: 160,
              }}
            >
              <PersonIcon sx={{ fontSize: 120 }} />
            </Avatar>
            <Typography
              component="div"
              variant="h4"
            >{`${userInfo?.firstName} ${userInfo?.lastName}`}</Typography>
            <Typography variant="body2">{userInfo?.role}</Typography>
          </Box>
          <CircleProgressWidget
            height={244}
            title={t('profile.completion.title')}
            value={progress}
          />
        </Grid>
        <Grid item xs={12} md={8} marginTop={3}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabValue}>
              <Box m={3}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label={t('users:userManagement.profile.dialog.tab.basic')}
                    value="1"
                  />
                  <Tab
                    label={t(
                      'users:userManagement.profile.dialog.tab.information'
                    )}
                    value="2"
                  />
                  <Tab
                    label={t(
                      'users:userManagement.profile.dialog.tab.employment'
                    )}
                    value="3"
                  />
                  {authorization(
                    userInfo?.role,
                    pathPage,
                    'background',
                    accessType.Enable
                  ) && (
                    <Tab
                      label={t(
                        'users:userManagement.profile.dialog.tab.background'
                      )}
                      value="4"
                    />
                  )}
                  <Tab
                    label={t(
                      'users:userManagement.profile.dialog.tab.password'
                    )}
                    value="5"
                  />
                </TabList>
              </Box>

              {/* Tabs start */}
              <Card>
                <form onSubmit={formik.handleSubmit} noValidate>
                  {/* Tab 1 */}
                  <TabPanel value="1">
                    <CardContent>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        autoComplete="email"
                        label={t('users:userManagement.form.email.label')}
                        autoFocus
                        disabled={true}
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
                        required
                        id="role"
                        disabled={true}
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
                        {userRoles &&
                          userRoles.map((userRole) => (
                            <MenuItem key={userRole.role} value={userRole.role}>
                              {userRole.role}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        margin="normal"
                        required
                        id="status"
                        disabled={true}
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
                    </CardContent>
                    <CardActions>
                      <LoadingButton
                        type="submit"
                        loading={processing}
                        variant="contained"
                      >
                        {t('common.update')}
                      </LoadingButton>
                    </CardActions>
                  </TabPanel>
                  {/* Tab2 */}
                  <TabPanel value="2">
                    <CardContent>
                      <FormControl component="fieldset" margin="none">
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
                        {userSalutations &&
                          userSalutations.map((userSalutation) => (
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
                        select
                        id="languageId"
                        label={t(
                          'users:userManagement.form.profile.languageId.label'
                        )}
                        name="languageId"
                        autoComplete="languageId"
                        disabled={true}
                        value={formik.values.languageId}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.languageId && Boolean(formik.errors.languageId)
                        // }
                        // helperText={formik.touched.languageId && formik.errors.languageId}
                      >
                        {userLanguages &&
                          userLanguages.map((userLanguage) => (
                            <MenuItem
                              key={userLanguage.id}
                              value={userLanguage.id}
                            >
                              {userLanguage.name}
                            </MenuItem>
                          ))}
                      </TextField> */}
                      {/* <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="profile.profilePicture"
                        name="profile.profilePicture"
                        label={t(
                          'users:userManagement.form.profile.profilePicture.label'
                        )}
                        disabled={processing}
                        value={formik.values.profile.profilePicture}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.profile.profilePicture &&
                        //   Boolean(formik.errors.profilePicture)
                        // }
                        // helperText={
                        //   formik.touched.profilePicture &&
                        //   formik.errors.profilePicture
                        // }
                      /> */}
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
                        //   formik.touched.category &&
                        //   Boolean(formik.errors.category)
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
                        // fullWidth
                        id="profile.address.line1"
                        name="profile.address.line1"
                        autoComplete="line1"
                        label={t('users:userManagement.form.line1.label')}
                        disabled={processing}
                        value={formik.values.profile.address.line1}
                        onChange={formik.handleChange}
                        style={{ width: '90%' }}
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
                        // fullWidth
                        id="profile.address.street"
                        name="profile.address.street"
                        autoComplete="street"
                        label={t('users:userManagement.form.street.label')}
                        disabled={processing}
                        value={formik.values.profile.address.street}
                        onChange={formik.handleChange}
                        style={{ width: '90%' }}
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
                        // fullWidth
                        id="profile.address.city"
                        name="profile.address.city"
                        autoComplete="city"
                        label={t('users:userManagement.form.city.label')}
                        disabled={processing}
                        value={formik.values.profile.address.city}
                        onChange={formik.handleChange}
                        style={{ width: '90%' }}
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
                        // fullWidth
                        id="profile.address.postalCode"
                        name="profile.address.postalCode"
                        autoComplete="postalCode"
                        label={t('users:userManagement.form.postalCode.label')}
                        disabled={processing}
                        value={formik.values.profile.address.postalCode}
                        onChange={formik.handleChange}
                        style={{ width: '90%' }}
                        // error={
                        //   formik.touched.postalCode && Boolean(formik.errors.postalCode)
                        // }
                        // helperText={
                        //   formik.touched.postalCode && formik.errors.postalCode
                        // }
                      />
                      <TextField
                        margin="normal"
                        required
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
                        style={{ width: '90%' }}
                        error={
                          formik.touched?.profile?.address?.countryId &&
                          Boolean(formik.errors?.profile?.address?.countryId)
                        }
                        helperText={
                          formik.touched?.profile?.address?.countryId &&
                          formik.errors?.profile?.address?.countryId
                        }
                      >
                        {userCountries &&
                          userCountries.map((userCountry) => (
                            <MenuItem
                              key={userCountry.id}
                              value={userCountry.id}
                            >
                              {userCountry.name}
                            </MenuItem>
                          ))}
                      </TextField>
                    </CardContent>
                    <CardActions>
                      <LoadingButton
                        type="submit"
                        loading={processing}
                        variant="contained"
                      >
                        {t('common.update')}
                      </LoadingButton>
                    </CardActions>
                  </TabPanel>
                  {/* Tab3 */}
                  <TabPanel value="3">
                    <CardContent>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        id="employment.organizationId"
                        name="employment.organizationId"
                        label={t(
                          'users:userManagement.form.employment.organizationId.label'
                        )}
                        disabled={true}
                        value={
                          formik.values.employment.organization.organizationId
                        }
                        // onChange={formik.handleChange}
                        onChange={(e) => {
                          // console.log('~!@# e --> ', e.target.value)
                          const selectedOrganization = lodash.find(
                            userOrganizations,
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
                        {userOrganizations &&
                          userOrganizations.map((userOrganization) => (
                            <MenuItem
                              key={userOrganization.id}
                              value={userOrganization.id}
                            >
                              {userOrganization.name}
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
                        // disabled={processing}
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
                          userOrganization.branches.map((branch) => (
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
                        //   formik.touched.department && Boolean(formik.errors.department)
                        // }
                        // helperText={formik.touched.department && formik.errors.department}
                      >
                        {/* <MenuItem key={''} value={''}>
                          {' '}
                        </MenuItem> */}
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
                        //   formik.touched.designation && Boolean(formik.errors.designation)
                        // }
                        // helperText={formik.touched.designation && formik.errors.designation}
                      >
                        {/* <MenuItem key={''} value={''}>
                          {' '}
                        </MenuItem> */}
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
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
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
                    </CardContent>
                    <CardActions>
                      <LoadingButton
                        type="submit"
                        loading={processing}
                        variant="contained"
                      >
                        {t('common.update')}
                      </LoadingButton>
                    </CardActions>
                  </TabPanel>
                </form>
              </Card>

              {authorization(
                userInfo?.role,
                pathPage,
                'background',
                accessType.Enable
              ) && (
                <Card>
                  <form onSubmit={formik.handleSubmit} noValidate>
                    <TabPanel value="4">
                      <CardContent>
                        <FormLabel component="legend">
                          {t('Country Profile')}
                        </FormLabel>
                        <Grid container spacing={2} sx={{ marginTop: '-10px' }}>
                          <Grid
                            item
                            xs={12}
                            lg={12}
                            sx={{ marginBottom: '-16px' }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              fullWidth
                              select
                              id="profile.address.countryId"
                              name="profile.address.countryId"
                              autoComplete="countryId"
                              label={t(
                                'users:userManagement.form.countryProfile.countryName.label'
                              )}
                              disabled={isUpdating}
                              // disabled={true}
                              value={formik.values.profile.address.countryId}
                              onChange={formik.handleChange}
                              // error={
                              //   formik.touched.countryId && Boolean(formik.errors.countryId)
                              // }
                              // helperText={
                              //   formik.touched.countryId && formik.errors.countryId
                              // }
                            >
                              {userCountries &&
                                userCountries.map((userCountry) => (
                                  <MenuItem
                                    key={userCountry.id}
                                    value={userCountry.id}
                                  >
                                    {userCountry.name}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={4} lg={4}>
                            <TextField
                              margin="normal"
                              // required
                              fullWidth
                              id="countryProfileSettings.nodalAgency.agency"
                              name="countryProfileSettings.nodalAgency.agency"
                              label={t(
                                'users:userManagement.form.countryProfile.nodalAgency.label'
                              )}
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings.nodalAgency
                                  .agency
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.nodalAgency?.agency &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.nodalAgency?.agency
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.nodalAgency?.agency &&
                                formik.errors.countryProfileSettings
                                  ?.nodalAgency?.agency
                              }
                            />
                          </Grid>
                          <Grid item xs={8} lg={8}>
                            <TextField
                              margin="normal"
                              // required
                              fullWidth
                              id="countryProfileSettings.nodalAgency.agencyFocalPoint"
                              name="countryProfileSettings.nodalAgency.agencyFocalPoint"
                              label={t(
                                'users:userManagement.form.countryProfile.focalPoint.label'
                              )}
                              // autoComplete="focalPoint"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings.nodalAgency
                                  .agencyFocalPoint
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.nodalAgency?.agencyFocalPoint &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.nodalAgency?.agencyFocalPoint
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.nodalAgency?.agencyFocalPoint &&
                                formik.errors.countryProfileSettings
                                  ?.nodalAgency?.agencyFocalPoint
                              }
                            />
                          </Grid>
                        </Grid>

                        <>
                          <FormLabel component="legend" sx={{ mt: 4 }}>
                            {t(
                              'users:userManagement.form.countryProfile.leadImplementingInstitutions.label'
                            )}
                          </FormLabel>
                          <Grid
                            container
                            spacing={2}
                            sx={{ marginTop: '-10px' }}
                          >
                            <Grid item xs={4} lg={4}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.cadre"
                                name="countryProfileSettings.leadInstitutions.cadre"
                                label={t(
                                  'users:userManagement.form.countryProfile.cadre.label'
                                )}
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.cadre
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cadre &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.cadre
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cadre &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.cadre
                                }
                              />
                            </Grid>
                            <Grid item xs={8} lg={8}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.cadreFocalPoint"
                                name="countryProfileSettings.leadInstitutions.cadreFocalPoint"
                                label={t(
                                  'users:userManagement.form.countryProfile.focalPoint.label'
                                )}
                                autoComplete="focalPoint"
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.cadreFocalPoint
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cadreFocalPoint &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.cadreFocalPoint
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cadreFocalPoint &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.cadreFocalPoint
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} sx={{}}>
                            <Grid item xs={4} lg={4}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.mfr"
                                name="countryProfileSettings.leadInstitutions.mfr"
                                label={t(
                                  'users:userManagement.form.countryProfile.mfr.label'
                                )}
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.mfr
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.mfr &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.mfr
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.mfr &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.mfr
                                }
                              />
                            </Grid>
                            <Grid item xs={8} lg={8}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.mfrFocalPoint"
                                name="countryProfileSettings.leadInstitutions.mfrFocalPoint"
                                label={t(
                                  'users:userManagement.form.countryProfile.focalPoint.label'
                                )}
                                autoComplete="focalPoint"
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.mfrFocalPoint
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.mfrFocalPoint &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.mfrFocalPoint
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.mfrFocalPoint &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.mfrFocalPoint
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} sx={{}}>
                            <Grid item xs={4} lg={4}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.cssr"
                                name="countryProfileSettings.leadInstitutions.cssr"
                                label={t(
                                  'users:userManagement.form.countryProfile.csrr.label'
                                )}
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.cssr
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cssr &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.cssr
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cssr &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.cssr
                                }
                              />
                            </Grid>
                            <Grid item xs={8} lg={8}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.cssrFocalPoint"
                                name="countryProfileSettings.leadInstitutions.cssrFocalPoint"
                                label={t(
                                  'users:userManagement.form.countryProfile.focalPoint.label'
                                )}
                                autoComplete="focalPoint"
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.cssrFocalPoint
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cssrFocalPoint &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.cssrFocalPoint
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.cssrFocalPoint &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.cssrFocalPoint
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} sx={{}}>
                            <Grid item xs={4} lg={4}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.hope"
                                name="countryProfileSettings.leadInstitutions.hope"
                                label={t(
                                  'users:userManagement.form.countryProfile.hope.label'
                                )}
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.hope
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.hope &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.hope
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.hope &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.hope
                                }
                              />
                            </Grid>
                            <Grid item xs={8} lg={8}>
                              <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="countryProfileSettings.leadInstitutions.hopeFocalPoint"
                                name="countryProfileSettings.leadInstitutions.hopeFocalPoint"
                                label={t(
                                  'users:userManagement.form.countryProfile.focalPoint.label'
                                )}
                                autoComplete="focalPoint"
                                disabled={isUpdating}
                                value={
                                  formik.values.countryProfileSettings
                                    .leadInstitutions.hopeFocalPoint
                                }
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.hopeFocalPoint &&
                                  Boolean(
                                    formik.errors.countryProfileSettings
                                      ?.leadInstitutions?.hopeFocalPoint
                                  )
                                }
                                helperText={
                                  formik.touched.countryProfileSettings
                                    ?.leadInstitutions?.hopeFocalPoint &&
                                  formik.errors.countryProfileSettings
                                    ?.leadInstitutions?.hopeFocalPoint
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                        <FormControl component="fieldset" margin="normal">
                          <FormLabel component="legend" sx={{ mt: 4 }}>
                            {t(
                              'users:userManagement.form.countryProfile.programYears.label'
                            )}
                          </FormLabel>
                          <Grid container sx={{ mt: 0 }}>
                            <RadioGroup
                              row
                              aria-label="programYears"
                              id="countryProfileSettings.programYears"
                              name="countryProfileSettings.programYears"
                              value={
                                formik.values.countryProfileSettings
                                  .programYears
                              }
                              onChange={formik.handleChange}
                            >
                              {courses.map((course) => (
                                <FormControlLabel
                                  key={course.value}
                                  disabled={processing}
                                  value={course.value}
                                  control={<Radio />}
                                  label={t(course.label)}
                                />
                              ))}
                            </RadioGroup>
                          </Grid>
                        </FormControl>
                        <FormControl component="fieldset" margin="normal">
                          <FormLabel component="legend" sx={{ mt: 4 }}>
                            {t(
                              'users:userManagement.form.countryProfile.geographicCoverage.label'
                            )}
                          </FormLabel>
                          <Grid container sx={{ mt: 0 }}>
                            <RadioGroup
                              row
                              aria-label="geographicCoverage"
                              id="countryProfileSettings.geographicCoverage"
                              name="countryProfileSettings.geographicCoverage"
                              value={
                                formik.values.countryProfileSettings
                                  .geographicCoverage
                              }
                              onChange={formik.handleChange}
                            >
                              {geographicCoverages.map((geographicCoverage) => (
                                <FormControlLabel
                                  key={geographicCoverage.value}
                                  disabled={processing}
                                  value={geographicCoverage.value}
                                  control={<Radio />}
                                  label={t(geographicCoverage.label)}
                                />
                              ))}
                            </RadioGroup>
                          </Grid>
                        </FormControl>

                        <FormLabel component="legend" sx={{ mt: 4 }}>
                          {t(
                            'users:userManagement.form.countryProfile.trainedResponders.label'
                          )}
                        </FormLabel>
                        <Grid container spacing={2} sx={{ marginTop: '-10px' }}>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedResponders.cadre"
                              label={t(
                                'users:userManagement.form.countryProfile.cadreTrainedResponders.label'
                              )}
                              id="countryProfileSettings.trainedResponders.cadre"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedResponders.cadre
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.cadre &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedResponders?.cadre
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.cadre &&
                                formik.errors.countryProfileSettings
                                  ?.trainedResponders?.cadre
                              }
                            />
                          </Grid>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedResponders.mfr"
                              label={t(
                                'users:userManagement.form.countryProfile.mfrTrainedResponders.label'
                              )}
                              id="countryProfileSettings.trainedResponders.mfr"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedResponders.mfr
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.mfr &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedResponders?.mfr
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.mfr &&
                                formik.errors.countryProfileSettings
                                  ?.trainedResponders?.mfr
                              }
                            />
                          </Grid>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedResponders.cssr"
                              label={t(
                                'users:userManagement.form.countryProfile.csrrTrainedResponders.label'
                              )}
                              id="countryProfileSettings.trainedResponders.cssr"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedResponders.cssr
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.cssr &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedResponders?.cssr
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.cssr &&
                                formik.errors.countryProfileSettings
                                  ?.trainedResponders?.cssr
                              }
                            />
                          </Grid>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedResponders.hope"
                              label={t(
                                'users:userManagement.form.countryProfile.hopeTrainedResponders.label'
                              )}
                              id="countryProfileSettings.trainedResponders.hope"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedResponders.hope
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.hope &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedResponders?.hope
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedResponders?.hope &&
                                formik.errors.countryProfileSettings
                                  ?.trainedResponders?.hope
                              }
                            />
                          </Grid>
                        </Grid>

                        <FormLabel component="legend" sx={{ mt: 4 }}>
                          {t(
                            'users:userManagement.form.countryProfile.qualifiedTrainedInstructors.label'
                          )}
                        </FormLabel>
                        <Grid container spacing={2} sx={{ marginTop: '-10px' }}>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedInstructors.cadreQualified"
                              label={t(
                                'users:userManagement.form.countryProfile.cadreQualifiedTrainedInstructors.label'
                              )}
                              id="countryProfileSettings.trainedInstructors.cadreQualified"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedInstructors.cadreQualified
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.cadreQualified &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedInstructors?.cadreQualified
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.cadreQualified &&
                                formik.errors.countryProfileSettings
                                  ?.trainedInstructors?.cadreQualified
                              }
                            />
                          </Grid>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedInstructors.mfrQualified"
                              label={t(
                                'users:userManagement.form.countryProfile.mfrQualifiedTrainedInstructors.label'
                              )}
                              id="countryProfileSettings.trainedInstructors.mfrQualified"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedInstructors.mfrQualified
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.mfrQualified &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedInstructors?.mfrQualified
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.mfrQualified &&
                                formik.errors.countryProfileSettings
                                  ?.trainedInstructors?.mfrQualified
                              }
                            />
                          </Grid>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedInstructors.cssrQualified"
                              label={t(
                                'users:userManagement.form.countryProfile.csrrQualifiedTrainedInstructors.label'
                              )}
                              id="countryProfileSettings.trainedInstructors.cssrQualified"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedInstructors.cssrQualified
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.cssrQualified &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedInstructors?.cssrQualified
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.cssrQualified &&
                                formik.errors.countryProfileSettings
                                  ?.trainedInstructors?.cssrQualified
                              }
                            />
                          </Grid>
                          <Grid item xs={3} lg={3}>
                            <TextField
                              margin="normal"
                              // required
                              name="countryProfileSettings.trainedInstructors.hopeQualified"
                              label={t(
                                'users:userManagement.form.countryProfile.hopeQualifiedTrainedInstructors.label'
                              )}
                              id="countryProfileSettings.trainedInstructors.hopeQualified"
                              disabled={isUpdating}
                              value={
                                formik.values.countryProfileSettings
                                  .trainedInstructors.hopeQualified
                              }
                              onChange={formik.handleChange}
                              error={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.hopeQualified &&
                                Boolean(
                                  formik.errors.countryProfileSettings
                                    ?.trainedInstructors?.hopeQualified
                                )
                              }
                              helperText={
                                formik.touched.countryProfileSettings
                                  ?.trainedInstructors?.hopeQualified &&
                                formik.errors.countryProfileSettings
                                  ?.trainedInstructors?.hopeQualified
                              }
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <LoadingButton
                          type="submit"
                          loading={processing}
                          variant="contained"
                        >
                          {t('common.update')}
                        </LoadingButton>
                      </CardActions>
                    </TabPanel>
                  </form>
                </Card>
              )}
              <Card>
                <form onSubmit={formikPassword.handleSubmit} noValidate>
                  <TabPanel value="5">
                    <CardContent>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="oldPassword"
                        label={t('profile.password.form.current.label')}
                        type="password"
                        id="oldPassword"
                        autoComplete="current-password"
                        disabled={isUpdating}
                        value={formikPassword.values.oldPassword}
                        onChange={formikPassword.handleChange}
                        error={
                          formikPassword.touched.oldPassword &&
                          Boolean(formikPassword.errors.oldPassword)
                        }
                        helperText={
                          formikPassword.touched.oldPassword &&
                          formikPassword.errors.oldPassword
                        }
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label={t('profile.password.form.new.label')}
                        type="password"
                        id="newPassword"
                        disabled={isUpdating}
                        value={formikPassword.values.newPassword}
                        onChange={formikPassword.handleChange}
                        error={
                          formikPassword.touched.newPassword &&
                          Boolean(formikPassword.errors.newPassword)
                        }
                        helperText={
                          formikPassword.touched.newPassword &&
                          formikPassword.errors.newPassword
                        }
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label={t('profile.password.form.confirm.label')}
                        type="password"
                        id="confirmPassword"
                        disabled={isUpdating}
                        value={formikPassword.values.confirmPassword}
                        onChange={formikPassword.handleChange}
                        error={
                          formikPassword.touched.confirmPassword &&
                          Boolean(formikPassword.errors.confirmPassword)
                        }
                        helperText={
                          formikPassword.touched.confirmPassword &&
                          formikPassword.errors.confirmPassword
                        }
                      />
                    </CardContent>
                    <CardActions>
                      <LoadingButton
                        type="submit"
                        loading={processing}
                        variant="contained"
                      >
                        {t('common.update')}
                      </LoadingButton>
                    </CardActions>
                  </TabPanel>
                </form>
              </Card>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Profile

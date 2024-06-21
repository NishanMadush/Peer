import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import BoxedLayout from '../../../core/components/BoxedLayout'
import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { PasswordActionEnum } from '../../../shared/interfaces/auth'
import { PUBLIC_LOGIN_ROUTE } from '../constants/routes'
import { useCreatePassword } from '../hooks/useCreatePassword'
import { useResetPassword } from '../hooks/useResetPassword'

const ResetPassword = (): JSX.Element => {
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const location = useLocation()

  const { createPassword, isLoading: creating } = useCreatePassword()
  const { resetPassword, isLoading } = useResetPassword()
  const paramToken = new URLSearchParams(location.search).get('token') ?? ''
  const paramAction =
    new URLSearchParams(location.search).get('action') ===
    PasswordActionEnum.Create
      ? PasswordActionEnum.Create
      : PasswordActionEnum.Reset

  const processing = isLoading || creating

  const formik = useFormik({
    initialValues: {
      code: paramToken,
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required(t('common.validations.required')),
      newPassword: Yup.string().required(t('common.validations.required')),
      confirmPassword: Yup.string().required(t('common.validations.required')),
    }),
    onSubmit: ({ code, newPassword }) =>
      handleSubmitPassword(code, newPassword),
  })

  const handleSubmitPassword = async (code: string, newPassword: string) => {
    if (paramAction === PasswordActionEnum.Create) {
      createPassword({ code, password: newPassword })
        .then(() => {
          snackbar.success(t('auth.createPassword.notifications.success'))
          navigate(`/${PUBLIC_LOGIN_ROUTE}`)
        })
        .catch((error: any) => {
          snackbar.error(
            error?.message ?? t('common.errors.unexpected.subTitle')
          )
        })
    } else {
      resetPassword({ code, newPassword })
        .then(() => {
          snackbar.success(t('auth.resetPassword.notifications.success'))
          navigate(`/${PUBLIC_LOGIN_ROUTE}`)
        })
        .catch((error: any) => {
          snackbar.error(
            error?.message ?? t('common.errors.unexpected.subTitle')
          )
        })
    }
  }

  return (
    <BoxedLayout>
      <Typography component="h1" variant="h5">
        {paramAction === PasswordActionEnum.Create
          ? t('auth.createPassword.title')
          : t('auth.resetPassword.title')}
      </Typography>
      <Typography marginTop={3}>
        {paramAction === PasswordActionEnum.Create
          ? t('auth.createPassword.subTitle')
          : t('auth.resetPassword.subTitle')}
      </Typography>
      <Box
        component="form"
        marginTop={3}
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="code"
          label={t('auth.resetPassword.form.code.label')}
          name="code"
          disabled={processing || !!formik.values.code}
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label={t('auth.resetPassword.form.newPassword.label')}
          type="password"
          id="newPassword"
          autoFocus
          disabled={processing}
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label={t('auth.resetPassword.form.confirmPassword.label')}
          type="password"
          id="confirmPassword"
          disabled={processing}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={processing}
          loading={processing}
          sx={{ mt: 2 }}
        >
          {paramAction === PasswordActionEnum.Create
            ? t('auth.createPassword.form.action')
            : t('auth.resetPassword.form.action')}
        </LoadingButton>
        <Button
          component={Link}
          to={`/${PUBLIC_LOGIN_ROUTE}`}
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {t('auth.resetPassword.form.back')}
        </Button>
      </Box>
    </BoxedLayout>
  )
}

export default ResetPassword

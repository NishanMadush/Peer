import { Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import BoxedLayout from '../../../core/components/BoxedLayout'
import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { ROOT_ROUTE } from '../../baseUser/constants/routes'
import {
  PUBLIC_FORGOT_PASSWORD_ROUTE,
  PUBLIC_REGISTER_ROUTE,
} from '../constants/routes'
import { useAuth } from '../contexts/AuthProvider'

const Login = (): JSX.Element => {
  const { isLoggingIn, login } = useAuth()
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleLogin = (email: string, password: string) => {
    login(email, password)
      .then(() => {
        navigate(`/${ROOT_ROUTE}`, { replace: true })
      })
      .catch((error: Error) => {
        snackbar.error(
          error?.message
            ? error.message
            : t('common.errors.unexpected.subTitle')
        )
        // snackbar.error()
      })
  }

  const formik = useFormik({
    initialValues: {
      // email: 'demo@example.com',
      // password: 'guWEK<r/-47-XG3',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('common.validations.email'))
        .required(t('common.validations.required')),
      password: Yup.string()
        .min(8, t('common.validations.min', { size: 8 }))
        .required(t('common.validations.required')),
    }),
    onSubmit: (values) =>
      handleLogin(values.email.toLocaleLowerCase(), values.password),
  })

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(./img/template-light.png)',
          backgroundRepeat: 'no-repeat',
          bgcolor: 'background.default',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} square>
        <BoxedLayout>
          <Typography component="h1" variant="h5">
            {t('auth.login.title')}
          </Typography>
          <Box
            component="form"
            marginTop={3}
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <TextField
              margin="normal"
              variant="filled"
              required
              fullWidth
              id="email"
              label={t('auth.login.form.email.label')}
              name="email"
              autoComplete="email"
              autoFocus
              disabled={isLoggingIn}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              variant="filled"
              required
              fullWidth
              name="password"
              label={t('auth.login.form.password.label')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              disabled={isLoggingIn}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ textAlign: 'right' }}>
              <Link
                component={RouterLink}
                to={`/${PUBLIC_FORGOT_PASSWORD_ROUTE}`}
                variant="body2"
              >
                {t('auth.login.forgotPasswordLink')}
              </Link>
            </Box>
            <LoadingButton
              type="submit"
              fullWidth
              loading={isLoggingIn}
              variant="contained"
              sx={{ mt: 3 }}
            >
              {t('auth.login.submit')}
            </LoadingButton>
            {/* <Button
              component={RouterLink}
              to={`/${PUBLIC_REGISTER_ROUTE}`}
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {t('auth.login.newAccountLink')}
            </Button> */}
          </Box>
        </BoxedLayout>
      </Grid>
    </Grid>
  )
}

export default Login

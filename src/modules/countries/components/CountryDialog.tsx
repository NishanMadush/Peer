import { LoadingButton } from '@mui/lab'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { CountryStatusEnum, ICountry } from '../interfacesAndTypes/country'

const isAppCountryOptions = [
  {
    label: 'countries:countryManagement.form.isAppCountry.options.y',
    value: true,
  },
  {
    label: 'countries:countryManagement.form.isAppCountry.options.n',
    value: false,
  },
]

const countryStatus = [
  CountryStatusEnum.Active,
  CountryStatusEnum.Deleted,
  CountryStatusEnum.Disabled,
]

type CountryDialogProps = {
  onAdd: (country: Partial<ICountry>) => void
  onClose: () => void
  onUpdate: (country: Partial<ICountry>) => void
  open: boolean
  processing: boolean
  country?: ICountry
}

const CountryDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  country,
}: CountryDialogProps): JSX.Element => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const [errorMessage, setErrorMessage] = useState('')

  const editMode = Boolean(country && country.id)

  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values)

    const addCountryParams = {
      status: values.status,
      code: values.code,
      isAppCountry: values.isAppCountry,
      name: values.name,
    }
    if (country && country.id) {
      onUpdate({ ...addCountryParams, id: country.id })
    } else {
      onAdd({ ...addCountryParams, name: values.name })
    }
  }

  const formik = useFormik({
    initialValues: {
      status: country?.status ?? CountryStatusEnum.Active,
      code: country?.code ?? '',
      isAppCountry: country?.isAppCountry ?? true,
      name: country?.name ?? '',
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .max(20, t('common.validations.max', { size: 20 }))
        .required(t('common.validations.required')),
      name: Yup.string()
        .max(30, t('common.validations.max', { size: 30 }))
        .required(t('common.validations.required')),
    }),
    onSubmit: handleSubmit,
  })
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
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="country-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="country-dialog-title">
          {editMode
            ? t('countries:countryManagement.modal.edit.title')
            : t('countries:countryManagement.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('countries:countryManagement.form.name.label')}
            name="name"
            autoComplete="family-name"
            disabled={processing}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label={t('countries:countryManagement.form.code.label')}
            name="code"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />

          <TextField
            margin="normal"
            required
            id="status"
            disabled={processing}
            fullWidth
            select
            label={t('users:userManagement.form.status.label')}
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
          >
            {countryStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">
              {t('countries:countryManagement.form.isAppCountry.label')}
            </FormLabel>
            <RadioGroup
              row
              aria-label="isAppCountry"
              name="isAppCountry"
              value={formik.values.isAppCountry}
              onChange={formik.handleChange}
            >
              {isAppCountryOptions.map((isAppCountryOption: any) => (
                <FormControlLabel
                  key={isAppCountryOption.value}
                  disabled={processing}
                  value={isAppCountryOption.value}
                  control={<Radio />}
                  label={t(isAppCountryOption.label)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t('countries:countryManagement.modal.edit.action')
              : t('countries:countryManagement.modal.add.action')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CountryDialog

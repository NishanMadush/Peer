import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import {
  ILanguage,
  LanguageDirectionEnum,
} from '../interfacesAndTypes/language'

const languageDirection = [
  {
    label: 'languages:languageManagement.form.direction.options.ltor',
    value: LanguageDirectionEnum.ltor,
  },
  {
    label: 'languages:languageManagement.form.direction.options.rtol',
    value: LanguageDirectionEnum.rtol,
  },
]

type LanguageDialogProps = {
  onAdd: (language: Partial<ILanguage>) => void
  onClose: () => void
  onUpdate: (language: Partial<ILanguage>) => void
  open: boolean
  processing: boolean
  language?: ILanguage
}

const LanguageDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  language,
}: LanguageDialogProps): JSX.Element => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const [errorMessage, setErrorMessage] = useState('')

  const editMode = Boolean(language && language.id)

  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values)

    const addLanguageParams = {
      code: values.code,
      direction: values.direction ?? undefined,
      name: values.name,
      recaptchaLanguageCode: values.recaptchaLanguageCode,
      description: values.description,
    }
    if (language && language.id) {
      onUpdate({ ...addLanguageParams, id: language.id })
    } else {
      onAdd({ ...addLanguageParams, name: values.name })
    }
  }

  // console.log('~!@# language ---> ', language)

  const formik = useFormik({
    initialValues: {
      code: language ? language.code : '',
      direction: language ? language.direction : undefined,
      name: language ? language.name : '',
      recaptchaLanguageCode: language ? language.recaptchaLanguageCode : '',
      description: language ? language.description : '',
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .max(20, t('common.validations.max', { size: 20 }))
        .required(t('common.validations.required')),
      name: Yup.string()
        .max(30, t('common.validations.max', { size: 30 }))
        .required(t('common.validations.required')),
      description: Yup.string().required(t('common.validations.required')),
      direction: Yup.string().required(t('common.validations.required')),
      recaptchaLanguageCode: Yup.string().required(
        t('common.validations.required')
      ),
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
      aria-labelledby="language-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="language-dialog-title">
          {editMode
            ? t('languages:languageManagement.modal.edit.title')
            : t('languages:languageManagement.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label={t('languages:languageManagement.form.code.label')}
            name="code"
            autoComplete="family-name"
            autoFocus
            disabled={processing}
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('languages:languageManagement.form.name.label')}
            name="name"
            autoComplete="given-name"
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
            id="description"
            label={t('languages:languageManagement.form.description.label')}
            name="description"
            autoComplete="given-name"
            multiline
            minRows={4}
            disabled={processing}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            select
            id="direction"
            label={t('languages:languageManagement.form.direction.label')}
            name="direction"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.direction}
            onChange={formik.handleChange}
            error={formik.touched.direction && Boolean(formik.errors.direction)}
            helperText={formik.touched.direction && formik.errors.direction}
          >
            {languageDirection.map((direction) => (
              <MenuItem key={direction.value} value={direction.value}>
                {t(direction.label)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            required
            fullWidth
            id="recaptchaLanguageCode"
            label={t(
              'languages:languageManagement.form.recaptchaLanguageCode.label'
            )}
            name="recaptchaLanguageCode"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.recaptchaLanguageCode}
            onChange={formik.handleChange}
            error={
              formik.touched.recaptchaLanguageCode &&
              Boolean(formik.errors.recaptchaLanguageCode)
            }
            helperText={
              formik.touched.recaptchaLanguageCode &&
              formik.errors.recaptchaLanguageCode
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t('languages:languageManagement.modal.edit.action')
              : t('languages:languageManagement.modal.add.action')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default LanguageDialog

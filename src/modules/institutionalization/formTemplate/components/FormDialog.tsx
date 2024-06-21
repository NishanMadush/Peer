import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import {
  FormStatusEnum,
  IInstitutionalizationForm,
} from '../interfacesAndTypes/forms'

const formStatus = [
  FormStatusEnum.Active,
  FormStatusEnum.Inactive,
  FormStatusEnum.Deleted,
]

type FormDialogProps = {
  onAdd: (forms: Partial<IInstitutionalizationForm>) => void
  onClose: () => void
  onUpdate: (forms: Partial<IInstitutionalizationForm>) => void
  open: boolean
  processing: boolean
  forms?: IInstitutionalizationForm
}

const FormDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  forms,
}: FormDialogProps): JSX.Element => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const [errorMessage, setErrorMessage] = useState('')

  const editMode = Boolean(forms && forms.id)

  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values)

    const addFormParams = {
      status: values.status,
      version: values.version,
      title: values.title,
      date: values.date,
    }
    if (forms && forms.id) {
      const { version, ...paramsWithoutVersion } = addFormParams
      onUpdate({ ...paramsWithoutVersion, id: forms.id })
    } else {
      onAdd({ ...addFormParams, version: values.version })
    }
  }

  const formik = useFormik({
    initialValues: {
      status: forms?.status ?? FormStatusEnum.Active,
      version: forms?.version ?? '',
      title: forms?.title ?? '',
      date: forms?.date ? new Date(forms.date) : '',
    },
    validationSchema: Yup.object({
      version: Yup.string()
        .max(20, t('common.validations.max', { size: 20 }))
        .required(
          t(
            'institutionalization:formManagement.formDialog.form.version.required'
          )
        ),
      title: Yup.string()
        .max(20, t('common.validations.max', { size: 20 }))
        .required(
          t(
            'institutionalization:formManagement.formDialog.form.title.required'
          )
        ),
      date: Yup.string().required(
        t('institutionalization:formManagement.formDialog.form.date.required')
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
      aria-labelledby="country-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="country-dialog-title">
          {editMode
            ? t('institutionalization:formManagement.modal.edit.title')
            : t('institutionalization:formManagement.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            autoFocus
            id="version"
            name="version"
            label={t(
              'institutionalization:formManagement.formDialog.form.version.label'
            )}
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.version}
            onChange={formik.handleChange}
            error={formik.touched.version && Boolean(formik.errors.version)}
            helperText={formik.touched.version && formik.errors.version}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            name="title"
            label={t(
              'institutionalization:formManagement.formDialog.form.title.label'
            )}
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          {/* <TextField
            margin="normal"
            required
            fullWidth
            id="date"
            name="date"
            label={t(
              'institutionalization:formManagement.formDialog.form.date.label'
            )}
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.date}
            onChange={formik.handleChange}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          /> */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t(
                'institutionalization:formManagement.formDialog.form.date.label'
              )}
              disabled={processing}
              value={formik.values.date}
              onChange={(date) => formik.setFieldValue('date', date)}
              sx={{ mt: 2, mb: 1 }}
            />
          </LocalizationProvider>

          <TextField
            margin="normal"
            required
            id="status"
            name="status"
            disabled={processing}
            fullWidth
            select
            label={t(
              'institutionalization:formManagement.formDialog.form.status.label'
            )}
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
          >
            {formStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t('institutionalization:formManagement.formDialog.actions.edit')
              : t('institutionalization:formManagement.formDialog.actions.add')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormDialog

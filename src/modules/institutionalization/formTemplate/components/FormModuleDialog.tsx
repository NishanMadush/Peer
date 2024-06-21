import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import * as lodash from 'lodash'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import {
  FormStatusEnum,
  IInstitutionalizationModule,
} from '../interfacesAndTypes/forms'

const formStatus = [
  FormStatusEnum.Active,
  FormStatusEnum.Inactive,
  FormStatusEnum.Deleted,
]

type FormModuleDialogProps = {
  // eslint-disable-next-line no-unused-vars
  onAddModule: (formModule: IInstitutionalizationModule) => void
  onCloseModule: () => void
  // eslint-disable-next-line no-unused-vars
  onUpdateModule: (formModule: IInstitutionalizationModule) => void
  open: boolean
  processing: boolean
  formModule?: Partial<IInstitutionalizationModule>
}

const FormModuleDialog = ({
  onAddModule,
  onCloseModule,
  onUpdateModule,
  open,
  processing,
  formModule,
}: FormModuleDialogProps): JSX.Element => {
  const { t } = useTranslation()

  const editMode = Boolean(formModule && formModule._id)

  // const handleSubmit = (values: any) => {
  //   if (formModule && formModule._id) {
  //     onUpdateModule({
  //       ...values,
  //       _id: formModule._id,
  //     } as IInstitutionalizationModule)
  //   } else {
  //     onAddModule(values)
  //   }
  // }

  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values)

    const addFormModuleParams = {
      _id: values._id,
      instruction: values.instruction,
      moduleNo: values.moduleNo,
      condition: values.condition,
      status: values.status,
      indicators: values.indicators,
      moduleScore: values.moduleScore,
      moduleClassification: values.moduleClassification,
      comments: values.comments,
    }
    if (formModule && !lodash.isEmpty(formModule._id)) {
      onUpdateModule(addFormModuleParams)
    } else {
      onAddModule(addFormModuleParams)
    }
  }

  const formik = useFormik({
    initialValues: {
      _id: formModule?._id ?? undefined,
      instruction: formModule?.instruction ?? '',
      moduleNo: formModule?.moduleNo ?? '',
      condition: formModule?.condition ?? '',
      indicators: formModule?.indicators ?? [],
      moduleScore: formModule?.moduleScore ?? 0,
      moduleClassification: formModule?.moduleClassification ?? '',
      comments: formModule?.comments ?? [],
    },
    validationSchema: Yup.object({
      moduleNo: Yup.string()
        .max(2000, t('common.validations.max', { size: 2000 }))
        .required(
          t(
            'institutionalization:formManagement.formModuleDialog.form.moduleNo.required'
          )
        ),
      condition: Yup.string()
        .max(2000, t('common.validations.max', { size: 2000 }))
        .required(
          t(
            'institutionalization:formManagement.formModuleDialog.form.condition.required'
          )
        ),
    }),
    onSubmit: handleSubmit,
  })

  return (
    <Dialog
      open={open}
      onClose={onCloseModule}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="form-dialog-title">
          {editMode
            ? t(
                'institutionalization:formManagement.formModuleDialog.dialogTitle.edit'
              )
            : t(
                'institutionalization:formManagement.formModuleDialog.dialogTitle.add'
              )}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            id="instruction"
            name="instruction"
            // autoComplete="given-name"
            label={t(
              'institutionalization:formManagement.formModuleDialog.form.instruction.label'
            )}
            multiline
            minRows={2}
            disabled={processing}
            value={formik.values.instruction}
            onChange={formik.handleChange}
            error={
              formik.touched.instruction && Boolean(formik.errors.instruction)
            }
            helperText={formik.touched.instruction && formik.errors.instruction}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="moduleNo"
            name="moduleNo"
            // autoComplete="family-name"
            label={t(
              'institutionalization:formManagement.formModuleDialog.form.moduleNo.label'
            )}
            autoFocus
            disabled={processing}
            value={formik.values.moduleNo}
            onChange={formik.handleChange}
            error={formik.touched.moduleNo && Boolean(formik.errors.moduleNo)}
            helperText={formik.touched.moduleNo && formik.errors.moduleNo}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="condition"
            name="condition"
            // autoComplete="given-name"
            label={t(
              'institutionalization:formManagement.formModuleDialog.form.condition.label'
            )}
            multiline
            minRows={4}
            disabled={processing}
            value={formik.values.condition}
            onChange={formik.handleChange}
            error={formik.touched.condition && Boolean(formik.errors.condition)}
            helperText={formik.touched.condition && formik.errors.condition}
          />

          {/* <TextField
            margin="normal"
            required
            id="status"
            disabled={processing}
            fullWidth
            select
            label={t(
              'institutionalization:formManagement.formModuleDialog.form.status.label'
            )}
            name="status"
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
          </TextField> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModule}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t(
                  'institutionalization:formManagement.formModuleDialog.actions.edit'
                )
              : t(
                  'institutionalization:formManagement.formModuleDialog.actions.add'
                )}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormModuleDialog

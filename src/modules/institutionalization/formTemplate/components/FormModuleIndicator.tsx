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
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import {
  IInstitutionalizationForm,
  IInstitutionalizationIndicator,
} from '../interfacesAndTypes/forms'

type FormModuleIndicatorProps = {
  onAddIndicator: (formIndicator: IInstitutionalizationIndicator) => void
  onCloseIndicator: () => void
  onUpdateIndicator: (indicator: IInstitutionalizationIndicator) => void
  open: boolean
  processing: boolean
  indicator?: Partial<IInstitutionalizationIndicator>
}

const FormModuleIndicator = ({
  onAddIndicator,
  onCloseIndicator,
  onUpdateIndicator,
  open,
  processing,
  indicator,
}: FormModuleIndicatorProps): JSX.Element => {
  const { t } = useTranslation()

  const editMode = Boolean(indicator && indicator._id)

  // const handleSubmit = (values: any) => {
  //   if (indicator && indicator._id) {
  //     onUpdateIndicator({
  //       ...values,
  //       id: indicator._id,
  //     } as IInstitutionalizationIndicator)
  //   } else {
  //     onAddIndicator(values)
  //   }
  // }

  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values)

    const addIndicatorParams = {
      _id: values._id,
      version: values.version,
      date: values.date,
      instruction: values.instruction,
      indicatorNo: values.indicatorNo,
      question: values.question,
      description: values.description,
      subQuestions: values.subQuestions,
      weight: values.weight,
      scale: values.scale,
      indicatorScore: values.indicatorScore,
      comments: values.comments,
    }
    if (indicator && indicator._id) {
      onUpdateIndicator({ ...addIndicatorParams, _id: indicator._id })
    } else {
      onAddIndicator({
        ...addIndicatorParams,
        indicatorNo: values.indicatorNo,
      })
    }
  }

  // console.log('~!@# language ---> ', indicator)

  const formik = useFormik({
    initialValues: {
      _id: indicator?._id ?? undefined,
      instruction: indicator ? indicator.instruction : '',
      indicatorNo: indicator ? indicator.indicatorNo : '',
      question: indicator ? indicator.question : '',
      description: indicator ? indicator.description : '',
      subQuestions: indicator ? indicator.subQuestions : [],
      weight: indicator ? indicator.weight : 0,
      scale: indicator ? indicator.scale : 0,
      indicatorScore: indicator ? indicator.indicatorScore : 0,
      comments: indicator ? indicator.comments : [],
    },
    validationSchema: Yup.object({
      question: Yup.string().required(
        t(
          'institutionalization:formManagement.formModuleIndicator.form.question.required'
        )
      ),
      indicatorNo: Yup.string().required(
        t(
          'institutionalization:formManagement.formModuleIndicator.form.indicatorNo.required'
        )
      ),
    }),
    onSubmit: handleSubmit,
  })

  return (
    <Dialog
      open={open}
      onClose={onCloseIndicator}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="form-dialog-title">
          {editMode
            ? t(
                'institutionalization:formManagement.formModuleIndicator.dialogTitle.edit'
              )
            : t(
                'institutionalization:formManagement.formModuleIndicator.dialogTitle.add'
              )}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            id="instruction"
            label={t(
              'institutionalization:formManagement.formModuleIndicator.form.instruction.label'
            )}
            name="instruction"
            autoComplete="given-name"
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
            id="indicatorNo"
            label={t(
              'institutionalization:formManagement.formModuleIndicator.form.indicatorNo.label'
            )}
            name="indicatorNo"
            autoComplete="family-name"
            autoFocus
            disabled={processing}
            value={formik.values.indicatorNo}
            onChange={formik.handleChange}
            error={
              formik.touched.indicatorNo && Boolean(formik.errors.indicatorNo)
            }
            helperText={formik.touched.indicatorNo && formik.errors.indicatorNo}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="question"
            label={t(
              'institutionalization:formManagement.formModuleIndicator.form.question.label'
            )}
            name="question"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.question}
            onChange={formik.handleChange}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.touched.question && formik.errors.question}
          />

          <TextField
            margin="normal"
            fullWidth
            id="description"
            label={t(
              'institutionalization:formManagement.formModuleIndicator.form.description.label'
            )}
            name="description"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseIndicator}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t(
                  'institutionalization:formManagement.formModuleIndicator.actions.edit'
                )
              : t(
                  'institutionalization:formManagement.formModuleIndicator.actions.add'
                )}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormModuleIndicator

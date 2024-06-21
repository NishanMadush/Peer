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
import lodash from 'lodash'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { IInstitutionalizationIndicatorSubQuestion } from '../interfacesAndTypes/forms'

type FormModuleSubQuestionProps = {
  // eslint-disable-next-line no-unused-vars
  onAdd: (subQuestion: IInstitutionalizationIndicatorSubQuestion) => void
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onUpdate: (subQuestion: IInstitutionalizationIndicatorSubQuestion) => void
  open: boolean
  processing: boolean
  subQuestion?: Partial<IInstitutionalizationIndicatorSubQuestion>
}

const FormModuleSubQuestion = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  subQuestion,
}: FormModuleSubQuestionProps): JSX.Element => {
  const { t } = useTranslation()

  const editMode = Boolean(subQuestion && subQuestion._id)

  // const handleSubmit = (values: any) => {
  //   if (subQuestion && subQuestion._id) {
  //     onUpdate({
  //       ...values,
  //       id: subQuestion._id,
  //     } as IInstitutionalizationIndicatorSubQuestion)
  //   } else {
  //     onAdd(values)
  //   }
  // }
  const handleSubmit = (values: any) => {
    console.log('~!@# values: ', values)

    const addFormSubQuestionParams = {
      _id: values._id,
      subQuestion: values.subQuestion,
      subAnswer: values.subAnswer,
    }
    if (subQuestion && !lodash.isEmpty(subQuestion._id)) {
      onUpdate(addFormSubQuestionParams)
    } else {
      onAdd(addFormSubQuestionParams)
    }
  }

  const formik = useFormik({
    initialValues: {
      _id: subQuestion?._id ?? undefined,
      subQuestion: subQuestion ? subQuestion.subQuestion : undefined,
      subAnswer: subQuestion ? subQuestion.subAnswer : undefined,
    },
    validationSchema: Yup.object({
      subQuestion: Yup.string()
        .max(20, t('common.validations.max', { size: 10 }))
        .required(
          t(
            'institutionalization:formManagement.formModuleSubQuestion.form.subQuestion.required'
          )
        ),
      subAnswer: Yup.string()
        .max(20, t('common.validations.max', { size: 20 }))
        .required(
          t(
            'institutionalization:formManagement.formModuleSubQuestion.form.subAnswer.required'
          )
        ),
    }),
    onSubmit: handleSubmit,
  })

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="form-dialog-title">
          {editMode
            ? t(
                'institutionalization:formManagement.formModuleSubQuestion.dialogTitle.edit'
              )
            : t(
                'institutionalization:formManagement.formModuleSubQuestion.dialogTitle.add'
              )}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="subQuestion"
            label={t(
              'institutionalization:formManagement.formModuleSubQuestion.form.subQuestion.label'
            )}
            name="subQuestion"
            autoComplete="given-name"
            autoFocus
            multiline
            minRows={2}
            disabled={processing}
            value={formik.values.subQuestion}
            onChange={formik.handleChange}
            error={
              formik.touched.subQuestion && Boolean(formik.errors.subQuestion)
            }
            helperText={formik.touched.subQuestion && formik.errors.subQuestion}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="subAnswer"
            label={t(
              'institutionalization:formManagement.formModuleSubQuestion.form.subAnswer.label'
            )}
            name="subAnswer"
            autoComplete="family-name"
            disabled={processing}
            value={formik.values.subAnswer}
            onChange={formik.handleChange}
            error={formik.touched.subAnswer && Boolean(formik.errors.subAnswer)}
            helperText={formik.touched.subAnswer && formik.errors.subAnswer}
            style={{ opacity: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t(
                  'institutionalization:formManagement.formModuleSubQuestion.actions.edit'
                )
              : t(
                  'institutionalization:formManagement.formModuleSubQuestion.actions.add'
                )}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormModuleSubQuestion

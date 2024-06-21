import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Fab } from '@mui/material'
import lodash from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../../core/components/ConfirmDialog'
import SelectToolbar from '../../../../core/components/SelectToolbar'
import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import { useAuth } from '../../../auth/contexts/AuthProvider'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import {
  accessType,
  authorization,
} from '../../../baseUser/config/authorization'
import FormDialog from '../components/FormDialog'
import FormModuleDialog from '../components/FormModuleDialog'
import FormModuleIndicator from '../components/FormModuleIndicator'
import FormModuleSubQuestion from '../components/FormModuleSubQuestion'
import FormModuleTable from '../components/FormModuleTable'
import FormTable from '../components/FormTable'
import { useAddForm } from '../hooks/useAddForm'
import { useDeleteForms } from '../hooks/useDeleteForms'
import { useForms } from '../hooks/useForms'
import { useUpdateForm } from '../hooks/useUpdateForm'
import {
  IInstitutionalizationForm,
  IInstitutionalizationIndicator,
  IInstitutionalizationIndicatorSubQuestion,
  IInstitutionalizationModule,
} from '../interfacesAndTypes/forms'

const pathPage = 'institutionalization.formTemplate.pages.FormManagement'

const InstitutionalizationFormManagement = (): JSX.Element => {
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const { t } = useTranslation()

  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [openModuleDialog, setOpenModuleDialog] = useState(false)
  const [openIndicatorDialog, setOpenIndicatorDialog] = useState<boolean>(false)
  const [openSubQuestionDialog, setOpenSubQuestionDialog] =
    useState<boolean>(false)

  const [detailForm, setDetailForm] = useState<
    IInstitutionalizationForm | undefined
  >(undefined)
  const [detailModule, setDetailModule] = useState<
    Partial<IInstitutionalizationModule> | undefined
  >(undefined)
  const [detailIndicator, setDetailIndicator] = useState<
    Partial<IInstitutionalizationIndicator> | undefined
  >(undefined)
  const [detailSubQuestion, setDetailSubQuestion] = useState<
    Partial<IInstitutionalizationIndicatorSubQuestion> | undefined
  >(undefined)

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
  const [openConfirmDeleteModuleDialog, setOpenConfirmDeleteModuleDialog] =
    useState(false)
  const [
    openConfirmDeleteIndicatorDialog,
    setOpenConfirmDeleteIndicatorDialog,
  ] = useState(false)
  const [
    openConfirmDeleteSubQuestionDialog,
    setOpenConfirmDeleteSubQuestionDialog,
  ] = useState(false)

  const [formsDeleted, setFormsDeleted] = useState<string[]>([])

  const [formsSelected, setFormsSelected] = useState<string[]>([])
  const [moduleSelected, setModuleSelected] = useState<string>('')
  const [indicatorSelected, setIndicatorSelected] = useState<string>('')
  const [subQuestionSelected, setSubQuestionSelected] = useState<string>('')

  const [formUpdated, setFormUpdated] = useState<
    IInstitutionalizationForm | undefined
  >(undefined)

  const { data: templateForms } = useForms()
  const { addForm, isAdding } = useAddForm()
  const { deleteForms, isDeleting } = useDeleteForms()
  const { updateForm, isUpdating } = useUpdateForm()

  const processing = isAdding || isDeleting || isUpdating

  //#region Form

  const handleAddForm = async (forms: Partial<IInstitutionalizationForm>) => {
    addForm(forms as IInstitutionalizationForm)
      .then(() => {
        snackbar.success(
          t('institutionalization:formManagement.notifications.addSuccess', {
            forms: `${forms.version}`,
          })
        )
        setOpenFormDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleDeleteForms = async () => {
    deleteForms(formsDeleted)
      .then(() => {
        snackbar.success(
          t('institutionalization:formManagement.notifications.deleteSuccess')
        )
        setFormsSelected([])
        setFormsDeleted([])
        setOpenConfirmDeleteDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateForm = async (
    forms: Partial<IInstitutionalizationForm>
  ) => {
    updateForm(forms)
      .then(() => {
        snackbar.success(
          t('institutionalization:formManagement.notifications.updateSuccess', {
            forms: `${forms.version}`,
          })
        )
        setOpenFormDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleCancelSelected = () => {
    setFormsSelected([])
  }

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false)
  }

  const handleCloseFormDialog = () => {
    setFormUpdated(undefined)
    setOpenFormDialog(false)
  }

  const handleOpenConfirmDeleteDialog = (templateIds: string[]) => {
    setFormsDeleted(templateIds)
    setOpenConfirmDeleteDialog(true)
  }

  const handleDetailForm = (form?: IInstitutionalizationForm) => {
    // setOpenTemplateGroup(true)
    setDetailForm(form)
  }

  const handleSelectedChange = (newSelected: string[]) => {
    setFormsSelected(newSelected)
  }

  const handleOpenFormDialog = (forms?: IInstitutionalizationForm) => {
    setFormUpdated(forms)
    setOpenFormDialog(true)
  }

  //#endregion From

  //#region Form-module
  const handleAddModuleDialog = (formModule: IInstitutionalizationModule) => {
    // Update the form with module details

    if (!(detailForm && detailForm.id)) {
      snackbar.error(t('common.errors.unexpected.subTitle'))
      return
    }

    const currentForm = detailForm as Partial<IInstitutionalizationForm>

    currentForm['modules'] = currentForm?.modules
      ? [...detailForm.modules, formModule]
      : [formModule]

    delete currentForm['version']

    updateForm(currentForm)
      .then((resultForm: IInstitutionalizationForm) => {
        snackbar.success(
          t(
            'institutionalization:formManagement.formModuleDialog.notifications.addSuccess',
            {
              form: `${resultForm.version}`,
            }
          )
        )
        setDetailForm(resultForm)
        setOpenModuleDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleConfirmDeleteModule = () => {
    // Update the organization with branch details

    if (!(detailForm && detailForm.id)) {
      snackbar.error(t('From details are unavailable'))
      return
    }

    const currentForm = detailForm as IInstitutionalizationForm
    console.log('currentForm.modules 1: ', currentForm.modules)
    console.log('moduleSelected: ', moduleSelected)
    // Remove the module with matching _id
    const updatedModules = currentForm.modules.filter(
      (module) => module._id !== moduleSelected
    )
    currentForm.modules = updatedModules
    console.log('updatedModules: ', updatedModules)

    // Omit the version before updating
    const { version, ...formToUpdate } = currentForm

    updateForm(formToUpdate)
      .then((resultForm: IInstitutionalizationForm) => {
        snackbar.success(
          t(
            'institutionalization:formManagement.formModuleDialog.notifications.deleteSuccess',
            {
              form: `${resultForm.title}`,
            }
          )
        )
        setDetailForm(resultForm)
        setFormsSelected([])
        setModuleSelected('')
        setOpenConfirmDeleteDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
      .finally(() => {
        setOpenConfirmDeleteModuleDialog(false)
      })
  }

  const handleUpdateModuleDialog = (
    formModule: IInstitutionalizationModule
  ) => {
    // Update the form with module details

    if (!(detailForm && detailForm.id)) {
      snackbar.error(t('From details are unavailable'))
      return
    }

    const currentForm = detailForm as Partial<IInstitutionalizationForm>

    const itemIndex = lodash.findIndex(currentForm.modules, {
      _id: formModule._id,
    })

    if (itemIndex > -1 && currentForm?.modules) {
      currentForm.modules[itemIndex] = formModule
    }
    delete currentForm['version']

    updateForm(currentForm)
      .then((resultForm: IInstitutionalizationModule) => {
        snackbar.success(
          t(
            'institutionalization:formManagement.formModuleDialog.notifications.updateSuccess',
            {
              form: `${resultForm.condition}`,
            }
          )
        )
        setDetailModule(resultForm)
        setOpenModuleDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }
  const handleEditModule = (formModule?: IInstitutionalizationModule) => {
    setDetailModule(formModule)
    handleOpenFormModuleDialog()
  }
  const handleCloseModuleDialog = () => {
    setDetailModule(undefined)
    setOpenModuleDialog(false)
  }
  const handleDeleteModule = (moduleId: string) => {
    setModuleSelected(moduleId)
    setOpenConfirmDeleteModuleDialog(true)
  }
  const handleOpenFormModuleDialog = () => {
    setOpenModuleDialog(true)
  }

  const handleCloseConfirmDeleteModuleDialog = () => {
    setOpenConfirmDeleteModuleDialog(false)
  }

  //#endregion From-module

  //#region Form-module-indicator

  const handleAddIndicatorDialog = async (
    formIndicator: IInstitutionalizationIndicator
  ) => {
    try {
      if (!detailModule?._id) {
        snackbar.error(t('Module details are unavailable'))
      }

      const currentForm: Partial<IInstitutionalizationForm> = {
        ...detailForm,
      }

      if (currentForm.modules) {
        currentForm.modules = currentForm.modules.map((module) => {
          if (module._id === detailModule?._id) {
            return {
              ...module,
              indicators: [...module.indicators, formIndicator],
            }
          }
          return module
        })
      }

      delete currentForm.version

      updateForm(currentForm).then((resultForm: IInstitutionalizationForm) => {
        snackbar.success(
          t(
            'institutionalization:formManagement.formModuleIndicator.notifications.addSuccess',
            {
              form: `${resultForm.version}`,
            }
          )
        )
        setDetailForm(resultForm)
        setDetailModule(undefined)
        setOpenIndicatorDialog(false)
      })
    } catch (err: any) {
      snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
    }
  }

  const handleUpdateIndicatorDialog = (
    formIndicator: IInstitutionalizationIndicator
  ) => {
    // Update the form with module details

    if (!(detailForm && detailForm.id)) {
      snackbar.error(t('From details are unavailable'))
      return
    } else if (!(moduleSelected && Number.parseInt(moduleSelected) >= 0)) {
      snackbar.error(t('Module details are unavailable'))
      return
    }

    const currentForm = detailForm as Partial<IInstitutionalizationForm>
    const moduleIndex = Number.parseInt(moduleSelected)

    if (!currentForm?.modules) {
      snackbar.error(t('Module details are unavailable'))
      return
    }

    const itemIndex = lodash.findIndex(
      detailForm?.modules[moduleIndex]?.indicators,
      { _id: formIndicator?._id }
    )
    if (itemIndex === -1) {
      snackbar.error(t('Indicator details are unavailable'))
      return
    }

    currentForm.modules[moduleIndex].indicators[itemIndex] = formIndicator

    delete currentForm['version']

    updateForm(currentForm)
      .then((resultForm: IInstitutionalizationForm) => {
        snackbar.success(
          t(
            'institutionalization:formManagement.formModuleIndicator.notifications.updateSuccess',
            {
              form: `${resultForm.title}`,
            }
          )
        )
        setDetailForm(resultForm)
        setModuleSelected('')
        setDetailIndicator(undefined)
        setOpenIndicatorDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
        // TODO: discard changes
      })
  }

  const handleCloseIndicatorDialog = () => {
    setModuleSelected('')
    setDetailIndicator(undefined)
    setOpenIndicatorDialog(false)
  }

  const handleEditIndicator = (
    moduleIndex: number,
    formIndicator: IInstitutionalizationIndicator
  ) => {
    setModuleSelected(`${moduleIndex}`)
    setDetailIndicator(formIndicator)
    setOpenIndicatorDialog(true)
  }

  const handleConfirmDeleteIndicator = () => {
    if (!(detailForm && detailForm.id)) {
      snackbar.error(t('From details are unavailable'))
      return
    } else if (!(moduleSelected && Number.parseInt(moduleSelected) >= 0)) {
      snackbar.error(t('Module details are unavailable'))
      return
    }

    const currentForm = { ...detailForm } // Create a copy to avoid modifying the original object
    const moduleIndex = Number.parseInt(moduleSelected)

    // Ensure indicatorSelected is a string
    const indicatorDeletedString =
      typeof indicatorSelected === 'string' ? indicatorSelected : ''

    const indicatorIndex = lodash.findIndex(
      currentForm.modules[moduleIndex].indicators,
      { _id: indicatorDeletedString }
    )

    if (indicatorIndex === -1) {
      snackbar.error(t('Indicator details are unavailable'))
      return
    }

    // Remove the indicator
    currentForm.modules[moduleIndex].indicators.splice(indicatorIndex, 1)

    // Omit the version before updating
    const { version, ...formToUpdate } = currentForm

    updateForm(formToUpdate)
      .then((resultForm: IInstitutionalizationForm) => {
        snackbar.success(
          t(
            'institutionalization:formManagement.formModuleIndicator.notifications.deleteSuccess',
            {
              form: `${resultForm.title}`,
            }
          )
        )
        setDetailForm(resultForm)
        setModuleSelected('')
        setIndicatorSelected('')
        setOpenConfirmDeleteIndicatorDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleCloseDeleteIndicatorDialog = () => {
    setModuleSelected('')
    setIndicatorSelected('')
    setOpenConfirmDeleteIndicatorDialog(false)
  }

  const handleDeleteIndicator = (moduleIndex: number, indicatorId: string) => {
    setModuleSelected(`${moduleIndex}`)
    setIndicatorSelected(indicatorId)
    setOpenConfirmDeleteIndicatorDialog(true)
  }

  const handleAddIndicator = (
    formModule?: Partial<IInstitutionalizationModule>
  ) => {
    setDetailModule(formModule)
    setOpenIndicatorDialog(true)
  }

  //#endregion From-module-indicator

  //#region Form-module-indicator-subQuestion

  const handleAddSubQuestionDialog = async (
    FormSubQuestion: IInstitutionalizationIndicatorSubQuestion
  ) => {
    try {
      if (!detailForm?.id) {
        return snackbar.error(t('From details are unavailable'))
      } else if (!(moduleSelected && Number.parseInt(moduleSelected) >= 0)) {
        return snackbar.error(t('Module details are unavailable'))
      } else if (
        !(indicatorSelected && Number.parseInt(indicatorSelected) >= 0)
      ) {
        return snackbar.error(t('Indicator details are unavailable'))
      }

      // Create a shallow copy of detailForm
      const currentForm: Partial<IInstitutionalizationForm> = { ...detailForm }
      const moduleIndex = Number.parseInt(moduleSelected)
      const indicatorIndex = Number.parseInt(indicatorSelected)

      // Check if modules and indicators exist and have length
      if (
        currentForm.modules?.length &&
        currentForm.modules[moduleIndex].indicators?.length
      ) {
        // Map the indicators and update the subQuestions for the matching indicator
        currentForm.modules[moduleIndex].indicators = currentForm.modules[
          moduleIndex
        ].indicators.map((indicator) => {
          if (
            indicator._id ===
            detailForm?.modules[moduleIndex].indicators[indicatorIndex]._id
          ) {
            return {
              ...indicator,
              subQuestions: [
                ...(indicator.subQuestions || []),
                FormSubQuestion,
              ],
            }
          }
          return indicator
        })
      }

      // Delete the version property
      delete currentForm.version

      // Check if currentForm is not undefined
      if (currentForm) {
        updateForm(currentForm).then(
          (resultForm: IInstitutionalizationForm) => {
            snackbar.success(
              t(
                'institutionalization:formManagement.formModuleSubQuestion.notifications.addSuccess',
                {
                  form: `${resultForm.version}`,
                }
              )
            )
            setDetailForm(resultForm)

            setOpenSubQuestionDialog(false)
          }
        )
      }
    } catch (err: any) {
      snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
    }
  }

  const handleDeleteSubQuestion = () => {
    if (!detailForm?.id) {
      return snackbar.error(t('From details are unavailable'))
    } else if (!(moduleSelected && Number.parseInt(moduleSelected) >= 0)) {
      return snackbar.error(t('Module details are unavailable'))
    } else if (
      !(indicatorSelected && Number.parseInt(indicatorSelected) >= 0)
    ) {
      return snackbar.error(t('Indicator details are unavailable'))
    }

    const currentForm = { ...detailForm } // Create a copy to avoid modifying the original object
    const moduleIndex = Number.parseInt(moduleSelected)
    const indicatorIndex = Number.parseInt(indicatorSelected)

    const subQuestionIndex = currentForm.modules[moduleIndex].indicators[
      indicatorIndex
    ].subQuestions.findIndex(
      (subQuestion) => subQuestion._id === subQuestionSelected
    )

    if (subQuestionIndex === -1) {
      return snackbar.error(t('Sub question details are unavailable'))
    }

    // Remove the indicator
    currentForm.modules[moduleIndex].indicators[
      indicatorIndex
    ].subQuestions.splice(subQuestionIndex, 1)

    // Omit the version before updating
    const { version, ...formToUpdate } = currentForm

    updateForm(formToUpdate)
      .then((resultForm: IInstitutionalizationForm) => {
        snackbar.success(
          t(
            'institutionalization:formManagement.formModuleSubQuestion.notifications.deleteSuccess',
            {
              form: `${resultForm.title}`,
            }
          )
        )
        setDetailForm(resultForm)
        setModuleSelected('')
        setIndicatorSelected('')
        setSubQuestionSelected('')
        setOpenConfirmDeleteSubQuestionDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateSubQuestion = (
    formSubQuestion: IInstitutionalizationIndicatorSubQuestion
  ) => {
    try {
      if (!detailForm?.id) {
        return snackbar.error(t('From details are unavailable'))
      } else if (!(moduleSelected && Number.parseInt(moduleSelected) >= 0)) {
        return snackbar.error(t('Module details are unavailable'))
      } else if (
        !(indicatorSelected && Number.parseInt(indicatorSelected) >= 0)
      ) {
        return snackbar.error(t('Indicator details are unavailable'))
      }

      // Create a shallow copy of detailForm
      const currentForm: Partial<IInstitutionalizationForm> = { ...detailForm }
      const moduleIndex = Number.parseInt(moduleSelected)
      const indicatorIndex = Number.parseInt(indicatorSelected)

      if (
        currentForm.modules?.length &&
        currentForm.modules[moduleIndex].indicators?.length
      ) {
        const subQuestionIndex = currentForm.modules[moduleIndex].indicators[
          indicatorIndex
        ].subQuestions.findIndex(
          (subQuestion) => subQuestion._id === formSubQuestion._id
        )

        if (subQuestionIndex === -1) {
          return snackbar.error(t('Sub question details are unavailable'))
        }

        currentForm.modules[moduleIndex].indicators[
          indicatorIndex
        ].subQuestions[subQuestionIndex] = formSubQuestion
      }

      delete currentForm.version

      updateForm(currentForm)
        .then((resultForm: IInstitutionalizationIndicatorSubQuestion) => {
          snackbar.success(
            t(
              'institutionalization:formManagement.formModuleSubQuestion.notifications.updateSuccess',
              {
                form: `${resultForm.subQuestion}`,
              }
            )
          )
          setDetailSubQuestion(resultForm)
          setModuleSelected('')
          setIndicatorSelected('')
          setDetailSubQuestion(undefined)
          setOpenSubQuestionDialog(false)
        })
        .catch((err: Error) => {
          snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
        })
    } catch (err: any) {
      snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
    }
  }

  const handleEditFormSubQuestion = (
    moduleIndex: number,
    indicatorIndex: number,
    subQuestion: IInstitutionalizationIndicatorSubQuestion
  ) => {
    setModuleSelected(`${moduleIndex}`)
    setIndicatorSelected(`${indicatorIndex}`)
    setDetailSubQuestion(subQuestion)
    setOpenSubQuestionDialog(true)
  }

  const handleCloseSubQuestion = () => {
    setDetailSubQuestion(undefined)
    setOpenSubQuestionDialog(false)
  }

  const handleDeleteFormSubQuestion = (
    moduleIndex: number,
    indicatorIndex: number,
    subQuestionId: string
  ) => {
    setModuleSelected(`${moduleIndex}`)
    setIndicatorSelected(`${indicatorIndex}`)
    setSubQuestionSelected(subQuestionId)
    setOpenConfirmDeleteSubQuestionDialog(true)
  }

  const handleAddSubQuestion = (
    moduleIndex: number,
    indicatorIndex: number
  ) => {
    setModuleSelected(`${moduleIndex}`)
    setIndicatorSelected(`${indicatorIndex}`)
    setOpenSubQuestionDialog(true)
  }
  //#endregion From-module-indicator-subQuestion

  return (
    <React.Fragment>
      <BaseAppBar>
        {formsSelected.length ? (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={formsSelected}
          />
        ) : (
          <BaseToolbar
            title={t('institutionalization:formManagement.toolbar.title')}
          >
            {detailForm ? (
              <>
                <Fab
                  aria-label="delete-institutionalization-forms"
                  color="secondary"
                  disabled={processing}
                  onClick={() => setDetailForm(undefined)}
                  size="small"
                  style={{ marginRight: 10 }}
                >
                  <ArrowBackIcon />
                </Fab>
                {authorization(
                  userInfo.role,
                  pathPage,
                  'button.add',
                  accessType.Enable
                ) && (
                  <Fab
                    aria-label="delete-institutionalization-forms"
                    color="primary"
                    disabled={processing}
                    onClick={() => handleOpenFormModuleDialog()}
                    size="small"
                  >
                    <AddIcon />
                  </Fab>
                )}
              </>
            ) : (
              <>
                {authorization(
                  userInfo.role,
                  pathPage,
                  'button.add',
                  accessType.Enable
                ) && (
                  <Fab
                    aria-label="manage-forms"
                    color="primary"
                    disabled={processing}
                    onClick={() => handleOpenFormDialog()}
                    size="small"
                  >
                    <AddIcon />
                  </Fab>
                )}
              </>
            )}
          </BaseToolbar>
        )}
      </BaseAppBar>
      {detailForm ? (
        <FormModuleTable
          processing={processing}
          form={detailForm}
          // modules
          // onAddModule use top-right add-button
          onEditModule={handleEditModule}
          onDeleteModule={handleDeleteModule}
          // indicators
          onAddIndicator={handleAddIndicator}
          onEditIndicator={handleEditIndicator}
          onDeleteIndicator={handleDeleteIndicator}
          // sub question
          onAddSubQuestion={handleAddSubQuestion}
          onEditSubQuestion={handleEditFormSubQuestion}
          onDeleteSubQuestion={handleDeleteFormSubQuestion}
          auth={userInfo}
        />
      ) : (
        <FormTable
          processing={processing}
          forms={templateForms}
          onDetailForm={handleDetailForm}
          onEditForm={handleOpenFormDialog}
          onDeleteForms={handleOpenConfirmDeleteDialog}
          onSelectedChange={handleSelectedChange}
          selected={formsSelected}
          auth={userInfo}
        />
      )}

      {openFormDialog && (
        <FormDialog
          onAdd={handleAddForm}
          onUpdate={handleUpdateForm}
          onClose={handleCloseFormDialog}
          open={openFormDialog}
          processing={processing}
          forms={formUpdated}
        />
      )}
      {openModuleDialog && (
        <FormModuleDialog
          onAddModule={handleAddModuleDialog}
          onUpdateModule={handleUpdateModuleDialog}
          onCloseModule={handleCloseModuleDialog}
          open={openModuleDialog}
          processing={processing}
          formModule={detailModule ?? {}}
        />
      )}
      {openIndicatorDialog && (
        <FormModuleIndicator
          onAddIndicator={handleAddIndicatorDialog}
          onUpdateIndicator={handleUpdateIndicatorDialog}
          onCloseIndicator={handleCloseIndicatorDialog}
          open={openIndicatorDialog}
          processing={processing}
          indicator={detailIndicator ?? {}}
        />
      )}
      {openSubQuestionDialog && (
        <FormModuleSubQuestion
          onAdd={handleAddSubQuestionDialog}
          onUpdate={handleUpdateSubQuestion}
          onClose={handleCloseSubQuestion}
          open={openSubQuestionDialog}
          processing={processing}
          subQuestion={detailSubQuestion ?? {}}
        />
      )}

      {openConfirmDeleteDialog && (
        <ConfirmDialog
          description={t(
            'institutionalization:formManagement.confirmations.delete'
          )}
          pending={processing}
          onClose={handleCloseConfirmDeleteDialog}
          onConfirm={handleDeleteForms}
          open={openConfirmDeleteDialog}
          title={t('common.confirmation')}
        />
      )}
      {openConfirmDeleteModuleDialog && (
        <ConfirmDialog
          description={t(
            'institutionalization:formManagement.formModuleDialog.confirmations.delete'
          )}
          pending={processing}
          onClose={handleCloseConfirmDeleteModuleDialog}
          onConfirm={handleConfirmDeleteModule}
          open={openConfirmDeleteModuleDialog}
          title={t('common.confirmation')}
        />
      )}
      {openConfirmDeleteIndicatorDialog && (
        <ConfirmDialog
          description={t(
            'institutionalization:formManagement.formModuleIndicator.confirmations.delete'
          )}
          pending={processing}
          onClose={handleCloseDeleteIndicatorDialog}
          onConfirm={handleConfirmDeleteIndicator}
          open={openConfirmDeleteIndicatorDialog}
          title={t('common.confirmation')}
        />
      )}
      {openConfirmDeleteSubQuestionDialog && (
        <ConfirmDialog
          description={t(
            'institutionalization:formManagement.formModuleSubQuestion.confirmations.delete'
          )}
          pending={processing}
          onClose={handleCloseConfirmDeleteDialog}
          onConfirm={handleDeleteSubQuestion}
          open={openConfirmDeleteSubQuestionDialog}
          title={t('common.confirmation')}
        />
      )}
    </React.Fragment>
  )
}

export default InstitutionalizationFormManagement

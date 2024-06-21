import AddIcon from '@mui/icons-material/Add'
import { Fab } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../core/components/ConfirmDialog'
import SelectToolbar from '../../../core/components/SelectToolbar'
import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { useAuth } from '../../auth/contexts/AuthProvider'
import BaseAppBar from '../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../baseUser/components/BaseToolbar'
import { accessType, authorization } from '../../baseUser/config/authorization'
import { DefaultUsers } from '../../baseUser/constants/helper'
import LanguageDialog from '../components/LanguageDialog'
import LanguageTable from '../components/LanguageTable'
import { useAddLanguage } from '../hooks/useAddLanguage'
import { useDeleteLanguages } from '../hooks/useDeleteLanguages'
import { useLanguages } from '../hooks/useLanguages'
import { useUpdateLanguage } from '../hooks/useUpdateLanguage'
import { ILanguage } from '../interfacesAndTypes/language'

const pathPage = 'languages.pages.LanguageManagement'

const LanguageManagement = (): JSX.Element => {
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const { t } = useTranslation()

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [languageDeleted, setLanguageDeleted] = useState<string[]>([])
  const [languageUpdated, setLanguageUpdated] = useState<ILanguage | undefined>(
    undefined
  )
  const isAdmin = userInfo?.role === DefaultUsers.SUPER_ADMINISTRATOR
  const { addLanguage, isAdding } = useAddLanguage()
  const { deleteLanguages, isDeleting } = useDeleteLanguages()
  const { isUpdating, updateLanguage } = useUpdateLanguage()
  const { data } = useLanguages()

  const processing = isAdding || isDeleting || isUpdating

  const handleAddLanguage = async (language: Partial<ILanguage>) => {
    addLanguage(language as ILanguage)
      .then(() => {
        snackbar.success(
          t('languages:languageManagement.notifications.addSuccess', {
            language: `${language.name} ${language.code}`,
          })
        )
        setOpenLanguageDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleDeleteLanguages = async () => {
    deleteLanguages(languageDeleted)
      .then(() => {
        snackbar.success(
          t('languages:languageManagement.notifications.deleteSuccess')
        )
        setSelected([])
        setLanguageDeleted([])
        setOpenConfirmDeleteDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateLanguage = async (language: Partial<ILanguage>) => {
    updateLanguage(language)
      .then(() => {
        snackbar.success(
          t('languages:languageManagement.notifications.updateSuccess', {
            language: `${language.name} ${language.code}`,
          })
        )
        setOpenLanguageDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleCancelSelected = () => {
    setSelected([])
  }

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false)
  }

  const handleCloseLanguageDialog = () => {
    setLanguageUpdated(undefined)
    setOpenLanguageDialog(false)
  }

  const handleOpenConfirmDeleteDialog = (languageIds: string[]) => {
    setLanguageDeleted(languageIds)
    setOpenConfirmDeleteDialog(true)
  }

  const handleOpenLanguageDialog = (language?: ILanguage) => {
    setLanguageUpdated(language)
    setOpenLanguageDialog(true)
  }

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected)
  }

  return (
    <React.Fragment>
      {/* <BaseAppBar>
        {!selected.length ? (
          <BaseToolbar title={t('languages:languageManagement.toolbar.title')}>
            <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenLanguageDialog()}
              size="small"
            >
              <AddIcon />
            </Fab>
          </BaseToolbar>
        ) : (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        )}
      </BaseAppBar> */}

      <BaseAppBar>
        {selected.length ? (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        ) : (
          <BaseToolbar title={t('languages:languageManagement.toolbar.title')}>
            {authorization(
              userInfo?.role,
              pathPage,
              'button.add',
              accessType.Enable
            ) && (
              <Fab
                aria-label="manage-languages"
                color="primary"
                disabled={processing}
                onClick={() => handleOpenLanguageDialog()}
                size="small"
              >
                <AddIcon />
              </Fab>
            )}
          </BaseToolbar>
        )}
      </BaseAppBar>
      <LanguageTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenLanguageDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        languages={data}
        auth={userInfo}
      />
      <ConfirmDialog
        description={t('languages:languageManagement.confirmations.delete')}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteLanguages}
        open={openConfirmDeleteDialog}
        title={t('common.confirmation')}
      />
      {openLanguageDialog && (
        <LanguageDialog
          onAdd={handleAddLanguage}
          onClose={handleCloseLanguageDialog}
          onUpdate={handleUpdateLanguage}
          open={openLanguageDialog}
          processing={processing}
          language={languageUpdated}
        />
      )}
    </React.Fragment>
  )
}

export default LanguageManagement

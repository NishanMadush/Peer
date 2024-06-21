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
import CountryDialog from '../components/CountryDialog'
import CountryTable from '../components/CountryTable'
import { useAddCountry } from '../hooks/useAddCountry'
import { useCountries } from '../hooks/useCountries'
import { useDeleteCountries } from '../hooks/useDeleteCountries'
import { useUpdateCountry } from '../hooks/useUpdateCountry'
import { ICountry } from '../interfacesAndTypes/country'

const pathPage = 'countries.pages.CountryManagement'

const CountryManagement = (): JSX.Element => {
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const { t } = useTranslation()

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
  const [openCountryDialog, setOpenCountryDialog] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [countryDeleted, setCountryDeleted] = useState<string[]>([])
  const [countryUpdated, setCountryUpdated] = useState<ICountry | undefined>(
    undefined
  )

  const { addCountry, isAdding } = useAddCountry()
  const { deleteCountries, isDeleting } = useDeleteCountries()
  const { isUpdating, updateCountry } = useUpdateCountry()
  const { data } = useCountries()

  const processing = isAdding || isDeleting || isUpdating

  const handleAddCountry = async (country: Partial<ICountry>) => {
    addCountry(country as ICountry)
      .then(() => {
        snackbar.success(
          t('countries:countryManagement.notifications.addSuccess', {
            country: `${country.name}`,
          })
        )
        setOpenCountryDialog(false)
      })
      .catch((error: Error) => {
        snackbar.error(error?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleDeleteCountries = async () => {
    deleteCountries(countryDeleted)
      .then(() => {
        snackbar.success(
          t('countries:countryManagement.notifications.deleteSuccess')
        )
        setSelected([])
        setCountryDeleted([])
        setOpenConfirmDeleteDialog(false)
      })
      .catch((error: Error) => {
        snackbar.error(error?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateCountry = async (country: Partial<ICountry>) => {
    updateCountry(country)
      .then(() => {
        snackbar.success(
          t('countries:countryManagement.notifications.updateSuccess', {
            country: `${country.name}`,
          })
        )
        setOpenCountryDialog(false)
      })
      .catch((error: Error) => {
        snackbar.error(error?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleCancelSelected = () => {
    setSelected([])
  }

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false)
  }

  const handleCloseCountryDialog = () => {
    setCountryUpdated(undefined)
    setOpenCountryDialog(false)
  }

  const handleOpenConfirmDeleteDialog = (countryIds: string[]) => {
    setCountryDeleted(countryIds)
    setOpenConfirmDeleteDialog(true)
  }

  const handleOpenCountryDialog = (country?: ICountry) => {
    setCountryUpdated(country)
    setOpenCountryDialog(true)
  }

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected)
  }

  return (
    <React.Fragment>
      {/* <BaseAppBar>
        {!selected.length ? (
          <BaseToolbar title={t('countries:countryManagement.toolbar.title')}>
            <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenCountryDialog()}
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
          <BaseToolbar title={t('countries:countryManagement.toolbar.title')}>
            {authorization(
              userInfo?.role,
              pathPage,
              'button.add',
              accessType.Enable
            ) && (
              <Fab
                aria-label="manage-countries"
                color="primary"
                disabled={processing}
                onClick={() => handleOpenCountryDialog()}
                size="small"
              >
                <AddIcon />
              </Fab>
            )}
          </BaseToolbar>
        )}
      </BaseAppBar>
      <CountryTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenCountryDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        countries={data}
        auth={userInfo}
      />
      <ConfirmDialog
        description={t('countries:countryManagement.confirmations.delete')}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteCountries}
        open={openConfirmDeleteDialog}
        title={t('common:common.confirmation')}
      />
      {openCountryDialog && (
        <CountryDialog
          onAdd={handleAddCountry}
          onClose={handleCloseCountryDialog}
          onUpdate={handleUpdateCountry}
          open={openCountryDialog}
          processing={processing}
          country={countryUpdated}
        />
      )}
    </React.Fragment>
  )
}

export default CountryManagement

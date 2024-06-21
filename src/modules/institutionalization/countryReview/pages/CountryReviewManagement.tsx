import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Fab, IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { string } from 'yup'

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
import {
  DEFAULT_OBJECT_ID,
  DefaultUsers,
} from '../../../baseUser/constants/helper'
import { ROOT_ROUTE } from '../../../baseUser/constants/routes'
import { useCountries } from '../../../countries/hooks/useCountries'
import { useUserSettings } from '../../../users/hooks/useUserSettings'
import { INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE } from '../../organizationAssessment/constants/routes'
import { useOrganizationAssessment } from '../../organizationAssessment/hooks/useOrganizationAssessment'
import { useOrganizationAssessmentWithFilter } from '../../organizationAssessment/hooks/useOrganizationAssessmentWithFilter'
import CountryReviewDialog from '../components/CountryReviewDialog'
import CountryReviewTable from '../components/CountryReviewTable'
import { useAddCountryReview } from '../hooks/useAddCountryReview'
import { useCountryReview } from '../hooks/useCountryReview'
import { useCountryReviews } from '../hooks/useCountryReviews'
import { useDeleteCountryReviews } from '../hooks/useDeleteCountryReviews'
import { useUpdateCountryReview } from '../hooks/useUpdateCountryReview'
import {
  IInstitutionalizationCountryReview,
  IInstitutionalizationOrganization,
} from '../interfacesAndTypes/countryReview'

const pathPage =
  'institutionalization.countryReview.pages.CountryReviewManagement'

const InstitutionalizationCountryManagement = (): JSX.Element => {
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
  const [openCountryReviewDialog, setOpenCountryReviewDialog] = useState(false)

  const [selected, setSelected] = useState<string[]>([])
  const [countryReviewDeleted, setCountryReviewDeleted] = useState<string[]>([])
  const [countryReviewUpdated, setCountryReviewUpdated] = useState<
    IInstitutionalizationCountryReview | undefined
  >(undefined)
  const [detailCountryReview, setDetailCountryReview] = useState<
    IInstitutionalizationCountryReview | undefined
  >(undefined)
  const [countryReviewId, setCountryReviewId] = useState<string | undefined>(
    undefined
  )

  const [showCountryFilter, setShowCountryFilter] = useState(true)
  const { addCountryReview, isAdding } = useAddCountryReview()
  const { getAssessments } = useOrganizationAssessmentWithFilter()
  const { getAssessment } = useOrganizationAssessment()
  const { deleteCountryReviews, isDeleting } = useDeleteCountryReviews()
  const { isUpdating, updateCountryReview } = useUpdateCountryReview()
  const { data: countriesData } = useCountries()
  const filter =
    userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR ||
    userInfo.role === DefaultUsers.ADPC_ADMINISTRATOR
      ? ``
      : userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR
      ? `?countryId=${
          userInfo?.employment?.organization?.organizationId?.countryId ??
          DEFAULT_OBJECT_ID
        }`
      : userInfo.role === DefaultUsers.ORGANIZATION_USER
      ? `?countryId=${
          userInfo?.employment?.organization?.organizationId?.countryId ??
          DEFAULT_OBJECT_ID
        }`
      : `?countryId=${DEFAULT_OBJECT_ID}`
  const { data: dataCountryReviews } = useCountryReviews(filter)

  const [assessmentHistory, setAssessmentHistory] = useState<
    IInstitutionalizationOrganization[] | undefined
  >(undefined)
  const processing = isAdding || isDeleting || isUpdating

  const handleAddReviewCountry = async (
    countryReview: Partial<IInstitutionalizationCountryReview>
  ) => {
    addCountryReview(countryReview as IInstitutionalizationCountryReview)
      .then(() => {
        snackbar.success(
          t(
            'institutionalization:countryReviewManagement.notifications.addSuccess',
            {
              countryReview: `${countryReview.year}`,
            }
          )
        )
        setOpenCountryReviewDialog(false)
      })
      .catch((error: Error) => {
        snackbar.error(error?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleDeleteReviewCountries = async () => {
    deleteCountryReviews(countryReviewDeleted)
      .then(() => {
        snackbar.success(
          t(
            'institutionalization:countryReviewManagement.notifications.deleteSuccess'
          )
        )
        setSelected([])
        setCountryReviewDeleted([])
        setOpenConfirmDeleteDialog(false)
      })
      .catch((error: Error) => {
        snackbar.error(error?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateCountryReview = async (
    countryReview: Partial<IInstitutionalizationCountryReview>
  ) => {
    updateCountryReview(countryReview)
      .then(() => {
        snackbar.success(
          t(
            'institutionalization:countryReviewManagement.notifications.updateSuccess',
            {
              countryReview: `${countryReview.year}`,
            }
          )
        )
        setOpenCountryReviewDialog(false)
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

  const handleCloseCountryReviewDialog = () => {
    setCountryReviewUpdated(undefined)
    setOpenCountryReviewDialog(false)
  }

  const handleOpenConfirmDeleteDialog = (countryReviewIds: string[]) => {
    setCountryReviewDeleted(countryReviewIds)
    setOpenConfirmDeleteDialog(true)
  }

  const handleDetailReview = (
    countryReview: IInstitutionalizationCountryReview
  ) => {
    setDetailCountryReview(countryReview)
  }
  // const handleAddAssessmentHistory = async (countryReviewId: any) => {
  //   try {
  //     const countryReview = await getAssessments()
  //     if (countryReview?.countryReviewId) {
  //       // Navigate to the desired link with the country review data
  //       navigate(
  //         `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}`
  //       )
  //     } else {
  //       // Handle error when the country review data is not found
  //       snackbar.error(
  //         t(
  //           'institutionalization:countryReviewManagement.notifications.notFound'
  //         )
  //       )
  //     }
  //   } catch (error) {
  //     // Handle error when the fetch fails
  //     snackbar.error(t('common:common.errors.unexpected.subTitle'))
  //   }
  // }

  const handleAddAssessmentHistory = async (
    countryReview: IInstitutionalizationCountryReview
  ) => {
    // Navigate to the desired link with the country review data and pass the ID as a parameter
    navigate(
      `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}?countryReviewId=${countryReview?.id}`
    )
  }

  const handleOpenCountryReviewDialog = (
    countryReview?: IInstitutionalizationCountryReview
  ) => {
    setCountryReviewUpdated(countryReview)
    setOpenCountryReviewDialog(true)
  }

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected)
  }

  const [searchQuery, setSearchQuery] = useState('')

  const [filteredCountryReviews, setFilteredCountryReviews] =
    useState(dataCountryReviews)

  // const handleSearch = () => {
  //   const filteredCountryReviews = dataCountryReviews?.filter((countryReview) =>
  //     countryReview.title.toLowerCase().includes(searchQuery.toLowerCase())
  //   )

  //   setFilteredCountryReviews(filteredCountryReviews)
  // }

  const handleSearchChange = (event: any) => {
    const newSearchQuery = event.target.value
    setSearchQuery(newSearchQuery)

    if (newSearchQuery === '') {
      setFilteredCountryReviews(dataCountryReviews)
    }
  }

  useEffect(() => {
    const filteredOrganizations = dataCountryReviews?.filter((countryReview) =>
      countryReview.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredCountryReviews(filteredOrganizations)
  }, [searchQuery, dataCountryReviews])

  return (
    <React.Fragment>
      <BaseAppBar>
        {selected.length ? (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        ) : (
          <BaseToolbar
            title={t(
              'institutionalization:countryReviewManagement.toolbar.title'
            )}
          >
            {/* <TextField
              margin="normal"
              variant="filled"
              type="text"
              label="Search"
              autoComplete="current-value"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle search"
                      color="primary"
                      onClick={handleSearch}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> */}

            <TextField
              margin="normal"
              variant="filled"
              type="text"
              label={t('common.search')}
              autoComplete="current-value"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {authorization(
              userInfo?.role,
              pathPage,
              'button.add',
              accessType.Enable
            ) && (
              <Fab
                aria-label="logout"
                color="primary"
                disabled={processing}
                onClick={() => handleOpenCountryReviewDialog()}
                size="small"
                style={{ marginLeft: 10 }}
              >
                <AddIcon />
              </Fab>
            )}
          </BaseToolbar>
        )}
      </BaseAppBar>

      <CountryReviewTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenCountryReviewDialog}
        onDetailCountryReview={handleAddAssessmentHistory}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        countryReviews={filteredCountryReviews}
        countries={countriesData}
        auth={userInfo}
      />
      <ConfirmDialog
        description={t(
          'institutionalization:countryReviewManagement.confirmations.delete'
        )}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteReviewCountries}
        open={openConfirmDeleteDialog}
        title={t('common:common.confirmation')}
      />
      {openCountryReviewDialog && (
        <CountryReviewDialog
          onAdd={handleAddReviewCountry}
          onClose={handleCloseCountryReviewDialog}
          onUpdate={handleUpdateCountryReview}
          open={openCountryReviewDialog}
          processing={processing}
          countryReviews={countryReviewUpdated}
        />
      )}
    </React.Fragment>
  )
}

export default InstitutionalizationCountryManagement

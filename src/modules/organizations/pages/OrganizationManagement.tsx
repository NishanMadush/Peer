import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import { Fab, IconButton, InputAdornment, TextField } from '@mui/material'
import lodash, { remove } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import ConfirmDialog from '../../../core/components/ConfirmDialog'
import SelectToolbar from '../../../core/components/SelectToolbar'
import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { useAuth } from '../../auth/contexts/AuthProvider'
import BaseAppBar from '../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../baseUser/components/BaseToolbar'
import { accessType, authorization } from '../../baseUser/config/authorization'
import {
  DEFAULT_OBJECT_ID,
  DefaultUsers,
} from '../../baseUser/constants/helper'
import { ROOT_ROUTE } from '../../baseUser/constants/routes'
import { useCountries } from '../../countries/hooks/useCountries'
import { USER_MANAGEMENT_ROUTE } from '../../users/constants/routes'
import BranchDialog from '../components/BranchDialog'
import BranchTable from '../components/BranchTable'
// import { BRANCH_MANAGEMENT_ROUTE } from '../branches/constants/routes'
import OrganizationDialog from '../components/OrganizationDialog'
import OrganizationTable from '../components/OrganizationTable'
// import { categories } from '../constants/CountryUtil'
import { useAddOrganization } from '../hooks/useAddOrganization'
import { useDeleteOrganizations } from '../hooks/useDeleteOrganizations'
import { useOrganization } from '../hooks/useOrganization'
import { useOrganizations } from '../hooks/useOrganizations'
import { useUpdateOrganization } from '../hooks/useUpdateOrganization'
import {
  IOrganization,
  IOrganizationBranch,
} from '../interfacesAndTypes/organization'

const pathPage = 'organizations.pages.OrganizationManagement'

const OrganizationManagement = (): JSX.Element => {
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
  const [loadBranchesForNewOrg, setLoadBranchesForNewOrg] = useState(false)
  const [openConfirmBranchDeleteDialog, setOpenConfirmBranchDeleteDialog] =
    useState(false)
  const [openOrganizationDialog, setOpenOrganizationDialog] =
    useState<boolean>(false)
  const [openOrganizationBranchDialog, setOpenOrganizationBranchDialog] =
    useState<boolean>(false)
  const [openOrganizationAddress, setOpenOrganizationAddress] =
    useState<boolean>(false)
  const [organization, setOrganization] = useState<IOrganization | undefined>(
    undefined
  )

  const [selected, setSelected] = useState<string[]>([])
  const [organizationDeleted, setOrganizationDeleted] = useState<string[]>([])
  const [branchDeleted, setBranchDeleted] = useState<string>('')
  const [detailOrganization, setDetailOrganization] = useState<
    IOrganization | undefined
  >(undefined)
  const [detailOrganizationBranch, setDetailOrganizationBranch] = useState<
    Partial<IOrganizationBranch> | undefined
  >(undefined)
  const [branchUpdated, setBranchUpdated] = useState<
    IOrganizationBranch | undefined
  >(undefined)
  const [organizationUpdated, setOrganizationUpdated] = useState<
    IOrganization | undefined
  >(undefined)
  const { addOrganization, isAdding } = useAddOrganization()
  const { deleteOrganizations, isDeleting } = useDeleteOrganizations()
  const { isUpdating, updateOrganization } = useUpdateOrganization()
  const [organizations, setOrganizations] = useState<
    IOrganization[] | undefined
  >(undefined)
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
      ? `?_id=${
          userInfo?.employment?.organization?.organizationId?.id ??
          DEFAULT_OBJECT_ID
        }`
      : `?_id=${DEFAULT_OBJECT_ID}`
  const { data } = useOrganizations(filter)

  const processing = isAdding || isDeleting || isUpdating

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredOrganizations, setFilteredOrganizations] = useState(data)

  const handleAddOrganization = async (
    organization: Partial<IOrganization>
  ) => {
    addOrganization(organization as IOrganization)
      .then(() => {
        snackbar.success(
          t('organizations:organizationManagement.notifications.addSuccess', {
            organization: `${organization.name}`,
          })
        )
        setOpenOrganizationDialog(false)
        // setFilteredOrganizations([...filteredOrganizations, organization])
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleAddOrganizationBranch = (
    organizationBranch: IOrganizationBranch
  ) => {
    // Update the organization with Branch details

    if (!(detailOrganization && detailOrganization.id)) {
      snackbar.error(t('common.errors.unexpected.subTitle'))
      return
    }
    const currentOrganization = detailOrganization as Partial<IOrganization>

    currentOrganization['branches'] = currentOrganization?.branches
      ? [...detailOrganization.branches, organizationBranch]
      : [organizationBranch]

    delete currentOrganization['name']

    updateOrganization(currentOrganization)
      .then((resultOrganization: IOrganization) => {
        snackbar.success(
          t('organizations:branchManagement.notifications.addSuccess', {
            organization: `${resultOrganization.name} `,
          })
        )
        setDetailOrganization(resultOrganization)
        setOpenOrganizationBranchDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleDeleteOrganizations = async () => {
    deleteOrganizations(organizationDeleted)
      .then(() => {
        snackbar.success(
          t('organizations:organizationManagement.notifications.deleteSuccess')
        )
        setSelected([])
        setOrganizationDeleted([])
        setOpenConfirmDeleteDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleDeleteOrganizationBranch = () => {
    // Update the organization with branch details

    if (!(detailOrganization && detailOrganization.id)) {
      snackbar.error(t('common.errors.unexpected.subTitle'))
      return
    }

    const currentOrganization = detailOrganization as IOrganization

    const itemIndex = lodash.remove(currentOrganization.branches, (branch) => {
      return branch._id === branchDeleted
    })

    updateOrganization(currentOrganization)
      .then((resultOrganization: IOrganization) => {
        snackbar.success(
          t('organizations:branchManagement.notifications.deleteSuccess', {
            organization: `${resultOrganization.name}`,
          })
        )
        setDetailOrganization(resultOrganization)
        setSelected([])
        setBranchDeleted('')
        setOpenConfirmDeleteDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateOrganization = async (
    organization: Partial<IOrganization>
  ) => {
    updateOrganization(organization)
      .then(() => {
        snackbar.success(
          t(
            'organizations:organizationManagement.notifications.updateSuccess',
            {
              organization: `${organization.name}`,
            }
          )
        )
        setOpenOrganizationDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateOrganizationBranch = (branch: IOrganizationBranch) => {
    // Update the organization with branch details

    if (!(detailOrganization && detailOrganization.id)) {
      snackbar.error(t('common.errors.unexpected.subTitle'))
      return
    }

    const currentOrganization = detailOrganization as Partial<IOrganization>

    const itemIndex = lodash.findIndex(currentOrganization.branches, {
      _id: branch._id,
    })

    if (itemIndex > -1 && currentOrganization?.branches) {
      currentOrganization.branches[itemIndex] = branch
    }
    delete currentOrganization['name']

    updateOrganization(currentOrganization)
      .then((resultOrganization: IOrganizationBranch) => {
        snackbar.success(
          t('organizations:branchManagement.notifications.updateSuccess', {
            organization: `${resultOrganization.branchName}`,
          })
        )
        setDetailOrganizationBranch(resultOrganization)
        setOpenOrganizationBranchDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleEditOrganizationBranch = (
    branch: Partial<IOrganizationBranch>
  ) => {
    setDetailOrganizationBranch(branch)
    handleOpenOrganizationBranchDialog()
  }

  const handleCancelSelected = () => {
    setSelected([])
  }

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false)
  }

  const handleCloseOrganizationDialog = () => {
    setOrganizationUpdated(undefined)
    setOpenOrganizationDialog(false)
  }

  const handleCloseOrganizationBranchDialog = () => {
    setDetailOrganizationBranch(undefined)
    setOpenOrganizationBranchDialog(false)
  }

  const handleOpenConfirmDeleteDialog = (organizationIds: string[]) => {
    setOrganizationDeleted(organizationIds)
    setOpenConfirmDeleteDialog(true)
  }

  const handleOpenConfirmBranchDeleteDialog = (branchId: string) => {
    setBranchDeleted(branchId)
    setOpenConfirmDeleteDialog(true)
  }
  const handleDetailBranch = (organization: IOrganization) => {
    setDetailOrganization(organization)
  }

  const handleOpenOrganizationDialog = (organization?: IOrganization) => {
    setOrganizationUpdated(organization)
    setOpenOrganizationDialog(true)
  }

  const handleSelectedChange = (newSelected: string[]) => {
    console.log('!@# >>>>> ', newSelected)
    setSelected(newSelected)
  }

  const handleOpenOrganizationBranchDialog = (branch?: IOrganizationBranch) => {
    setBranchUpdated(branch)
    setOpenOrganizationBranchDialog(true)
  }

  const handleAddUser = async (organization: IOrganization) => {
    // Navigate to the desired link with the country review data and pass the ID as a parameter
    navigate(
      `/${ROOT_ROUTE}/${USER_MANAGEMENT_ROUTE}?organizationId=${organization?.id}`
    )
  }

  const handleSearchChange = (event: any) => {
    const newSearchQuery = event.target.value
    setSearchQuery(newSearchQuery)

    if (newSearchQuery === '') {
      setFilteredOrganizations(data)
    }
  }

  useEffect(() => {
    const filteredOrganizations = data?.filter((organization) =>
      organization.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredOrganizations(filteredOrganizations)
  }, [searchQuery, data])

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
            title={t('organizations:organizationManagement.toolbar.title')}
          >
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

            {detailOrganization ? (
              <>
                <Fab
                  aria-label="delete-organizations"
                  color="secondary"
                  disabled={processing}
                  onClick={() => setDetailOrganization(undefined)}
                  size="small"
                  style={{ marginRight: 10 }}
                >
                  <ArrowBackIcon />
                </Fab>
                {authorization(
                  userInfo?.role,
                  pathPage,
                  'button.addBranch',
                  accessType.Enable
                ) && (
                  <Fab
                    aria-label="manage-branches"
                    color="primary"
                    disabled={processing}
                    onClick={() =>
                      handleOpenOrganizationBranchDialog(undefined)
                    }
                    size="small"
                  >
                    <AddIcon />
                  </Fab>
                )}
              </>
            ) : (
              <>
                {authorization(
                  userInfo?.role,
                  pathPage,
                  'button.addOrganization',
                  accessType.Enable
                ) && (
                  <Fab
                    aria-label="manage-organizations"
                    color="primary"
                    disabled={processing}
                    onClick={() => handleOpenOrganizationDialog()}
                    size="small"
                    style={{ marginLeft: 10 }}
                  >
                    <AddIcon />
                  </Fab>
                )}
              </>
            )}
          </BaseToolbar>
        )}
      </BaseAppBar>
      {detailOrganization ? (
        <BranchTable
          processing={processing}
          organization={detailOrganization}
          onEditBranch={handleEditOrganizationBranch}
          onSelectedChange={handleSelectedChange}
          onDeleteBranch={handleOpenConfirmBranchDeleteDialog}
          selected={selected}
          auth={userInfo}
        />
      ) : (
        <OrganizationTable
          processing={processing}
          onDelete={handleOpenConfirmDeleteDialog}
          onEdit={handleOpenOrganizationDialog}
          onDetailBranch={handleDetailBranch}
          onSelectedChange={handleSelectedChange}
          onDetailOrganizationUser={handleAddUser}
          selected={selected}
          organizations={filteredOrganizations}
          countries={countriesData}
          auth={userInfo}
        />
      )}
      {detailOrganization ? (
        <ConfirmDialog
          description={t('organizations:branchManagement.confirmations.delete')}
          pending={processing}
          onClose={handleCloseConfirmDeleteDialog}
          onConfirm={handleDeleteOrganizationBranch}
          open={openConfirmDeleteDialog}
          title={t('common.confirmation')}
        />
      ) : (
        <ConfirmDialog
          description={t(
            'organizations:organizationManagement.confirmations.delete'
          )}
          pending={processing}
          onClose={handleCloseConfirmDeleteDialog}
          onConfirm={handleDeleteOrganizations}
          open={openConfirmDeleteDialog}
          title={t('common.confirmation')}
        />
      )}

      {openOrganizationDialog && (
        <OrganizationDialog
          onAdd={handleAddOrganization}
          onClose={handleCloseOrganizationDialog}
          onUpdate={handleUpdateOrganization}
          open={openOrganizationDialog}
          processing={processing}
          organization={organizationUpdated}
        />
      )}

      {openOrganizationBranchDialog && (
        <BranchDialog
          onAddBranch={handleAddOrganizationBranch}
          onCloseBranch={handleCloseOrganizationBranchDialog}
          onUpdateBranch={handleUpdateOrganizationBranch}
          openBranch={openOrganizationBranchDialog}
          processing={processing}
          branch={detailOrganizationBranch ?? {}}
        />
      )}
    </React.Fragment>
  )
}

export default OrganizationManagement

import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
  Card,
  Fab,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

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
import { useCountries } from '../../countries/hooks/useCountries'
import UserDialog from '../components/UserDialog'
import UserTable from '../components/UserTable'
import { useAddUser } from '../hooks/useAddUser'
import { useDeleteUsers } from '../hooks/useDeleteUsers'
import { useNotifyUser } from '../hooks/useNotifyUser'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { useUsers } from '../hooks/useUsers'
import { useUserSettings } from '../hooks/useUserSettings'
import { IUser } from '../interfacesAndTypes/user'

const pathPage = 'users.pages.UserManagement'

const UserManagement = (): JSX.Element => {
  const { userInfo } = useAuth()
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const { data: settings } = useUserSettings()
  const { data: countriesData } = useCountries()

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
  const [openUserDialog, setOpenUserDialog] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [userDeleted, setUserDeleted] = useState<string[]>([])
  const [userUpdated, setUserUpdated] = useState<IUser | undefined>(undefined)

  const isAdmin = userInfo?.role === DefaultUsers.SUPER_ADMINISTRATOR
  const { addUser, isAdding } = useAddUser()
  const { isDeleting, deleteUsers } = useDeleteUsers()
  const { isUpdating, updateUser } = useUpdateUser()
  const { isNotifying, notifyUser } = useNotifyUser()
  const filter =
    userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR ||
    userInfo.role === DefaultUsers.ADPC_ADMINISTRATOR
      ? ``
      : userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR
      ? `?countryId=${
          userInfo?.employment?.organization?.organizationId?.countryId ??
          DEFAULT_OBJECT_ID
        }`
      : userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR
      ? `?organizationId=${
          userInfo?.employment?.organization?.organizationId?.id ??
          DEFAULT_OBJECT_ID
        }`
      : `?countryId=${DEFAULT_OBJECT_ID}`

  const { data: userList, error, isError } = useUsers(filter)

  const location = useLocation()

  let filteredUserList = userList

  if (userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR) {
    filteredUserList = lodash.filter(filteredUserList, (user) => {
      // Replace 'userRoleProperty' with the actual property in your user objects that represents user roles
      return (
        user.role === DefaultUsers.COUNTRY_ADMINISTRATOR ||
        user.role === DefaultUsers.ORGANIZATION_USER
      )
    })
  }

  if (error || isError) {
    // console.log('@@@@@@@@@@@@@@@@@@@ 1')
    snackbar.error(t('common.errors.unexpected.subTitle'))
  }
  if (userList) {
    // console.log('@@@@@@@@@@@@@@@@@@@ 2', userList)
  }

  const processing = isAdding || isDeleting || isUpdating || isNotifying

  const handleAddUser = async (user: Partial<IUser>) => {
    addUser(user as IUser)
      .then(() => {
        snackbar.success(
          t('users:userManagement.notifications.addSuccess', {
            user: `${user.firstName} ${user.lastName}`,
          })
        )
        setUserUpdated(undefined)
        setOpenUserDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleDeleteUsers = async () => {
    deleteUsers(userDeleted)
      .then(() => {
        snackbar.success(t('users:userManagement.notifications.deleteSuccess'))
        setSelected([])
        setUserDeleted([])
        setOpenConfirmDeleteDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleUpdateUser = async (user: Partial<IUser>) => {
    updateUser(user as IUser)
      .then(() => {
        snackbar.success(
          t('users:userManagement.notifications.updateSuccess', {
            user: `${user.firstName} ${user.lastName}`,
          })
        )
        setUserUpdated(undefined)
        setOpenUserDialog(false)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const handleCancelSelected = () => {
    setSelected([])
  }

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false)
  }

  const handleCloseUserDialog = () => {
    setUserUpdated(undefined)
    setOpenUserDialog(false)
  }

  const handleOpenConfirmDeleteDialog = (userIds: string[]) => {
    setUserDeleted(userIds)
    setOpenConfirmDeleteDialog(true)
  }

  const handleOpenUserDialog = (user?: IUser) => {
    setUserUpdated(user)
    setOpenUserDialog(true)
  }

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected)
  }

  const handleNotifyUser = (user?: IUser) => {
    notifyUser(user)
      .then(() => {
        snackbar.success(
          t('users:userManagement.notifications.notifySuccess', {
            user: `${user?.firstName} ${user?.lastName}`,
          })
        )
      })
      .catch((error: Error) => {
        snackbar.error(error?.message ?? t('common.errors.unexpected.subTitle'))
      })
  }

  const [searchQuery, setSearchQuery] = useState('')

  const filterUserList = (userList: any, organizationId: any) => {
    if (!organizationId) {
      return userList
    }

    return userList.filter((user: any) => {
      const orgIdMatch =
        user.employment?.organization?.organizationId?.id === organizationId
      return orgIdMatch
    })
  }

  const searchParams = new URLSearchParams(location.search)
  const [organizationIdParam, setOrganizationIdParam] = useState(
    searchParams.get('organizationId')
  )
  const [filteredUsers, setFilteredUsers] = useState(userList)

  useEffect(() => {
    setFilteredUsers(filterUserList(userList, organizationIdParam))
  }, [organizationIdParam, userList])

  const handleSearchChange = (event: any) => {
    const newSearchQuery = event.target.value
    setSearchQuery(newSearchQuery)
    const filteredUsers = userList?.filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredUsers(filteredUsers)

    if (newSearchQuery === '') {
      setFilteredUsers(userList)
    }
  }

  return (
    <React.Fragment>
      <BaseAppBar>
        {isAdmin && selected.length ? (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        ) : (
          <BaseToolbar title={t('users:userManagement.toolbar.title')}>
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
                aria-label="manage-users"
                color="primary"
                disabled={processing}
                onClick={() => handleOpenUserDialog()}
                size="small"
                style={{ marginLeft: 10 }}
              >
                <AddIcon />
              </Fab>
            )}
          </BaseToolbar>
        )}
      </BaseAppBar>

      <UserTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenUserDialog}
        onNotify={handleNotifyUser}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        users={filteredUsers}
        countries={countriesData}
        auth={userInfo}
      />

      <ConfirmDialog
        description={t('users:userManagement.confirmations.delete')}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteUsers}
        open={openConfirmDeleteDialog}
        title={t('common.confirmation')}
      />
      {openUserDialog && (
        <UserDialog
          onAdd={handleAddUser}
          onClose={handleCloseUserDialog}
          onUpdate={handleUpdateUser}
          open={openUserDialog}
          processing={processing}
          user={userUpdated}
          userSettings={settings}
        />
      )}
    </React.Fragment>
  )
}

export default UserManagement

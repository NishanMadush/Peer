import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PersonIcon from '@mui/icons-material/Person'
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '../../../core/components/Empty'
import * as selectUtils from '../../../core/utils/selectUtils'
import { useAuth } from '../../auth/contexts/AuthProvider'
import { accessType, authorization } from '../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../baseUser/config/styles'
import { DefaultUsers } from '../../baseUser/constants/helper'
import { useCountries } from '../../countries/hooks/useCountries'
import { ICountry } from '../../countries/interfacesAndTypes/country'
import { useUsers } from '../hooks/useUsers'
import { useUserSettings } from '../hooks/useUserSettings'
import {
  ILocalUserInfo,
  IUser,
  UserStatusEnum,
} from '../interfacesAndTypes/user'

const pathComponent = 'users.components.UserTable'

interface HeadCell {
  id: string
  label: string
  align: 'center' | 'left' | 'right'
}

const headCells: HeadCell[] = [
  {
    id: 'user',
    align: 'left',
    label: 'users:userManagement.table.headers.user',
  },
  {
    id: 'role',
    align: 'center',
    label: 'users:userManagement.table.headers.role',
  },
  {
    id: 'status',
    align: 'center',
    label: 'users:userManagement.table.headers.status',
  },
]

interface EnhancedTableProps {
  numSelected: number
  // eslint-disable-next-line no-unused-vars
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
  auth: ILocalUserInfo
}

function EnhancedTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
  auth,
}: EnhancedTableProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow sx={{ '& th': { border: 0 } }}>
        <TableCell sx={{ py: 0 }}>
          {authorization(
            auth.role,
            pathComponent,
            'button.deleteAll',
            accessType.Enable
          ) && (
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all users',
              }}
            />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0 }}>
          {t('users:userManagement.table.headers.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

type UserRowProps = {
  index: number
  onCheck: (id: string) => void
  onDelete: (userIds: string[]) => void
  onEdit: (user: IUser) => void
  onNotify: (user: IUser) => void
  processing: boolean
  selected: boolean
  user: IUser
  auth: ILocalUserInfo
}

const UserRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  onNotify,
  processing,
  selected,
  user,
  auth,
}: UserRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const labelId = `enhanced-table-checkbox-${index}`
  const openActions = Boolean(anchorEl)

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseActions = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleCloseActions()
    onDelete([user.id])
  }

  const handleEdit = () => {
    handleCloseActions()
    onEdit(user)
  }

  const handleNotify = () => {
    handleCloseActions()
    onNotify(user)
  }

  // const handleCreate = () => {}

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={user.id}
      selected={selected}
      sx={{
        '& td': {
          bgcolor: 'background.paper',
          border: 0,
          opacity: processing ? 0.5 : 1,
        },
      }}
    >
      <TableCell
        padding="checkbox"
        // sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowStart)}
      >
        {authorization(
          auth.role,
          pathComponent,
          'button.deleteAll',
          accessType.Enable
        ) && (
          <Checkbox
            color="primary"
            checked={selected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
            onClick={() => onCheck(user.id)}
            disabled={processing}
          />
        )}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">{user.role}</TableCell>
      <TableCell align="center">
        <Chip
          color={
            user.status === UserStatusEnum.Active
              ? 'primary'
              : user.status === UserStatusEnum.Deleted
              ? 'error'
              : 'default'
          }
          label={user.status}
          disabled={processing}
        />
      </TableCell>
      <TableCell
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="user-row-menu-button"
          aria-label="user actions"
          aria-controls="user-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="user-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="user-row-menu-button"
          open={openActions}
          onClose={handleCloseActions}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {authorization(
            auth.role,
            pathComponent,
            'menu.edit',
            accessType.Enable
          ) && (
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>{' '}
              {t('common.edit')}
            </MenuItem>
          )}
          <MenuItem
            onClick={handleNotify}
            disabled={
              user.status === UserStatusEnum.Disabled ||
              user.status === UserStatusEnum.Deleted
            }
          >
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>{' '}
            {user.status === UserStatusEnum.Pending
              ? t('users:userManagement.menu.createPassword')
              : t('users:userManagement.menu.notifyPassword')}
          </MenuItem>
          {authorization(
            auth.role,
            pathComponent,
            'menu.delete',
            accessType.Enable
          ) && (
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>{' '}
              {t('common.delete')}
            </MenuItem>
          )}
        </Menu>
      </TableCell>
    </TableRow>
  )
}

type UserTableProps = {
  processing: boolean
  onDelete: (userIds: string[]) => void
  onEdit: (user: IUser) => void
  onNotify: (user: IUser) => void
  onSelectedChange: (selected: string[]) => void
  selected: string[]
  users?: IUser[]
  countries?: ICountry[]
  auth: ILocalUserInfo
}

const UserTable = ({
  onDelete,
  onEdit,
  onNotify,
  onSelectedChange,
  processing,
  selected,
  users = [],
  countries = [],
  auth,
}: UserTableProps): JSX.Element => {
  const { userInfo } = useAuth()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedCountry, setSelectedCountry] = useState('')

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(users)
      onSelectedChange(newSelecteds)
      return
    }
    onSelectedChange([])
  }

  const handleClick = (id: string) => {
    const newSelected: string[] = selectUtils.selectOne(selected, id)
    onSelectedChange(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  if (users.length === 0) {
    return <Empty title="No user yet" />
  }

  const [selectedCountryId, setSelectedCountryId] = useState('all')

  const [userList, setUserList] = useState<IUser[]>([])
  const [filteredUserList, setFilteredUserList] = useState<IUser[]>([])

  useEffect(() => {
    setUserList(users)
    setFilteredUserList(users)
  }, [users])

  const handleDaterangeChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value as string
    setSelectedCountryId(selectedId)

    if (selectedId === 'all') {
      setFilteredUserList(userList)
    } else {
      const filteredList: IUser[] = userList.filter(
        (user) =>
          user.employment?.organization?.organizationId?.countryId ===
          selectedId
      )
      setFilteredUserList(filteredList)
    }

    setPage(0)
  }

  return (
    <React.Fragment>
      <TableContainer>
        {authorization(
          auth.role,
          pathComponent,
          'dropDownFilter',
          accessType.Enable
        ) && (
          <Card style={{ width: 'fit-content' }}>
            <Select
              value={selectedCountryId}
              onChange={handleDaterangeChange}
              displayEmpty
              renderValue={(selected) => {
                if (selectedCountryId === 'all') {
                  return <em>{t('common.country.filter')}</em>
                }
                const selectedCountry = countries?.find(
                  (country) => country.id === selectedCountryId
                )
                return selectedCountry ? (
                  selectedCountry.name
                ) : (
                  <em>All countries</em>
                )
              }}
            >
              <MenuItem value="all">
                <em>{t('common.country.allCountries')}</em>
              </MenuItem>
              {countries &&
                countries.map((countries) => (
                  <MenuItem key={countries.id} value={countries.id}>
                    {countries.name}
                  </MenuItem>
                ))}
            </Select>
          </Card>
        )}
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: 'separate',
            borderSpacing: '0 1rem',
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={users.length}
            auth={auth}
          />
          <TableBody>
            {filteredUserList &&
              filteredUserList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <UserRow
                    index={index}
                    key={user.id}
                    onCheck={handleClick}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onNotify={onNotify}
                    processing={processing}
                    selected={isSelected(user.id)}
                    user={user}
                    auth={auth}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUserList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

export default UserTable

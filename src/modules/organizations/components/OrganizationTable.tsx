import DeleteIcon from '@mui/icons-material/Delete'
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonIcon from '@mui/icons-material/Person'
import PlaceIcon from '@mui/icons-material/Place'
import RoofingSharpIcon from '@mui/icons-material/RoofingSharp'
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Chip,
  IconButton,
  Link,
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
import { Link as RouterLink } from 'react-router-dom'

import Empty from '../../../core/components/Empty'
import * as selectUtils from '../../../core/utils/selectUtils'
import { ILocalUserInfo } from '../../auth/interfacesAndTypes/userInfo'
import { accessType, authorization } from '../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../baseUser/config/styles'
import { ICountry } from '../../countries/interfacesAndTypes/country'
import { IOrganization } from '../interfacesAndTypes/organization'

const pathComponent = 'organizations.components.OrganizationTable'

interface HeadCell {
  id: string
  label: string
  align: 'center' | 'left' | 'right'
}

const headCells: HeadCell[] = [
  {
    id: 'organization',
    align: 'left',
    label: 'organizations:organizationManagement.table.headers.organization',
  },
  {
    id: 'organizationType',
    align: 'center',
    label:
      'organizations:organizationManagement.table.headers.organizationType',
  },
  // {
  //   id: 'status',
  //   align: 'center',
  //   label: 'organizations:organizationManagement.table.headers.status',
  // },
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
                'aria-label': 'select all organizations',
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
          {t('organizations:organizationManagement.table.headers.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

type OrganizationRowProps = {
  index: number
  // eslint-disable-next-line no-unused-vars
  onCheck: (id: string) => void
  // eslint-disable-next-line no-unused-vars
  onDelete: (organizationIds: string[]) => void
  // eslint-disable-next-line no-unused-vars
  onEdit: (organization: IOrganization) => void
  // eslint-disable-next-line no-unused-vars
  onDetailBranch: (organization: IOrganization) => void
  onDetailOrganizationUser: (organization: IOrganization) => void
  processing: boolean
  selected: boolean
  organization: IOrganization
  auth: ILocalUserInfo
}

const OrganizationRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  onDetailBranch,
  onDetailOrganizationUser,
  processing,
  selected,
  organization,
  auth,
}: OrganizationRowProps) => {
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

  const handleEdit = () => {
    handleCloseActions()
    onEdit(organization)
  }
  const handleBranch = () => {
    handleCloseActions()
    onDetailBranch(organization)
  }
  const handleDelete = () => {
    handleCloseActions()
    onDelete([organization.id])
  }
  const handleOrganizationUser = () => {
    handleCloseActions()
    onDetailOrganizationUser(organization)
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={organization.id}
      selected={selected}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
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
            onClick={() => onCheck(organization.id)}
          />
        )}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <RoofingSharpIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {organization.name}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {/* {organization.countryId} */}
              {organization.description}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box>
          <Typography component="div" variant="h6">
            {organization.organizationType}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {organization.geographicArea}
          </Typography>
        </Box>
      </TableCell>
      <TableCell
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="organization-row-menu-button"
          aria-label="organization actions"
          aria-controls="organization-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="organization-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="organization-row-menu-button"
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
          <MenuItem onClick={handleBranch}>
            <ListItemIcon>
              <PlaceIcon />
            </ListItemIcon>{' '}
            {t('organizations:organizationManagement.menu.branches.label')}
          </MenuItem>
          <MenuItem onClick={handleOrganizationUser}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>{' '}
            {t('common.user')}
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

type OrganizationTableProps = {
  processing: boolean
  // eslint-disable-next-line no-unused-vars
  onDelete: (organizationIds: string[]) => void
  // eslint-disable-next-line no-unused-vars
  onEdit: (organization: IOrganization) => void
  // eslint-disable-next-line no-unused-vars
  onDetailBranch: (organization: IOrganization) => void
  // eslint-disable-next-line no-unused-vars
  onSelectedChange: (selected: string[]) => void
  onDetailOrganizationUser: (organization: IOrganization) => void
  selected: string[]
  organizations?: IOrganization[]
  auth: ILocalUserInfo
  countries?: ICountry[]
}

const OrganizationTable = ({
  onDelete,
  onEdit,
  onDetailBranch,
  onSelectedChange,
  onDetailOrganizationUser,
  processing,
  selected,
  organizations = [],
  auth,
  countries = [],
}: OrganizationTableProps): JSX.Element => {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(organizations)
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

  if (organizations.length === 0) {
    return <Empty title="No organization yet" />
  }

  const [selectedCountryId, setSelectedCountryId] = useState('all')

  const [organizationList, setUserList] = useState<IOrganization[]>([])
  const [filteredOrganizationList, setFilteredOrganizationList] = useState<
    IOrganization[]
  >([])

  useEffect(() => {
    setUserList(organizations)
    setFilteredOrganizationList(organizations)
  }, [organizations])

  useEffect(() => {
    if (selectedCountryId === 'all') {
      setFilteredOrganizationList(organizationList)
    } else {
      const filteredList: IOrganization[] =
        organizationList?.filter(
          (organization) => organization.countryId === selectedCountryId
        ) || []
      setFilteredOrganizationList(filteredList)
    }
  }, [selectedCountryId, organizationList])

  const handleDaterangeChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value as string
    setSelectedCountryId(selectedId)
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
            rowCount={organizations.length}
            auth={auth}
          />
          <TableBody>
            {filteredOrganizationList &&
              filteredOrganizationList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((organization, index) => (
                  <OrganizationRow
                    index={index}
                    key={organization.id}
                    onCheck={handleClick}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onDetailBranch={onDetailBranch}
                    onDetailOrganizationUser={onDetailOrganizationUser}
                    processing={processing}
                    selected={isSelected(organization.id)}
                    organization={organization}
                    auth={auth}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrganizationList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

export default OrganizationTable

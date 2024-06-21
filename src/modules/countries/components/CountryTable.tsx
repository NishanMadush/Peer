import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FlagCircleIcon from '@mui/icons-material/FlagCircle'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '../../../core/components/Empty'
import * as selectUtils from '../../../core/utils/selectUtils'
import { useAuth } from '../../auth/contexts/AuthProvider'
import { ILocalUserInfo } from '../../auth/interfacesAndTypes/userInfo'
import { accessType, authorization } from '../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../baseUser/config/styles'
import {
  CountryStatusEnum,
  ICountry,
  ICountryTableHeadCell,
} from '../interfacesAndTypes/country'

const headCells: ICountryTableHeadCell[] = [
  {
    key: 'name',
    align: 'left',
    label: 'countries:countryManagement.table.headers.name',
  },
  {
    key: 'isAppCountry',
    align: 'center',
    label: 'countries:countryManagement.table.headers.isAppCountry',
  },
  {
    key: 'status',
    align: 'center',
    label: 'countries:countryManagement.table.headers.status',
  },
  {
    key: 'actions',
    align: 'right',
    label: 'countries:countryManagement.table.headers.actions',
  },
]

const pathComponent = 'countries.components.CountryTable'

interface EnhancedTableProps {
  numSelected: number
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
                'aria-label': 'select all countries',
              }}
            />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.key} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

type CountriesRowProps = {
  index: number
  onCheck: (id: string) => void
  onDelete: (countryIds: string[]) => void
  onEdit: (country: ICountry) => void
  auth: ILocalUserInfo
  processing: boolean
  selected: boolean
  country: ICountry
}

const CountriesRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
  country,
  auth,
}: CountriesRowProps) => {
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
    onDelete([country.id])
  }

  const handleEdit = () => {
    handleCloseActions()
    onEdit(country)
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={country.id}
      selected={selected}
      sx={{ '& td': { bgcolor: 'background.paper' } }}
    >
      {/* Row selected check mark */}
      <TableCell
        padding="checkbox"
        // sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowStart)}
      >
        {authorization(
          auth?.role,
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
            onClick={() => onCheck(country.id)}
          />
        )}
      </TableCell>
      {/* Country details */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <FlagCircleIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {country.name}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {country.code}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      {/* Is APP country flag */}
      <TableCell align="center">
        {country.isAppCountry === true
          ? t('common:common.yes')
          : t('common:common.no')}
      </TableCell>
      {/* Country status */}
      <TableCell align="center">
        {country.status === CountryStatusEnum.Active ? (
          <Chip color="primary" label="Active" />
        ) : (
          <Chip label={country.status} />
        )}
      </TableCell>
      {/* Row actions */}
      <TableCell
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="country-row-menu-button"
          aria-label="country actions"
          aria-controls="country-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="country-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="country-row-menu-button"
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
              {t('common:common.edit')}
            </MenuItem>
          )}
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
              {t('common:common.delete')}
            </MenuItem>
          )}
        </Menu>
      </TableCell>
    </TableRow>
  )
}

type CountriesTableProps = {
  processing: boolean
  onDelete: (countryIds: string[]) => void
  onEdit: (country: ICountry) => void
  onSelectedChange: (selected: string[]) => void
  selected: string[]
  countries?: ICountry[]
  auth: ILocalUserInfo
}

const CountriesTable = ({
  onDelete,
  onEdit,
  onSelectedChange,
  processing,
  selected,
  countries = [],
  auth,
}: CountriesTableProps): JSX.Element => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(countries)
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

  if (countries.length === 0) {
    return <Empty title="No country yet" />
  }

  return (
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: 'separate',
            borderSpacing: '0 1rem',
          }}
        >
          {/* Table header */}
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={countries.length}
            auth={auth}
          />
          {/* Table body */}
          <TableBody>
            {countries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((country, index) => (
                <CountriesRow
                  index={index}
                  key={country.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  processing={processing}
                  selected={isSelected(country.id)}
                  country={country}
                  auth={auth}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Paginate the table */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={countries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

export default CountriesTable

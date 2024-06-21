import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonIcon from '@mui/icons-material/Person'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
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
import { groupBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '../../../../core/components/Empty'
import * as selectUtils from '../../../../core/utils/selectUtils'
import { dateToString } from '../../../../utils/helper'
import { ILocalUserInfo } from '../../../auth/interfacesAndTypes/userInfo'
import {
  accessType,
  authorization,
} from '../../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../../baseUser/config/styles'
import { ICountry } from '../../../countries/interfacesAndTypes/country'
import {
  AssessmentStatusEnum,
  FormStatusEnum,
  ICountryReviewTableHeadCell,
  IInstitutionalizationCountryReview,
} from '../interfacesAndTypes/countryReview'

const headCells: ICountryReviewTableHeadCell[] = [
  {
    key: 'title',
    align: 'left',
    label:
      'institutionalization:countryReviewManagement.countryReviewTable.headers.title',
  },

  {
    key: 'dates',
    align: 'center',
    label:
      'institutionalization:countryReviewManagement.countryReviewTable.headers.dates',
  },
  {
    key: 'status',
    align: 'center',
    label:
      'institutionalization:countryReviewManagement.countryReviewTable.headers.status',
  },
  // {
  //   key: 'score',
  //   align: 'center',
  //   label:
  //     'institutionalization:countryReviewManagement.countryReviewTable.headers.score',
  // },
]

const pathComponent =
  'institutionalization.countryReview.components.CountryReviewTable'

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
      <TableRow key={-1} sx={{ '& th': { border: 0 } }}>
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
                'aria-label': 'select all institutionalization country reviews',
              }}
            />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.key} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0 }}>
          {t('institutionalization:formManagement.formTable.headers.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

type CountryReviewRowProps = {
  index: number
  countryReview: IInstitutionalizationCountryReview
  onCheck: (id: string) => void
  onEdit: (countryReview: IInstitutionalizationCountryReview) => void
  onDelete: (countryReviewIds: string[]) => void
  onDetailCountryReview: (
    countryReview: IInstitutionalizationCountryReview
  ) => void
  processing: boolean
  selected: boolean
  auth: ILocalUserInfo
}

const CountryReviewRow = ({
  index,
  countryReview,
  onCheck,
  onEdit,
  onDelete,
  onDetailCountryReview,
  processing,
  selected,
  auth,
}: CountryReviewRowProps) => {
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

  const handleDeleteCountryReview = () => {
    handleCloseActions()
    onDelete([countryReview.id])
  }

  const handleDetailCountryReview = () => {
    handleCloseActions()
    onDetailCountryReview(countryReview)
  }

  const handleEditCountryReview = () => {
    handleCloseActions()
    onEdit(countryReview)
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={index}
      selected={selected}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      {console.log('Only template row', index)}
      <TableCell
        key={`Id${countryReview.id}`}
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
            onClick={() => onCheck(countryReview.id)}
          />
        )}
      </TableCell>
      <TableCell key={`title${countryReview.id}`}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <AccessTimeFilledIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {countryReview.title}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {countryReview.year}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell key={`dates${countryReview.id}`} align="center">
        <Box sx={{ alignItems: 'center' }}>
          <Typography>{dateToString(countryReview?.start)}</Typography>
          <Typography color="textSecondary">
            {dateToString(countryReview?.end)}
          </Typography>
        </Box>
      </TableCell>
      <TableCell key={`Status${countryReview.id}`} align="center">
        <Chip
          color={
            countryReview.status === AssessmentStatusEnum.Progress
              ? 'primary'
              : countryReview.status === AssessmentStatusEnum.Deleted
              ? 'error'
              : 'default'
          }
          label={countryReview.status}
        />
      </TableCell>
      {/* <TableCell key={`core${countryReview.id}`} align="center">
        {countryReview.score}
      </TableCell> */}
      <TableCell
        key={`${countryReview.id}Actions`}
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="template-row-menu-button"
          aria-label="template actions"
          aria-controls="template-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="template-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="template-row-menu-button"
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
            <MenuItem onClick={handleEditCountryReview}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>{' '}
              {t(
                'institutionalization:countryReviewManagement.countryReviewTable.actions.edit'
              )}
            </MenuItem>
          )}
          {authorization(
            auth.role,
            pathComponent,
            'menu.delete',
            accessType.Enable
          ) && (
            <MenuItem onClick={handleDeleteCountryReview}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>{' '}
              {t(
                'institutionalization:countryReviewManagement.countryReviewTable.actions.delete'
              )}
            </MenuItem>
          )}
          <MenuItem onClick={handleDetailCountryReview}>
            <ListItemIcon>
              <WorkspacesIcon />
            </ListItemIcon>{' '}
            {t(
              'institutionalization:countryReviewManagement.countryReviewTable.actions.details'
            )}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
}
// #endregion

type CountryReviewProps = {
  processing: boolean
  countryReviews?: IInstitutionalizationCountryReview[]
  onEdit: (countryReview: IInstitutionalizationCountryReview) => void
  onDelete: (countryReviewIds: string[]) => void
  onDetailCountryReview: (
    countryReview: IInstitutionalizationCountryReview
  ) => void
  onSelectedChange: (selected: string[]) => void
  selected: string[]
  auth: ILocalUserInfo
  countries?: ICountry[]
}

const countryReviewTable = ({
  processing,
  countryReviews = [],
  onEdit,
  onDelete,
  onDetailCountryReview,
  onSelectedChange,
  selected,
  auth,
  countries = [],
}: CountryReviewProps): JSX.Element => {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(countryReviews)
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

  if (countryReviews.length === 0) {
    return <Empty title="No institutionalization countryReviews yet" />
  }

  const [selectedCountryId, setSelectedCountryId] = useState('all')
  const [filteredCountryReviewsList, setFilteredCountryReviewsList] = useState<
    IInstitutionalizationCountryReview[]
  >([])
  const [countryReviewsList, setCountryReviewsList] = useState<
    IInstitutionalizationCountryReview[]
  >([])

  const handleDaterangeChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value as string
    setSelectedCountryId(selectedId)
  }

  useEffect(() => {
    setCountryReviewsList(countryReviews)
    setFilteredCountryReviewsList(countryReviews)
  }, [countryReviews])

  useEffect(() => {
    if (selectedCountryId === 'all') {
      setFilteredCountryReviewsList(countryReviewsList)
    } else {
      const filteredList: IInstitutionalizationCountryReview[] =
        countryReviewsList?.filter(
          (countryReview) => countryReview.countryId === selectedCountryId
        ) || []
      setFilteredCountryReviewsList(filteredList)
    }
  }, [selectedCountryId, countryReviewsList])

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
                  (country) => country?.id === selectedCountryId
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
                countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
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
            rowCount={countryReviews.length}
            auth={auth}
          />
          <TableBody>
            {filteredCountryReviewsList &&
              filteredCountryReviewsList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((countryReview, countryReviewIndex) => {
                  return (
                    <>
                      <CountryReviewRow
                        key={countryReviewIndex}
                        index={countryReviewIndex}
                        countryReview={countryReview}
                        onCheck={handleClick}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDetailCountryReview={onDetailCountryReview}
                        processing={processing}
                        selected={isSelected(countryReview.id)}
                        auth={auth}
                      />
                    </>
                  )
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCountryReviewsList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

//#endregion

export default countryReviewTable

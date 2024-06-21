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
import { ILocalUserInfo } from '../../auth/interfacesAndTypes/userInfo'
import { accessType, authorization } from '../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../baseUser/config/styles'
import {
  ILanguage,
  ILanguageTableHeadCell,
  LanguageStatusEnum,
} from '../interfacesAndTypes/language'

const headCells: ILanguageTableHeadCell[] = [
  {
    key: 'name',
    align: 'left',
    label: 'languages:languageManagement.table.headers.name',
  },
  {
    key: 'description',
    align: 'left',
    label: 'languages:languageManagement.table.headers.description',
  },
  {
    key: 'direction',
    align: 'center',
    label: 'languages:languageManagement.table.headers.direction',
  },
  {
    key: 'recaptchaLanguageCode',
    align: 'center',
    label: 'languages:languageManagement.table.headers.recaptchaLanguageCode',
  },
  {
    key: 'status',
    align: 'center',
    label: 'languages:languageManagement.table.headers.status',
  },
]

const pathComponent = 'languages.components.LanguageTable'

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
                'aria-label': 'select all languages',
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
          {t('languages:languageManagement.table.headers.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

type LanguagesRowProps = {
  index: number
  onCheck: (id: string) => void
  onDelete: (languageIds: string[]) => void
  onEdit: (language: ILanguage) => void
  processing: boolean
  selected: boolean
  language: ILanguage
  auth: ILocalUserInfo
}

const LanguagesRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
  language,
  auth,
}: LanguagesRowProps) => {
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
    onDelete([language.id])
  }

  const handleEdit = () => {
    handleCloseActions()
    onEdit(language)
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={language.id}
      selected={selected}
      sx={{ '& td': { bgcolor: 'background.paper' } }}
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
            onClick={() => onCheck(language.id)}
          />
        )}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <FlagCircleIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {language.name}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {language.code}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">{language.description}</TableCell>
      <TableCell align="center">{language.direction}</TableCell>
      <TableCell align="center">{language.recaptchaLanguageCode}</TableCell>
      <TableCell align="center">
        {language.status === LanguageStatusEnum.Active ? (
          <Chip color="primary" label="Active" />
        ) : (
          <Chip label={language.status} />
        )}
      </TableCell>
      <TableCell
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="language-row-menu-button"
          aria-label="language actions"
          aria-controls="language-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="language-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="language-row-menu-button"
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

type LanguagesTableProps = {
  processing: boolean
  onDelete: (languageIds: string[]) => void
  onEdit: (language: ILanguage) => void
  onSelectedChange: (selected: string[]) => void
  selected: string[]
  languages?: ILanguage[]
  auth: ILocalUserInfo
}

const LanguagesTable = ({
  onDelete,
  onEdit,
  onSelectedChange,
  processing,
  selected,
  languages = [],
  auth,
}: LanguagesTableProps): JSX.Element => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(languages)
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

  if (languages.length === 0) {
    return <Empty title="No language yet" />
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
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={languages.length}
            auth={auth}
          />
          <TableBody>
            {languages
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((language, index) => (
                <LanguagesRow
                  index={index}
                  key={language.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  processing={processing}
                  selected={isSelected(language.id)}
                  language={language}
                  auth={auth}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={languages.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

export default LanguagesTable

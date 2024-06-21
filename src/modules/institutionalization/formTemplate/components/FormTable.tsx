import AssignmentIcon from '@mui/icons-material/Assignment'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
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

import Empty from '../../../../core/components/Empty'
import * as selectUtils from '../../../../core/utils/selectUtils'
import { dateToString } from '../../../../utils/helper'
import { ILocalUserInfo } from '../../../auth/interfacesAndTypes/userInfo'
import {
  accessType,
  authorization,
} from '../../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../../baseUser/config/styles'
import {
  FormStatusEnum,
  IFormTableHeadCell,
  IInstitutionalizationForm,
} from '../interfacesAndTypes/forms'

const headCells: IFormTableHeadCell[] = [
  {
    key: 'template',
    align: 'left',
    label: 'institutionalization:formManagement.formTable.headers.formName',
  },
  {
    key: 'date',
    align: 'center',
    label: 'institutionalization:formManagement.formTable.headers.date',
  },
  {
    key: 'status',
    align: 'center',
    label: 'institutionalization:formManagement.formTable.headers.status',
  },
]

const pathComponent = 'institutionalization.formTemplate.components.FormTable'

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
                'aria-label': 'select all institutionalization forms',
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

//#region Forms Row

type FormRowProps = {
  index: number
  form: IInstitutionalizationForm
  onCheck: (id: string) => void
  onEditForm: (form: IInstitutionalizationForm) => void
  onDeleteForms: (formIds: string[]) => void
  onDetailForm: (form: IInstitutionalizationForm) => void
  processing: boolean
  selected: boolean
  auth: ILocalUserInfo
  t: any
}

const FormRow = ({
  index,
  form,
  onCheck,
  onEditForm,
  onDeleteForms,
  onDetailForm,
  processing,
  selected,
  auth,
  t,
}: FormRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const labelId = `enhanced-table-checkbox-${index}`
  const openActions = Boolean(anchorEl)

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseActions = () => {
    setAnchorEl(null)
  }

  const handleDeleteForms = () => {
    handleCloseActions()
    onDeleteForms([form.id])
  }

  const handleAddModule = () => {
    handleCloseActions()
    onDetailForm(form)
  }

  const handleEditForm = () => {
    handleCloseActions()
    onEditForm(form)
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={`row${form.id}${index}`}
      selected={selected}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        key={`Id${form.id}`}
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
            onClick={() => onCheck(form.id)}
          />
        )}
      </TableCell>
      <TableCell key={`Name${form.id}`}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <AssignmentIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {form.version}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {form.title}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell key={`Date${form.id}`} align="center">
        {dateToString(form?.date)}
      </TableCell>
      <TableCell key={`Status${form.id}`} align="center">
        <Chip
          color={
            form.status === FormStatusEnum.Active
              ? 'primary'
              : form.status === FormStatusEnum.Deleted
              ? 'error'
              : 'default'
          }
          label={form.status}
        />
      </TableCell>
      <TableCell
        key={`Actions${form.id}`}
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="form-row-menu-button"
          aria-label="form actions"
          aria-controls="form-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="form-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="form-row-menu-button"
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
            <MenuItem onClick={handleEditForm}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>{' '}
              {t('institutionalization:formManagement.formTable.actions.edit')}
            </MenuItem>
          )}
          {authorization(
            auth.role,
            pathComponent,
            'menu.delete',
            accessType.Enable
          ) && (
            <MenuItem onClick={handleDeleteForms}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>{' '}
              {t(
                'institutionalization:formManagement.formTable.actions.delete'
              )}
            </MenuItem>
          )}
          {authorization(
            auth.role,
            pathComponent,
            'menu.details',
            accessType.Enable
          ) && (
            <MenuItem onClick={handleAddModule}>
              <ListItemIcon>
                <WorkspacesIcon />
              </ListItemIcon>{' '}
              {t(
                'institutionalization:formManagement.formTable.actions.details'
              )}
            </MenuItem>
          )}
        </Menu>
      </TableCell>
    </TableRow>
  )
}

//#endregion

//#region Main Forms Table

type FormTableProps = {
  processing: boolean
  forms?: IInstitutionalizationForm[]
  onEditForm: (form: IInstitutionalizationForm) => void
  onDeleteForms: (formIds: string[]) => void
  onDetailForm: (form: IInstitutionalizationForm) => void
  onSelectedChange: (selected: string[]) => void
  selected: string[]
  auth: ILocalUserInfo
}

const FormTable = ({
  processing,
  forms = [],
  onEditForm,
  onDeleteForms,
  onDetailForm,
  onSelectedChange,
  selected,
  auth,
}: FormTableProps): JSX.Element => {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(forms)
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

  if (forms.length === 0) {
    return <Empty title="No institutionalization forms yet" />
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
            rowCount={forms.length}
            auth={auth}
          />
          <TableBody>
            {forms
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((form, formIndex) => {
                return (
                  <FormRow
                    key={`${formIndex}`}
                    index={formIndex}
                    form={form}
                    onCheck={handleClick}
                    onEditForm={onEditForm}
                    onDeleteForms={onDeleteForms}
                    onDetailForm={onDetailForm}
                    processing={processing}
                    selected={isSelected(form.id)}
                    t={t}
                    auth={auth}
                  />
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage={t('common:admin.pagination.labelRowsPerPage')}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={forms.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

//#endregion

export default FormTable

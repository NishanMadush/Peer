import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonIcon from '@mui/icons-material/Person'
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
  IOrganization,
  IOrganizationBranch,
  IOrganizationTableHeadCell,
} from '../interfacesAndTypes/organization'

const headCells: IOrganizationTableHeadCell[] = [
  {
    key: 'branchName',
    align: 'left',
    label: 'organizations:branchManagement.table.headers.branchName',
  },
  {
    key: 'contactPerson',
    align: 'center',
    label: 'organizations:branchManagement.table.headers.contactPerson',
  },
  {
    key: 'city',
    align: 'center',
    label: 'organizations:branchManagement.table.headers.city',
  },
]

const pathComponent = 'organizations.components.BranchTable'

interface EnhancedTableProps {
  numSelected: number
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
  auth: ILocalUserInfo
}

function EnhancedTableHead({
  onSelectAllClick,
  auth,
  numSelected,
  rowCount,
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
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all branches',
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

type BranchRowProps = {
  index: number
  onCheck: (id: string) => void
  onDeleteBranch: (branchId: string) => void
  onEditBranch: (branch: IOrganizationBranch) => void
  processing: boolean
  selected: boolean
  branch: IOrganizationBranch
  auth: ILocalUserInfo
}

const BranchRow = ({
  index,
  onCheck,
  onDeleteBranch,
  onEditBranch,
  processing,
  selected,
  branch,
  auth,
}: BranchRowProps) => {
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
    onDeleteBranch(branch._id)
  }

  const handleEdit = () => {
    handleCloseActions()
    onEditBranch(branch)
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={branch._id}
      selected={selected}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        padding="checkbox"
        // sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
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
            onClick={() => onCheck(branch._id)}
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
              {branch.branchName}
            </Typography>
            {branch.isHeadOffice === true ? (
              <Chip
                color="primary"
                label={t(
                  'organizations:organizationManagement.topic.headOffice.label'
                )}
                disabled={processing}
              />
            ) : (
              <Chip
                color="default"
                label={t(
                  'organizations:organizationManagement.topic.branch.label'
                )}
                disabled={processing}
              />
            )}
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography>{branch.contactPerson} </Typography>
        <Typography>
          {branch.phoneNumber} | {branch.email}
        </Typography>
      </TableCell>
      {/* <TableCell align="center">
        {branch.isVirtual === true
          ? t('common:common.yes')
          : t('common:common.no')}
      </TableCell> */}
      <TableCell align="center"> {branch?.address?.city} </TableCell>
      <TableCell
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        {/* {authorization(
          auth.role,
          'organizations_components_BranchTable',
          'branch actions_ok',
          accessType.Enable
        ) && ( */}
        <IconButton
          id="branch-row-menu-button"
          aria-label="branch actions"
          aria-controls="branch-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        {/* )} */}
        <Menu
          id="branch-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="branch-row-menu-button"
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

type BranchTableProps = {
  processing: boolean
  onDeleteBranch: (branchId: string) => void
  onEditBranch: (branch: IOrganizationBranch) => void
  onSelectedChange: (selected: string[]) => void
  selected: string[]
  organization: IOrganization
  auth: ILocalUserInfo
}

const BranchTable = ({
  onDeleteBranch,
  onEditBranch,
  onSelectedChange,
  processing,
  selected,
  organization,
  auth,
}: BranchTableProps): JSX.Element => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(organization.branches)
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

  if (!organization.branches) {
    return <Empty title="No institutionalization form modules yet" />
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
            rowCount={organization.branches.length}
            auth={auth}
          />
          <TableBody>
            {organization.branches
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((branch, index) => (
                <BranchRow
                  index={index}
                  key={branch._id}
                  onCheck={handleClick}
                  onDeleteBranch={onDeleteBranch}
                  onEditBranch={onEditBranch}
                  processing={processing}
                  selected={isSelected(branch._id)}
                  branch={branch}
                  auth={auth}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={organization.branches.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

export default BranchTable

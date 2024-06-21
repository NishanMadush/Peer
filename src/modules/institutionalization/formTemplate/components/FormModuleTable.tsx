import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import {
  Avatar,
  Box,
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
import { ILocalUserInfo } from '../../../auth/interfacesAndTypes/userInfo'
import {
  accessType,
  authorization,
} from '../../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../../baseUser/config/styles'
import {
  IFormTableHeadCell,
  IInstitutionalizationForm,
  IInstitutionalizationIndicator,
  IInstitutionalizationIndicatorSubQuestion,
  IInstitutionalizationModule,
} from '../interfacesAndTypes/forms'

const headCells: IFormTableHeadCell[] = [
  {
    key: 'weight',
    align: 'center',
    label: 'institutionalization:formManagement.formTable.headers.weight',
  },
]

const pathComponent =
  'institutionalization.formTemplate.components.FormModuleTable'
interface EnhancedTableProps {
  auth: ILocalUserInfo
}

function EnhancedTableHead({ auth }: EnhancedTableProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow key={-1} sx={{ '& th': { border: 0 } }}>
        <TableCell key="hdescription" align="left" sx={{ py: 0 }} colSpan={3}>
          {t(
            'institutionalization:formManagement.formTable.headers.description'
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.key} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell key="hactions" align="right" sx={{ py: 0 }}>
          {t('institutionalization:formManagement.formTable.headers.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

//#region Form Module row

type FormModuleRowProps = {
  index: number
  formId: string
  module: IInstitutionalizationModule
  onEditModule: (module: IInstitutionalizationModule) => void
  onDeleteModule: (moduleId: string) => void
  onAddIndicator: (module: Partial<IInstitutionalizationModule>) => void
  processing: boolean
  auth: ILocalUserInfo
}

const FormModuleRow = ({
  index,
  module,
  formId,
  onEditModule,
  onDeleteModule,
  onAddIndicator,
  processing,
  auth,
}: FormModuleRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const openActions = Boolean(anchorEl)

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseActions = () => {
    setAnchorEl(null)
  }

  const handleDeleteFormModule = () => {
    handleCloseActions()
    onDeleteModule(module._id)
  }

  const handleAddIndicator = () => {
    handleCloseActions()
    onAddIndicator(module)
  }

  const handleEditFormModule = () => {
    handleCloseActions()
    onEditModule(module)
  }

  return (
    <TableRow
      tabIndex={-1}
      key={index}
      sx={{
        '& td': {
          bgcolor: 'background.paper',
          border: 0,
        },
      }}
      style={{
        borderLeft: 10,
        marginLeft: 20,
        paddingLeft: 10,
      }}
    >
      <TableCell
        key={`Id${index}Module`}
        padding="checkbox"
        // sx={{
        //   borderTopLeftRadius: '1rem',
        //   borderBottomLeftRadius: '1rem',
        // }}
        sx={customStyles(elementStyle.TableRowStart)}
        colSpan={4}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <ViewModuleIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {module.moduleNo}
              {/* {t(
                `institutionalizationform:${formId}.modules.${index}.moduleNo`
              )} */}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {module.condition}
              {/* {t(
                `institutionalizationform:${formId}.modules.${index}.condition`
              )} */}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell
        key={`Action${module._id}Module`}
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
          <MenuItem onClick={handleEditFormModule}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>{' '}
            {t('common.edit')}
          </MenuItem>

          {authorization(
            auth.role,
            pathComponent,
            'button.deleteModule',
            accessType.Enable
          ) && (
            <MenuItem onClick={handleDeleteFormModule}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>{' '}
              {t('common.delete')}
            </MenuItem>
          )}
          <MenuItem onClick={handleAddIndicator}>
            <ListItemIcon>
              <WorkspacesIcon />
            </ListItemIcon>{' '}
            {t(
              'institutionalization:formManagement.formTable.actions.addIndicator'
            )}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
}
// #endregion

//#region Form Module Indicator row

type FormModuleIndicatorRowProps = {
  index: number
  formId: string
  moduleIndex: number
  indicator: IInstitutionalizationIndicator
  onEditFormModuleIndicator: (
    moduleIndex: number,
    indicator: IInstitutionalizationIndicator
  ) => void
  onDeleteFormModuleIndicator: (
    moduleIndex: number,
    indicatorId: string
  ) => void
  onAddFormModuleIndicatorSubQuestion: (
    moduleIndex: number,
    indicatorIndex: number
  ) => void
  processing: boolean
  auth: ILocalUserInfo
}

const FormModuleIndicatorRow = ({
  index,
  formId,
  moduleIndex,
  indicator,
  onEditFormModuleIndicator,
  onDeleteFormModuleIndicator,
  onAddFormModuleIndicatorSubQuestion,
  processing,
  auth,
}: FormModuleIndicatorRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const openActions = Boolean(anchorEl)

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseActions = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleCloseActions()
    onDeleteFormModuleIndicator(moduleIndex, indicator?._id)
  }

  const handleEdit = () => {
    handleCloseActions()
    onEditFormModuleIndicator(moduleIndex, indicator)
  }

  const handleAddSubQuestion = () => {
    handleCloseActions()
    onAddFormModuleIndicatorSubQuestion(moduleIndex, index)
  }

  return (
    <TableRow
      // aria-checked={selected}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        style={{ backgroundColor: '#ECEFF1', width: '0px' }}
      ></TableCell>
      <TableCell
        colSpan={2}
        // sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowStart)}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ mr: 3 }}>
            <ViewListIcon />
          </Avatar>
          <Box>
            <Typography component="div" variant="h6">
              {indicator.indicatorNo}
              {/* {t(
                `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${index}.indicatorNo`
              )} */}
            </Typography>
            <Typography color="textPrimary" variant="body1" mt={1}>
              {indicator.question}
              {/* {t(
                `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${index}.question`
              )} */}
            </Typography>
            <Typography color="textSecondary" variant="body2" mt={2}>
              {indicator.description}
              {/* {t(
                `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${index}.description`
              )} */}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell valign="top">
        <Typography color="textSecondary" variant="body2">
          {indicator.weight}
          {/* {t(
            `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${index}.weight`
          )} */}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="group-row-menu-button"
          aria-label="group actions"
          aria-controls="group-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="group-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="group-row-menu-button"
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
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>{' '}
            {t('common.edit')}
          </MenuItem>
          {authorization(
            auth?.role,
            pathComponent,
            'button.deleteModuleIndicator',
            accessType.Enable
          ) && (
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>{' '}
              {t('common.delete')}
            </MenuItem>
          )}
          <MenuItem onClick={handleAddSubQuestion}>
            <ListItemIcon>
              <WorkspacesIcon />
            </ListItemIcon>{' '}
            {t(
              'institutionalization:formManagement.formTable.actions.addSubQuestion'
            )}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
}

// #endregion

//#region Form Module Indicator Sub-Question row

type FormModuleIndicatorSubQuestionRowProps = {
  index: number
  formId: string
  moduleIndex: number
  indicatorIndex: number
  subQuestion: IInstitutionalizationIndicatorSubQuestion
  onEditFormModuleSubQuestion: (
    moduleIndex: number,
    indicatorIndex: number,
    subQuestion: any
  ) => void
  onDeleteFormSubQuestion: (
    moduleIndex: number,
    indicatorIndex: number,
    subQuestionId: string
  ) => void
  processing: boolean
  auth: ILocalUserInfo
}

const FormModuleIndicatorSubQuestionRow = ({
  index,
  formId,
  moduleIndex,
  indicatorIndex,
  subQuestion,
  onEditFormModuleSubQuestion,
  onDeleteFormSubQuestion,
  processing,
  auth,
}: FormModuleIndicatorSubQuestionRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const openActions = Boolean(anchorEl)

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseActions = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleCloseActions()
    onDeleteFormSubQuestion(moduleIndex, indicatorIndex, subQuestion._id)
  }

  const handleEdit = () => {
    handleCloseActions()
    onEditFormModuleSubQuestion(moduleIndex, indicatorIndex, subQuestion)
  }

  return (
    <TableRow
      // aria-checked={selected}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        style={{ backgroundColor: '#ECEFF1', width: '0px' }}
      ></TableCell>
      <TableCell
        style={{ backgroundColor: '#ECEFF1', width: '0px' }}
      ></TableCell>
      <TableCell
        // sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowStart)}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ mr: 3 }}>
            <ViewHeadlineIcon />
          </Avatar>
          <Box>
            {/* <Typography component="div" variant="h6" mb={1}>
              {subQuestion.subQuestion}
            </Typography> */}
            <Typography color="textPrimary" variant="body1">
              {subQuestion.subQuestion}
              {/* {t(
                `institutionalizationform:${formId}.modules.${moduleIndex}.indicators.${indicatorIndex}.subQuestions.${index}.subQuestion`
              )} */}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell></TableCell>
      <TableCell
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        <IconButton
          id="group-row-menu-button"
          aria-label="group actions"
          aria-controls="group-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="group-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="group-row-menu-button"
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
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>{' '}
            {t('common.edit')}
          </MenuItem>
          {authorization(
            auth?.role,
            pathComponent,
            'button.deleteModuleIndicatorSubQuestion',
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

// #endregion

//#region Form Modules Table

type FormModuleTableProps = {
  processing: boolean
  form: IInstitutionalizationForm
  onEditModule: (formModule: IInstitutionalizationModule) => void
  onDeleteModule: (moduleId: string) => void
  onAddIndicator: (formModule: Partial<IInstitutionalizationIndicator>) => void
  onEditIndicator: (
    moduleIndex: number,
    formIndicator: IInstitutionalizationIndicator
  ) => void
  onDeleteIndicator: (moduleIndex: number, indicatorId: string) => void
  onAddSubQuestion: (moduleIndex: number, indicatorIndex: number) => void
  onEditSubQuestion: (
    moduleIndex: number,
    indicatorIndex: number,
    subQuestion: IInstitutionalizationIndicatorSubQuestion
  ) => void
  onDeleteSubQuestion: (
    moduleIndex: number,
    indicatorIndex: number,
    subQuestionId: string
  ) => void
  auth: ILocalUserInfo
}

const FormModuleTable = ({
  processing,
  form,
  onEditModule,
  onDeleteModule,
  onAddIndicator,
  onEditIndicator,
  onDeleteIndicator,
  onAddSubQuestion,
  onEditSubQuestion,
  onDeleteSubQuestion,
  auth,
}: FormModuleTableProps): JSX.Element => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(1)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (!form.modules) {
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
          <EnhancedTableHead auth={auth} />
          <TableBody>
            {form.modules
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((module, moduleIndex) => {
                return (
                  <>
                    {/* Show modules */}
                    <FormModuleRow
                      key={`${moduleIndex + page * rowsPerPage}`}
                      index={moduleIndex + page * rowsPerPage}
                      formId={form.id}
                      module={module}
                      onEditModule={onEditModule}
                      onDeleteModule={onDeleteModule}
                      onAddIndicator={onAddIndicator}
                      processing={processing}
                      auth={auth}
                    />
                    {module.indicators.map((indicator, indicatorIndex) => {
                      return (
                        <>
                          {/* Show indicators */}
                          <FormModuleIndicatorRow
                            key={`${moduleIndex}${indicatorIndex}`}
                            index={indicatorIndex}
                            formId={form.id}
                            moduleIndex={moduleIndex + page * rowsPerPage}
                            indicator={indicator}
                            onEditFormModuleIndicator={onEditIndicator}
                            onDeleteFormModuleIndicator={onDeleteIndicator}
                            processing={processing}
                            onAddFormModuleIndicatorSubQuestion={
                              onAddSubQuestion
                            }
                            auth={auth}
                          />

                          {indicator.subQuestions.map(
                            (subQuestion, subQuestionIndex) => (
                              // Show sub questions
                              <FormModuleIndicatorSubQuestionRow
                                key={`${moduleIndex}${indicatorIndex}${subQuestionIndex}`}
                                index={subQuestionIndex}
                                formId={form.id}
                                moduleIndex={moduleIndex + page * rowsPerPage}
                                indicatorIndex={indicatorIndex}
                                subQuestion={subQuestion}
                                onEditFormModuleSubQuestion={onEditSubQuestion}
                                onDeleteFormSubQuestion={onDeleteSubQuestion}
                                processing={processing}
                                auth={auth}
                              />
                            )
                          )}
                        </>
                      )
                    })}
                  </>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        // labelRowsPerPage={t(
        //   'institutionalization:formManagement.formModuleDialog.pagination.labelRowsPerPage'
        // )}
        rowsPerPageOptions={[1, 5, 10]}
        component="div"
        count={form.modules.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

//#endregion

export default FormModuleTable

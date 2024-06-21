import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import BarChartIcon from '@mui/icons-material/BarChart'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PrintIcon from '@mui/icons-material/Print'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import {
  Avatar,
  Box,
  Card,
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
import lodash, { groupBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Empty from '../../../../core/components/Empty'
import * as selectUtils from '../../../../core/utils/selectUtils'
import { dateToString } from '../../../../utils/helper'
import { useAuth } from '../../../auth/contexts/AuthProvider'
import { ILocalUserInfo } from '../../../auth/interfacesAndTypes/userInfo'
import {
  accessType,
  authorization,
} from '../../../baseUser/config/authorization'
import { customStyles, elementStyle } from '../../../baseUser/config/styles'
import { DefaultUsers } from '../../../baseUser/constants/helper'
import { ROOT_ROUTE } from '../../../baseUser/constants/routes'
import { useCountries } from '../../../countries/hooks/useCountries'
import { ICountry } from '../../../countries/interfacesAndTypes/country'
import { useOrganizations } from '../../../organizations/hooks/useOrganizations'
import { IOrganization } from '../../../organizations/interfacesAndTypes/organization'
import { useCountryReviews } from '../../countryReview/hooks/useCountryReviews'
import { INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE } from '../../print/constants/routes'
import {
  AssessmentStatusEnum,
  IInstitutionalizationCountryReview,
  IInstitutionalizationOrganization,
  IOrganizationAssessmentTableHeadCell,
} from '../interfacesAndTypes/organization'

const headCells: IOrganizationAssessmentTableHeadCell[] = [
  {
    key: 'title',
    align: 'left',
    label:
      'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.headers.title',
  },
  {
    key: 'Status',
    align: 'left',
    label:
      'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.headers.status',
  },
  {
    key: 'Score',
    align: 'left',
    label:
      'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.headers.score',
  },
]

const pathComponent =
  'institutionalization.organizationAssessment.components.AssessmentHistoryTable'

interface EnhancedTableProps {
  numSelected: number
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
}

function EnhancedTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
}: EnhancedTableProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow key={-1} sx={{ '& th': { border: 0 } }}>
        <TableCell key="selectCheckbox" sx={{ py: 0 }}></TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.key} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell key="actions" align="right" sx={{ py: 0 }}>
          {t(
            'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.headers.actions'
          )}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

type AssessmentCountryReviewIdRowProps = {
  organizationCountryReviewId: string
  organizationCountryReviews: IInstitutionalizationOrganization[]
  countryReview: IInstitutionalizationCountryReview | undefined
  countries?: ICountry[]
  onCheck: (id: string) => void
  processing: boolean
  onDrawChartReview: (data: IInstitutionalizationOrganization[]) => void
}

const AssessmentCountryReviewIdRow = ({
  organizationCountryReviewId,
  organizationCountryReviews,
  countryReview,
  countries = [],
  onCheck,
  processing,
  onDrawChartReview,
}: AssessmentCountryReviewIdRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const openActions = Boolean(anchorEl)
  const [score, setScore] = useState(0)

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseActions = () => {
    setAnchorEl(null)
  }

  const handleDeleteAssessmentHistory = () => {
    handleCloseActions()
  }

  const handleEditAssessmentHistory = () => {
    handleCloseActions()
  }

  useEffect(() => {
    const completeAssessments = lodash.filter(organizationCountryReviews, {
      status: AssessmentStatusEnum.Complete,
    })

    if (completeAssessments.length > 0) {
      const sumScores = lodash.sumBy(
        completeAssessments,
        'institutionalization.score'
      )

      console.log('$%^', sumScores)
      const score = sumScores / completeAssessments.length
      setScore(score)
    } else {
      setScore(0)
    }
  }, [organizationCountryReviews])

  return (
    <TableRow
      tabIndex={-1}
      key={organizationCountryReviewId}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        key={`Id${organizationCountryReviewId}`}
        padding="checkbox"
        // sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowStart)}
        colSpan={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3 }}>
            <AccessTimeFilledIcon />
          </Avatar>
          <Box>
            {countries &&
              countries.map((userCountry) => {
                if (userCountry.id === countryReview?.countryId) {
                  return (
                    <Typography
                      key={userCountry.id}
                      component="div"
                      variant="h6"
                    >
                      {userCountry.name}
                    </Typography>
                  )
                }

                return null
              })}
            <Typography component="div" variant="h6">
              {countryReview?.title}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              Year - {countryReview?.year}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {dateToString(countryReview?.start)}-
              {dateToString(countryReview?.end)}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell key={`Status${organizationCountryReviewId}`}>
        <Chip
          color={
            countryReview?.status === AssessmentStatusEnum.Progress
              ? 'primary'
              : 'default'
          }
          label={countryReview?.status ?? AssessmentStatusEnum.Pending}
          disabled={processing}
          size="small"
          sx={{ marginTop: -3 }}
        />
      </TableCell>

      <TableCell key={`Score${organizationCountryReviewId}`}>
        {score.toFixed(2)}
      </TableCell>

      <TableCell
        key={`Actions${organizationCountryReviewId}`}
        align="right"
        // sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowEnd)}
      >
        {/* <IconButton
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
          <MenuItem
            onClick={() => {
              onDrawChartReview(organizationCountryReviews)
            }}
          >
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>{' '}
            Graph
          </MenuItem>
        </Menu> */}
      </TableCell>
    </TableRow>
  )
}

type AssessmentHistoryRowProps = {
  index: number
  organizationAssessment: IInstitutionalizationOrganization
  onCheck: (id: string) => void
  organizations?: IOrganization[]
  onDetailAssessmentHistory: (id: string) => void
  processing: boolean
  selected: boolean
}

const AssessmentHistoryRow = ({
  index,
  organizationAssessment,
  onCheck,
  organizations = [],
  onDetailAssessmentHistory,
  processing,
  selected,
}: AssessmentHistoryRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const openActions = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseActions = () => {
    setAnchorEl(null)
  }

  const handlePrintAssessment = () => {
    navigate(
      `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE}/${organizationAssessment?.id}/report`
    )
  }

  const handleDetailAssessmentHistory = () => {
    onDetailAssessmentHistory(organizationAssessment.id)
  }

  const handleGraphAssessment = () => {
    navigate(
      `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_PRINT_ROUTE}/${organizationAssessment?.id}/graph`
    )
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={index}
      selected={selected}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell style={{ backgroundColor: '#ECEFF1' }}></TableCell>

      <TableCell
        key={`Name${organizationAssessment.id}`}
        // sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
        sx={customStyles(elementStyle.TableRowStart)}
      >
        <Box sx={{ display: 'flex', alignItems: 'left' }}>
          <Avatar sx={{ mr: 3 }}>
            <BorderColorIcon />
          </Avatar>
          <Box>
            {organizations &&
              organizations.map((userOrganization) => {
                if (
                  userOrganization.id === organizationAssessment?.organizationId
                ) {
                  return (
                    <Typography
                      key={userOrganization.id}
                      component="div"
                      variant="h6"
                    >
                      {userOrganization?.name}
                    </Typography>
                  )
                }
                // If there's no match, you may choose to return null or handle the case accordingly
                return null
              })}
            <Typography component="div" variant="h6">
              {organizationAssessment.trainingComponent}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {dateToString(organizationAssessment?.complete)}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell key={`Status${organizationAssessment.id}`}>
        <Chip
          color={
            organizationAssessment.status === AssessmentStatusEnum.Progress
              ? 'primary'
              : 'default'
          }
          label={organizationAssessment.status ?? AssessmentStatusEnum.Pending}
          disabled={processing}
          size="small"
          sx={{ marginTop: -3 }}
        />
      </TableCell>
      <TableCell key={`Score${organizationAssessment.id}`}>
        {organizationAssessment?.status === AssessmentStatusEnum.Complete
          ? organizationAssessment?.institutionalization?.score
          : ''}
      </TableCell>
      <TableCell
        key={`Actions${organizationAssessment.id}`}
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
          {organizationAssessment?.status === AssessmentStatusEnum.Complete && (
            <>
              <MenuItem onClick={handleGraphAssessment}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>{' '}
                {t(
                  'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.actions.graph'
                )}
              </MenuItem>
              <MenuItem onClick={handlePrintAssessment}>
                <ListItemIcon>
                  <PrintIcon />
                </ListItemIcon>{' '}
                {t(
                  'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.actions.print'
                )}
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleDetailAssessmentHistory}>
            <ListItemIcon>
              <WorkspacesIcon />
            </ListItemIcon>{' '}
            {t(
              'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.actions.details'
            )}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
}
// #endregion
type AssessmentHistoryProps = {
  processing: boolean
  organizationAssessments?: IInstitutionalizationOrganization[]
  countryReviews?: IInstitutionalizationCountryReview[]
  countries?: ICountry[]
  organizations?: IOrganization[]
  auth: ILocalUserInfo
  // onEdit: (organizationAssessment: IInstitutionalizationOrganization) => void
  // onDelete: (organizationassessmentIds: string[]) => void
  onDetailAssessmentHistory: (assessmentId: string) => void
  onSelectedChange: (selected: string[]) => void
  selected: string[]
  onDrawChart: (data: IInstitutionalizationOrganization[]) => void
}

const AssessmentHistoryTable = ({
  processing,
  organizationAssessments = [],
  countryReviews = [],
  countries = [],
  organizations = [],
  auth,
  // onEdit,
  // onDelete,
  onDetailAssessmentHistory,
  onSelectedChange,
  selected,
  onDrawChart,
}: AssessmentHistoryProps): JSX.Element => {
  const { userInfo } = useAuth()
  const { t } = useTranslation()
  // const { data: dataCountryReviews } = useCountryReviews()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(organizationAssessments)
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

  if (organizationAssessments.length === 0) {
    return (
      <Empty title="No institutionalization organization assessments yet" />
    )
  }
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [filteredAssessmentsList, setFilteredAssessmentsList] = useState<
    IInstitutionalizationOrganization[]
  >([])
  const [assessmentsList, setAssessmentsList] = useState<
    IInstitutionalizationOrganization[]
  >([])
  const [showCountryFilter, setShowCountryFilter] = useState(true)

  const handleDaterangeChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value as string
    setSelectedCountry(selectedId)
  }

  useEffect(() => {
    if (organizationAssessments) {
      // Filter by selected countryId if it is not 'all'
      const filteredList =
        selectedCountry !== 'all'
          ? organizationAssessments.filter(
              (assessment) => assessment.countryId === selectedCountry
            )
          : organizationAssessments

      // Set the filtered assessments list
      setFilteredAssessmentsList(filteredList)
      setShowCountryFilter(selectedCountry === 'all')

      // Now group the filtered assessments list
      const groupedAssessments = groupBy(filteredList, 'countryReviewId')
      setAssessmentsList(Object.values(groupedAssessments).flat())
    }

    // Show or hide the country filter based on whether data is filtered
  }, [organizationAssessments, selectedCountry])

  const uniqueCountryReviewIds = Array.from(
    new Set(
      filteredAssessmentsList.map((assessment) => assessment.countryReviewId)
    )
  )

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
              value={selectedCountry}
              onChange={handleDaterangeChange}
              displayEmpty
              renderValue={(selected) => {
                if (selectedCountry === 'all') {
                  return <em>{t('common.country.filter')}</em>
                }
                const selectedCountryObj = countries?.find(
                  (country) => country?.id === selectedCountry
                )
                return selectedCountryObj ? (
                  selectedCountryObj.name
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
          {/* Table header */}
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={organizationAssessments.length}
          />
          <TableBody>
            {/* Iterate through unique countryReviewIds */}
            {uniqueCountryReviewIds
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((countryReviewId) => {
                const assessmentsForCountry = filteredAssessmentsList.filter(
                  (assessment) => assessment.countryReviewId === countryReviewId
                )

                return (
                  <React.Fragment key={`country-review-${countryReviewId}`}>
                    {/* Display the country review ID row */}
                    <AssessmentCountryReviewIdRow
                      organizationCountryReviewId={countryReviewId}
                      organizationCountryReviews={assessmentsForCountry}
                      countryReview={lodash.find(countryReviews, {
                        id: countryReviewId,
                      })}
                      onCheck={handleClick}
                      processing={processing}
                      countries={countries}
                      onDrawChartReview={onDrawChart}
                    />
                    {/* Display the assessments for the country review ID */}
                    {assessmentsForCountry.map((assessment, index) => (
                      <AssessmentHistoryRow
                        key={`assessment-${index}`}
                        index={index}
                        organizationAssessment={assessment}
                        onCheck={handleClick}
                        onDetailAssessmentHistory={onDetailAssessmentHistory}
                        processing={processing}
                        selected={isSelected(assessment.countryReviewId)}
                        organizations={organizations}
                      />
                    ))}
                  </React.Fragment>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage={t(
          'institutionalization:organizationAssessmentManagement.assessmentHistoryTable.pagination.labelRowsPerPage'
        )}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAssessmentsList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

//#endregion

export default AssessmentHistoryTable

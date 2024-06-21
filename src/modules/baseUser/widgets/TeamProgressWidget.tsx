import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { IOrganizationOverviewItem } from '../../../shared/interfaces/dashboard'
import data from '../hooks/dashboard.json'

// const teams = [
//   {
//     id: '1',
//     color: 'primary.main',
//     name: 'Marketing Team',
//     progress: 75,
//     value: 122,
//   },
//   {
//     id: '2',
//     color: 'warning.main',
//     name: 'Operations Team',
//     progress: 50,
//     value: 82,
//   },
//   {
//     id: '3',
//     color: 'error.main',
//     name: 'Sales Team',
//     progress: 25,
//     value: 39,
//   },
//   {
//     id: '4',
//     color: 'text.secondary',
//     name: 'Research Team',
//     progress: 10,
//     value: 9,
//   },
// ]

const getPercentage = (score: number) => {
  return (score / 5) * 100
}

type TeamProgressWidgetProps = {
  organizationOverview: IOrganizationOverviewItem[]
}

const TeamProgressWidget = ({
  organizationOverview,
}: TeamProgressWidgetProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader title={t('dashboard.teams.title')} />
      <CardContent sx={{ px: 2 }}>
        <TableContainer>
          <Table
            aria-label="team progress table"
            size="small"
            sx={{
              '& td, & th': {
                border: 0,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t('dashboard.teams.columns.team')}</TableCell>
                <TableCell>{t('dashboard.teams.columns.progress')}</TableCell>
                <TableCell align="center">
                  {t('dashboard.teams.columns.value')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizationOverview.map((org, orgIndex) => (
                <TableRow key={orgIndex}>
                  <TableCell>
                    <Typography color="text.secondary" component="div">
                      {org.organization}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 3 }}>
                        <LinearProgress
                          aria-label={`${org.organization} progress`}
                          color="inherit"
                          sx={{ color: 'primary.main' }}
                          value={getPercentage(org.averageScore)}
                          variant="determinate"
                        />
                      </Box>
                      {/* <Box sx={{ minWidth: 35 }}>
                        <Typography
                          component="span"
                          variant="h6"
                          color="primary.main"
                        >{`${getPercentage(org.progress)}%`}</Typography>
                      </Box> */}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{org.averageScore}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default TeamProgressWidget

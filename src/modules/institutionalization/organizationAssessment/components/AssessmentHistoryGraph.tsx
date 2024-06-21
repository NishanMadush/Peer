import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import lodash from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Legend,
  PolarAngleAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import Empty from '../../../../core/components/Empty'
import { IInstitutionalizationOrganization } from '../../../../shared/interfaces/institutionalization'

interface IGraphPoint {
  moduleNo: string
  condition: string
  moduleScore: number
  HOPE?: number
  MFR?: number
  CSSR?: number
  CADRE?: number
  OTHER?: number
}

type AssessmentHistoryGraphProps = {
  processing: boolean
  detailCountryReviews: IInstitutionalizationOrganization[]
}

const AssessmentHistoryGraph = ({
  processing,
  detailCountryReviews,
}: AssessmentHistoryGraphProps): JSX.Element => {
  const theme = useTheme()
  const { t } = useTranslation()

  const [moduleData, setModuleData] = useState<IGraphPoint[] | undefined>(
    undefined
  )

  useEffect(() => {
    setModuleData([
      {
        moduleNo: '#1',
        condition: 'Nationally Adapted PEER Curricula',
        moduleScore: 2.6,
      },
      {
        moduleNo: '#2',
        condition: 'National PEER Standards Established and Endorsed',
        moduleScore: 2.5,
      },
      {
        moduleNo: '#3',
        condition: 'PEER integrated into DRR strategies',
        moduleScore: 1.5,
      },
      {
        moduleNo: '#4',
        condition:
          'Identified funding sources for rollout/integration in annual budgets',
        moduleScore: 4.7,
      },
      {
        moduleNo: '#5',
        condition: 'Integration into institutional policies/programs',
        moduleScore: 3.5,
      },
      {
        moduleNo: '#6',
        condition: 'Minimum required PEER instructors/equipment sustained',
        moduleScore: 3,
      },
      {
        moduleNo: '#7',
        condition: 'Accreditation and Certification of PEER courses',
        moduleScore: 3.3,
      },
      {
        moduleNo: '#8',
        condition:
          'Engagement plan for PEER graduates established and endorsed',
        moduleScore: 2.7,
      },
      {
        moduleNo: '#9',
        condition:
          'Established PEER community of practice for learning and sharing',
        moduleScore: 2.7,
      },
    ])
  }, [])

  useEffect(() => {
    const modules = [] as IGraphPoint[]

    // organizationAssessment?.institutionalization?.modules.forEach((module) => {
    //   modules.push({
    //     moduleNo: `#${module.moduleNo}`,
    //     condition: module.condition,
    //     moduleScore: module.moduleScore,
    //   })
    // })
    // setModuleData(modules)

    console.log('#####################: ', detailCountryReviews)

    const reviews = [...detailCountryReviews, ...detailCountryReviews]

    lodash.map(
      lodash.groupBy(reviews, 'trainingComponent'),
      (byTrainingComponents: any[]) => {
        console.log('##################### 2: ', byTrainingComponents)
      }
    )
  }, [detailCountryReviews])

  if (!processing && (!detailCountryReviews || moduleData?.length == 0)) {
    return (
      <Empty
        title={t('institutionalization:assessmentManagement.nodata.assessment')}
      />
    )
  }

  return (
    <Grid container>
      <Grid item xs={8} md={12}>
        <Card>
          <CardHeader title={t('dashboard.budget.title')} />
          <CardContent>
            <ResponsiveContainer width="99%" height={window.innerWidth ?? 200}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={moduleData}>
                <PolarAngleAxis
                  dataKey="moduleNo"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 14 }}
                />
                <svg width="0" height="0">
                  <defs>
                    <radialGradient
                      id="radial-gradient"
                      cx="50%"
                      cy="50%"
                      r="70%"
                    >
                      <stop offset="100%" stopColor="#ffb3b3" />
                      <stop
                        offset="0%"
                        stopColor={theme.palette.primary.main}
                      />
                    </radialGradient>
                  </defs>
                </svg>
                <Radar
                  name={t('moduleScore')}
                  dataKey="moduleScore"
                  strokeWidth={8}
                  stroke="#8884d8"
                  fillOpacity={0.0}
                />
                <Tooltip
                  contentStyle={
                    {
                      // borderRadius: 16,
                      // boxShadow: theme.shadows[3],
                      // backgroundColor: theme.palette.background.paper,
                      // borderColor: theme.palette.background.paper,
                    }
                  }
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid item xs={12} md={12}>
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
                    <TableCell align="left">{t('Module No')}</TableCell>
                    <TableCell>{t('Module Name')}</TableCell>
                    <TableCell align="center">{t('Score')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizationAssessment?.institutionalization?.modules.map(
                    (module, modIndex) => (
                      <TableRow key={modIndex}>
                        <TableCell>
                          <Typography color="text.secondary" component="div">
                            #{module.moduleNo}
                          </Typography>
                        </TableCell>

                        <TableCell>{module.condition}</TableCell>

                        <TableCell align="center">
                          {module.moduleScore}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default AssessmentHistoryGraph

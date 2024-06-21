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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
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
}

type PrintReportProps = {
  processing: boolean
  organizationAssessment?: IInstitutionalizationOrganization
}

const PrintGraph = ({
  processing,
  organizationAssessment,
}: PrintReportProps): JSX.Element => {
  const theme = useTheme()
  const { t } = useTranslation()

  const [moduleData, setModuleData] = useState<IGraphPoint[] | undefined>(
    undefined
  )

  useEffect(() => {
    const modules = [] as IGraphPoint[]

    organizationAssessment?.institutionalization?.modules.forEach((module) => {
      modules.push({
        moduleNo: `#${module.moduleNo}`,
        condition: module.condition,
        moduleScore: module.moduleScore,
      })
    })
    setModuleData(modules)
  }, [organizationAssessment])

  if (!processing && (!organizationAssessment || moduleData?.length == 0)) {
    return (
      <Empty
        title={t('institutionalization:assessmentManagement.nodata.assessment')}
      />
    )
  }

  return (
    <Grid container>
      <Grid
        maxWidth={1000}
        sx={{
          alignSelf: 'center',
        }}
      >
        <Card
          sx={{
            alignContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <CardHeader
            title={t(
              'institutionalization:organizationAssessmentManagement.print.graph.title'
            )}
          />
          <CardContent>
            <ResponsiveContainer height={1000} width={1000}>
              <RadarChart
                // cx="50%" cy="50%" outerRadius="70%"
                data={moduleData}
              >
                <PolarAngleAxis
                  dataKey="moduleNo"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 14 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} />
                <PolarGrid
                  style={{
                    stroke: '#e0dbd6',
                  }}
                />
                <Radar
                  name={t(
                    'institutionalization:organizationAssessmentManagement.print.graph.moduleScore'
                  )}
                  dataKey="moduleScore"
                  stroke={theme.palette.primary.main}
                  strokeWidth={8}
                  fill="#ffb3b3"
                  fillOpacity={0.2}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    boxShadow: theme.shadows[3],
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.background.paper,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          {/* <CardHeader title={t('dashboard.teams.title')} /> */}
          <CardContent sx={{ px: 2 }}>
            <TableContainer>
              <Table
                aria-label="team progress table"
                size="small"
                sx={{
                  '& td, & th': {
                    border: 0,
                    margin: 0,
                    padding: 0,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      {t(
                        'institutionalization:organizationAssessmentManagement.print.graph.table.moduleNo'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'institutionalization:organizationAssessmentManagement.print.graph.table.moduleName'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {t(
                        'institutionalization:organizationAssessmentManagement.print.graph.table.score'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizationAssessment?.institutionalization?.modules.map(
                    (module, modIndex) => (
                      <TableRow key={modIndex}>
                        <TableCell>
                          <Typography>#{module.moduleNo}</Typography>
                        </TableCell>
                        <TableCell>{module.condition}</TableCell>
                        <TableCell align="center">
                          {module.moduleScore.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PrintGraph

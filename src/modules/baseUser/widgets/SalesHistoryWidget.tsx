import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import lodash from 'lodash'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts'

import { ITrainingComponentOverviewItem } from '../../../shared/interfaces/dashboard'
import data from '../hooks/dashboard.json'

type SalesWidgetProps = {
  trainingComponentOverview: ITrainingComponentOverviewItem[]
}

const SalesWidget = ({
  trainingComponentOverview,
}: SalesWidgetProps): JSX.Element => {
  const { t } = useTranslation()
  const theme = useTheme()

  if (!lodash.isArray(trainingComponentOverview)) {
    return <></>
  }

  // const data = [
  //   {
  //     name: 'Mon',
  //     uv: 4000,
  //   },
  //   {
  //     name: 'Tue',
  //     uv: 3000,
  //   },
  //   {
  //     name: 'Wed',
  //     uv: 2000,
  //   },
  //   {
  //     name: 'Thu',
  //     uv: 2780,
  //   },
  //   {
  //     name: 'Fri',
  //     uv: 1890,
  //   },
  //   {
  //     name: 'Sat',
  //     uv: 2390,
  //   },
  // ]
  // const trainingComponentOverview =
  //   data[0].lastCountryReview.trainingComponentOverview

  // Calculate the sum of averageScore values
  // const totalAverageScore = trainingComponentOverview.reduce(
  //   (total, item) => total + item.averageScore,
  //   0
  // )
  const totalAverageScore = () => {
    const avgScore = lodash.meanBy(trainingComponentOverview, 'averageScore')
    return avgScore ? avgScore.toFixed(2) : 0.0
  }

  return (
    <Card>
      <CardHeader title={t('dashboard.salesHistory.title')} />
      <CardContent>
        <ResponsiveContainer width="99%" height={124}>
          <BarChart
            width={150}
            height={40}
            data={
              trainingComponentOverview.length === 1
                ? [...trainingComponentOverview, ...trainingComponentOverview]
                : trainingComponentOverview
            }
            margin={{
              right: 15,
              left: 15,
            }}
          >
            <Bar
              dataKey="averageScore"
              fill={theme.palette.primary.main}
              radius={[50, 50, 50, 50]}
            />
            <XAxis
              axisLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickLine={false}
              dataKey="code"
              interval={0}
              angle={0}
              textAnchor="end"
              dx={14}
            />
          </BarChart>
        </ResponsiveContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2" component="div" marginBottom={1}>
              {totalAverageScore()}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="div">
              {t('dashboard.salesHistory.unit')}
            </Typography>
          </Box>
          <TrendingUpIcon sx={{ color: 'text.secondary' }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default SalesWidget

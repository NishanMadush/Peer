import { Card, CardContent, CardHeader, useTheme } from '@mui/material'
import lodash from 'lodash'
import { useTranslation } from 'react-i18next'
import {
  PolarAngleAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { ITrainingComponentModule } from '../../../shared/interfaces/dashboard'
import data from '../hooks/dashboard.json'

// const data = [
//   {
//     subject: '#1',
//     A: 3,
//   },
//   {
//     subject: '#2',
//     A: 3.5,
//   },
//   {
//     subject: '#3',
//     A: 4.2,
//   },
//   {
//     subject: '#4',
//     A: 2.8,
//   },
//   {
//     subject: '#5',
//     A: 4,
//   },
//   {
//     subject: '#6',
//     A: 4.6,
//   },
//   {
//     subject: '#7',
//     A: 4.5,
//   },
//   {
//     subject: '#8',
//     A: 4.3,
//   },
//   {
//     subject: '#9',
//     A: 3,
//   },
// ]
type BudgetWidgetProps = {
  trainingComponentModules: ITrainingComponentModule[]
}

const BudgetWidget = ({
  trainingComponentModules,
}: BudgetWidgetProps): JSX.Element => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Card>
      <CardHeader title={t('dashboard.budget.title')} />
      <CardContent>
        <ResponsiveContainer width="99%" height={205}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={
              trainingComponentModules.length === 1
                ? [...trainingComponentModules, ...trainingComponentModules]
                : trainingComponentModules
            }
          >
            <PolarAngleAxis
              dataKey="moduleNo"
              tick={{ fill: theme.palette.text.secondary, fontSize: 14 }}
            />
            <Radar
              name={t('dashboard.budget.legend.unit')}
              dataKey="score"
              stroke={theme.palette.primary.main}
              strokeWidth={8}
              fill={theme.palette.primary.main}
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
  )
}

export default BudgetWidget

import { Card, CardContent, CardHeader, useTheme } from '@mui/material'
import lodash from 'lodash'
import { useTranslation } from 'react-i18next'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

import { IAssessmentHistoryItem } from '../../../shared/interfaces/dashboard'

// const data = [
//   {
//     name: '2021-Jan',
//     pv: 3.2,
//   },
//   {
//     name: '2021-Jan',
//     pv: 3.2,
//   },
//   {
//     name: '2021-Jul',
//     pv: 3.5,
//   },
//   {
//     name: '2022-Jan',
//     pv: 4.6,
//   },
//   {
//     name: '2022-Jul',
//     pv: 4.2,
//   },
//   {
//     name: '2023-Jan',
//     pv: 4.5,
//   },
// ]

type ActivityWidgetProps = {
  assessmentHistory: IAssessmentHistoryItem[]
}

const ActivityWidget = ({
  assessmentHistory,
}: ActivityWidgetProps): JSX.Element => {
  const { t } = useTranslation()
  const theme = useTheme()

  if (!lodash.isArray(assessmentHistory)) {
    return <></>
  }

  return (
    <Card>
      <CardHeader title={t('dashboard.activity.title')} />
      <CardContent>
        <ResponsiveContainer width="100%" height={244}>
          <LineChart
            width={500}
            height={400}
            data={
              assessmentHistory.length === 1
                ? [...assessmentHistory, ...assessmentHistory]
                : assessmentHistory
            }
            margin={{
              top: 5,
              right: 16,
              left: 16,
              bottom: 48,
            }}
          >
            <XAxis
              axisLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickLine={false}
              dataKey="date"
              interval={0}
              angle={270}
              textAnchor="end"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.paper,
              }}
            />

            <Line
              name="averageScore"
              type="monotone"
              dataKey="averageScore"
              stroke={theme.palette.primary.main}
              strokeWidth={6}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ActivityWidget

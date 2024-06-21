import { Card, CardContent, Grid, Typography } from '@mui/material'

import {
  IStatisticDashboard,
  ITrainingComponentTile,
} from '../../../shared/interfaces/dashboard'
import { IInstitutionalizationCountryReview } from '../../../shared/interfaces/institutionalization'

type OverviewWidgetProps = {
  color?: 'primary' | 'warning' | 'error'

  code: string
  score: number

  // countryReviews: IInstitutionalizationCountryReview | undefined
}

// type OverviewWidgetProps = {
//   tiles?: Array<{ code: string; score: number }>
// }

const OverviewWidget = ({
  // tiles = [],
  code,
  score,
}: // countryReviews,
OverviewWidgetProps): JSX.Element => {
  return (
    <Grid>
      <Card>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography gutterBottom component="div" variant="h3">
            {code}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {score}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default OverviewWidget

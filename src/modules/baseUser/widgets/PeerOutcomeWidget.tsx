import { LocationDisabledSharp } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import lodash from 'lodash'
import { useTranslation } from 'react-i18next'

import { ITrainingComponentOverviewItem } from '../../../shared/interfaces/dashboard'

// const targets = [
//   { name: 'Views', nameKey: 'admin.home.targets.views', value: 75 },
//   { name: 'Followers', nameKey: 'admin.home.targets.followers', value: 50 },
//   { name: 'Income', nameKey: 'admin.home.targets.income', value: 25 },
// ]

type PeerOutcomeWidgetProps = {
  trainingComponentOverview: ITrainingComponentOverviewItem[]
}

const PeerOutcomeWidget = ({
  trainingComponentOverview,
}: PeerOutcomeWidgetProps): JSX.Element => {
  const { t } = useTranslation()

  if (!lodash.isArray(trainingComponentOverview)) {
    return <></>
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title={t('admin.home.targets.title')} />
      <CardContent>
        <List>
          {trainingComponentOverview.map((trainingComponent) => (
            <ListItem disableGutters key={trainingComponent.code}>
              <ListItemText>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Typography component="div" variant="h6">
                    {t(trainingComponent.code)}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography component="div" variant="h6">
                    {`${trainingComponent.averageScore}`}
                  </Typography>
                </Box>
                {/* prettier-ignore */}
                <LinearProgress
                  aria-label={`${trainingComponent.code} progress`}
                  sx={{
                    color:'primary.main'
                      // target.value >= 75
                      //   ? 'primary.main'
                      //   : target.value <= 25
                      //     ? 'error.main'
                      //     : 'warning.main',
                  }}
                  color="inherit"
                  variant="determinate"
                  value={trainingComponent.averageScore*100/5}
                />
                <div></div>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default PeerOutcomeWidget

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PersonIcon from '@mui/icons-material/Person'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  useTheme,
} from '@mui/material'
import lodash from 'lodash'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { ICountryOverviewItem } from '../../../shared/interfaces/dashboard'
import { COUNTRY_MANAGEMENT_ROUTE } from '../../countries/constants/routes'
import { INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE } from '../../institutionalization/organizationAssessment/constants/routes'
import { USER_MANAGEMENT_ROUTE } from '../../users/constants/routes'
import { ROOT_ROUTE } from '../constants/routes'
import data from '../hooks/dashboard.json'

// const users = [
//   {
//     id: '1',
//     firstName: 'Rhys',
//     gender: 'M',
//     lastName: 'Arriaga',
//     role: 'Admin',
//   },
//   {
//     id: '2',
//     firstName: 'Laura',
//     gender: 'F',
//     lastName: 'Core',
//     role: 'Member',
//   },
//   {
//     id: '3',
//     firstName: 'Joshua',
//     gender: 'M',
//     lastName: 'Jagger',
//     role: 'Member',
//   },
// ]
type UsersWidgetProps = {
  countryOverview: ICountryOverviewItem[]
}

const UsersWidget = ({ countryOverview }: UsersWidgetProps): JSX.Element => {
  const theme = useTheme()
  const { t } = useTranslation()

  if (!lodash.isArray(countryOverview)) {
    return <></>
  }
  return (
    <Card>
      <CardHeader title={t('dashboard.users.title')} />
      <CardContent>
        <List>
          {countryOverview.map((country, countryIndex) => (
            <ListItem disableGutters key={countryIndex}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${country.country}`}
                primaryTypographyProps={{
                  fontWeight: theme.typography.fontWeightMedium,
                }}
                secondary={country.averageScore}
              />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Go to user details"
                  component={RouterLink}
                  edge="end"
                  to={`/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}?countryReviewId=${country?.reviewId}`}
                >
                  <ChevronRightIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default UsersWidget

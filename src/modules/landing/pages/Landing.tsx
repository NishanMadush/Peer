import StarIcon from '@mui/icons-material/Star'
import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useAuth } from '../../../modules/auth/contexts/AuthProvider'
import { PUBLIC_LOGIN_ROUTE } from '../../auth/constants/routes'
import { ROOT_ROUTE } from '../../baseUser/constants/routes'
import LandingLayout from '../components/LandingLayout'

const features = [
  { name: 'Bootstraped with Create React App' },
  { name: 'Components & Themes built on top of Material-UI' },
  { name: 'Data Fetching with React Query' },
  { name: 'Written in TypeScript' },
  { name: 'Real-world examples' },
  { name: 'Best Practices' },
  { name: 'MIT License' },
]

const Landing = (): JSX.Element => {
  const { userInfo } = useAuth()
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <LandingLayout>
      <main>
        <Box
          sx={{
            py: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h1"
              align="center"
              color="text.primary"
              marginBottom={4}
            >
              {t('landing.title')}
            </Typography>
            <Typography
              variant="body1"
              align="justify"
              color="text.primary"
              marginBottom={4}
            >
              The Program for Enhancement of Emergency Response is a regional
              capacity-building program supported by the USAID Bureau for
              Humanitarian Assistance (USAID-BHA), formerly known as Office of
              the U.S. Foreign Disaster Assistance (OFDA), since 1998. The
              program's current phase aims to strengthen national and regional
              partners' institutional and technical capacity to accelerate the
              institutionalization and sustainability of the PEER Program in six
              South Asian countries. The current program countries include
              Afghanistan, Bangladesh, India, Nepal, Pakistan, and Sri Lanka,
              together with Bhutan and the Maldives in regional engagements.
            </Typography>
            <Stack
              sx={{ pt: 3 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              {/* <Button
                component="a"
                href={process.env.REACT_APP_SOURCE_LINK}
                rel="noopener noreferrer"
                target="_blank"
                variant="outlined"
              >
                {t('landing.cta.secondary')}
              </Button> */}
              {userInfo ? (
                <Button
                  component={RouterLink}
                  to={`/${ROOT_ROUTE}`}
                  variant="contained"
                >
                  {t('landing.cta.mainAuth', { name: userInfo.firstName })}
                </Button>
              ) : (
                <Button
                  component={RouterLink}
                  to={`/${PUBLIC_LOGIN_ROUTE}`}
                  variant="contained"
                >
                  {t('landing.cta.main')}
                </Button>
              )}
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 6 }} maxWidth="md">
          <img
            alt="Application demo"
            src={`img/template-${theme.palette.mode}.png`}
            style={{
              borderRadius: 24,
              borderStyle: 'solid',
              borderWidth: 4,
              borderColor: theme.palette.background.default,
              width: '100%',
            }}
          />
        </Container>
        {/* <Container sx={{ py: 8 }} maxWidth="md">
          <Stack alignItems="center">
            <Typography
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {t('landing.features.title')}
            </Typography>
            <List sx={{ pt: 3 }}>
              {features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>
                      <StarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={feature.name} />
                </ListItem>
              ))}
            </List>
            <Button
              component="a"
              href={process.env.REACT_APP_SOURCE_LINK}
              rel="noopener noreferrer"
              target="_blank"
              sx={{ mt: 3 }}
              variant="outlined"
            >
              {t('landing.features.more')}
            </Button>
          </Stack>
        </Container> */}
      </main>
    </LandingLayout>
  )
}

export default Landing

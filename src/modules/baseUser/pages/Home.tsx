import { Grid } from '@mui/material'
import React from 'react'

import BaseAppBar from '../components/BaseAppBar'
import BaseToolbar from '../components/BaseToolbar'
import RecentNotifications from '../components/RecentNotifications'
import AchievementWidget from '../widgets/AchievementWidget'
import FollowersWidget from '../widgets/FollowersWidget'
import MeetingWidgets from '../widgets/MeetingWidgets'
import PersonalTargetsWidget from '../widgets/PersonalTargetsWidget'
import ViewsWidget from '../widgets/ViewsWidget'
import WelcomeWidget from '../widgets/WelcomeWidget'

const Home = (): JSX.Element => {
  return (
    <React.Fragment>
      <BaseAppBar>
        <BaseToolbar>
          <RecentNotifications />
        </BaseToolbar>
      </BaseAppBar>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <WelcomeWidget />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <FollowersWidget />
          <ViewsWidget />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <PersonalTargetsWidget />
          <MeetingWidgets />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Home

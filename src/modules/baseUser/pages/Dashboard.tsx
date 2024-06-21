import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import { Fab, Grid } from '@mui/material'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import {
  IStatisticDashboard,
  ITrainingComponentTile,
} from '../../../shared/interfaces/dashboard'
import { useAuth } from '../../auth/contexts/AuthProvider'
import { useCountryReviews } from '../../institutionalization/countryReview/hooks/useCountryReviews'
import BaseAppBar from '../components/BaseAppBar'
import BaseToolbar from '../components/BaseToolbar'
import { DEFAULT_OBJECT_ID, DefaultUsers } from '../constants/helper'
import { DASHBOARD_ROUTE, ROOT_ROUTE } from '../constants/routes'
import data from '../hooks/dashboard.json'
import { useDashboardStatistics } from '../hooks/useDashboardStatistics'
import ActivityWidget from '../widgets/ActivityWidget'
import BudgetWidget from '../widgets/BudgetWidget'
import CircleProgressWidget from '../widgets/CircleProgressWidget'
import OverviewWidget from '../widgets/OverviewWidget'
import PeerOutcomeWidget from '../widgets/PeerOutcomeWidget'
import PeerTrainingWidget from '../widgets/PeerTrainingWidget'
import ProgressWidget from '../widgets/ProgressWidget'
import SalesByAgeWidget from '../widgets/SalesByAgeWidget'
import SalesByCategoryWidget from '../widgets/SalesByCategoryWidget'
import SalesHistoryWidget from '../widgets/SalesHistoryWidget'
import TeamProgressWidget from '../widgets/TeamProgressWidget'
import UsersWidget from '../widgets/UsersWidget'
import WelcomeWidget from '../widgets/WelcomeWidget'

const Dashboard = (): JSX.Element => {
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const { userInfo } = useAuth()
  // const { isLoading, getDashboardStatistics } = useDashboardStatistics()

  const filter =
    userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR ||
    userInfo.role === DefaultUsers.ADPC_ADMINISTRATOR
      ? `?level=Global`
      : userInfo.role === DefaultUsers.COUNTRY_ADMINISTRATOR
      ? `?level=Country&countryId=${
          userInfo?.employment?.organization?.organizationId?.countryId ??
          DEFAULT_OBJECT_ID
        }`
      : userInfo.role === DefaultUsers.ORGANIZATION_USER
      ? `?level=Organization&organizationId=${
          userInfo?.employment?.organization?.organizationId?.id ??
          DEFAULT_OBJECT_ID
        }`
      : `?level=Country&countryId=${DEFAULT_OBJECT_ID}`

  const { isLoading: isLoadingDashboardStats, getDashboardStatistics } =
    useDashboardStatistics(filter)

  const [statisticsData, setStatisticsData] = useState<
    IStatisticDashboard | undefined
  >(undefined)

  // const [statisticsData, setStatisticsData] = useState([])

  const handleRefresh = () => {
    getDashboardStatistics(filter)
      .then((data: IStatisticDashboard) => {
        setStatisticsData(data)
      })
      .catch((error: any) => {
        console.error(error)
      })
  }

  useEffect(() => {
    handleRefresh()
    // Call the handler function on component mount
  }, [])

  return (
    <React.Fragment>
      <BaseAppBar>
        <BaseToolbar title={''}>
          {/* <Fab
            aria-label="refresh-stat"
            color="primary"
            onClick={handleRefresh}
            size="small"
          >
            <AutorenewIcon />
          </Fab> */}
        </BaseToolbar>
      </BaseAppBar>

      <Grid container spacing={2}>
        {/* Welcome screen */}
        <Grid item xs={12} md={6} lg={4}>
          <WelcomeWidget />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          {/* Show train component tiles */}
          {statisticsData?.trainingComponentTiles && (
            <PeerTrainingWidget
              trainingComponentTiles={statisticsData?.trainingComponentTiles}
            />
          )}
        </Grid>

        {/* Show overall training-components of last attempt */}
        {statisticsData?.lastCountryReview.trainingComponentOverview &&
          !lodash.isEmpty(
            statisticsData.lastCountryReview.trainingComponentOverview
          ) && (
            <Grid item xs={12} md={6} lg={4}>
              <PeerOutcomeWidget
                trainingComponentOverview={
                  statisticsData.lastCountryReview.trainingComponentOverview
                }
              />
            </Grid>
          )}

        {/* Show country overview */}
        {statisticsData?.countryOverview &&
          !lodash.isEmpty(statisticsData?.countryOverview) && (
            <Grid item xs={12} md={6} lg={4}>
              <UsersWidget countryOverview={statisticsData.countryOverview} />
            </Grid>
          )}

        {/* Show train component tiles */}
        {/* {statisticsData?.trainingComponentTiles &&
          statisticsData?.trainingComponentTiles.map((item, index) => (
            <Grid key={`keyTile${index}`} item xs={12} md={6} lg={4}>
              <OverviewWidget code={item.code} score={item.score} />
            </Grid>
          ))} */}

        {/* Show overall last attempt */}
        {/* {statisticsData?.lastCountryReview.trainingComponentOverview &&
          !lodash.isEmpty(
            statisticsData?.lastCountryReview.trainingComponentOverview
          ) && (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              justifyContent="center"
              alignItems="center"
            >
              <SalesHistoryWidget
                trainingComponentOverview={
                  statisticsData.lastCountryReview.trainingComponentOverview
                }
              />
            </Grid>
          )} */}

        {/* Show review history */}
        {statisticsData?.assessmentHistory &&
          !lodash.isEmpty(statisticsData?.assessmentHistory) && (
            <Grid item xs={12} md={12}>
              <ActivityWidget
                assessmentHistory={statisticsData.assessmentHistory}
              />
            </Grid>
          )}

        {/* Show module status */}
        {statisticsData?.lastCountryReview?.trainingComponentModules &&
          !lodash.isEmpty(
            statisticsData?.lastCountryReview?.trainingComponentModules
          ) && (
            <Grid item xs={12} md={6} lg={4}>
              <BudgetWidget
                trainingComponentModules={
                  statisticsData.lastCountryReview.trainingComponentModules
                }
              />
            </Grid>
          )}

        {/* Show progress of last attempt */}
        {statisticsData?.lastCountryReview &&
          lodash.isNumber(
            statisticsData?.lastCountryReview.trainingComponentProgress
          ) &&
          statisticsData.lastCountryReview.trainingComponentProgress > 0 && (
            <Grid item xs={12} md={4}>
              <CircleProgressWidget
                height={204}
                title={t('dashboard.progress.title')}
                value={
                  statisticsData.lastCountryReview.trainingComponentProgress
                }
              />
            </Grid>
          )}

        {/* Show organization overview */}
        {statisticsData?.lastCountryReview.organizationOverview &&
          !lodash.isEmpty(
            statisticsData?.lastCountryReview.organizationOverview
          ) && (
            <Grid item xs={12} md={8}>
              <TeamProgressWidget
                organizationOverview={
                  statisticsData.lastCountryReview.organizationOverview
                }
              />
            </Grid>
          )}

        {/* <Grid item xs={12} md={4}>
          <ProgressWidget
            avatar={<SupervisorAccountIcon />}
            mb={2}
            title={t('dashboard.visitProgress.title')}
            value={75}
          />
          <ProgressWidget
            avatar={<ShoppingBasketIcon />}
            mb={2}
            title={t('dashboard.orderProgress.title')}
            value={50}
          />
          <ProgressWidget
            avatar={<AttachMoneyIcon />}
            title={t('dashboard.salesProgress.title')}
            value={25}
          />
        </Grid> */}

        {/* <Grid item xs={12} md={4}>
          <SalesByCategoryWidget /> 
        </Grid>
        <Grid item xs={12} md={8}>
          <SalesByAgeWidget />
        </Grid> */}
      </Grid>
    </React.Fragment>
  )
}

export default Dashboard

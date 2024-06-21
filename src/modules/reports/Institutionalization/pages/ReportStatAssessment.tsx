import 'webdatarocks/webdatarocks.css'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Card, Fab, MenuItem, TextField } from '@mui/material'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as WebDataRocks from 'react-webdatarocks'

import Empty from '../../../../core/components/Empty'
import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import {
  IInstitutionalizationStatistic,
  LevelStatEnum,
} from '../../../../shared/interfaces/report'
import { useAuth } from '../../../auth/contexts/AuthProvider'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import { DefaultUsers } from '../../../baseUser/constants/helper'
import { IOrganization } from '../../../organizations/interfacesAndTypes/organization'
import { useProfileBasics } from '../../../users/hooks/useProfileBasics'
import { IProfileBasics } from '../../../users/interfacesAndTypes/profile'
import { useOrganizations } from '../hooks/useOrganizations'
import { useReportStatistics } from '../hooks/useStatistics'

const OrganizationAssessment = (): JSX.Element => {
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const { data: organizationsAll } = useOrganizations()
  const { isLoading, getStatistics } = useReportStatistics()
  const { isLoading: isLoadingProfileBasics, getProfileBasics } =
    useProfileBasics()

  const [reportConfiguration, setReportConfiguration] = useState<any>(undefined)
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>('')
  const [statisticsData, setStatisticsData] = useState<any>(undefined)
  const [organizations, setOrganizations] = useState<
    IOrganization[] | undefined
  >(undefined)

  const { userInfo } = useAuth()

  useEffect(() => {
    // Get relevant statistics
    getStatistics(LevelStatEnum.Assessment)
      .then((statistics: Partial<IInstitutionalizationStatistic>[]) => {
        // Start processing if data available
        if (statistics) {
          setStatisticsData(statistics)
        }
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
        setReportConfiguration(undefined)
      })
  }, [])

  useEffect(() => {
    // All the organizations are shown to the admin
    if (
      userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR ||
      userInfo.role === DefaultUsers.ADPC_ADMINISTRATOR
    ) {
      setOrganizations(organizationsAll)
    } else {
      const organizationsInCountry = lodash.filter(organizationsAll, {
        countryId:
          userInfo?.employment?.organization?.organizationId?.countryId,
      })
      setOrganizations(organizationsInCountry)
    }
  }, [organizationsAll])

  // Pre process data
  useEffect(() => {
    if (!statisticsData || lodash.isEmpty(selectedOrganizationId)) return

    const cleanedData = lodash.filter(statisticsData, {
      organizationId: selectedOrganizationId,
      level: LevelStatEnum.Assessment,
    })

    // Set configuration/data to populate pivot table
    setReportConfiguration({
      dataSource: {
        data: [
          {
            assessmentScore: { type: 'number' },
            assessmentStatus: { type: 'string' },
            countryReviewTitle: { type: 'string' },
            organizationName: { type: 'string' },
            trainingComponent: { type: 'string' },
            moduleNo: { type: 'string' },
            moduleScore: { type: 'number' },
          },
          ...cleanedData,
        ],
      },
      slice: {
        // rows: [
        //   {
        //     uniqueName: 'countryReviewTitle',
        //     sort: 'asc',
        //   },
        //   {
        //     uniqueName: 'assessmentStatus',
        //     sort: 'asc',
        //     filter: {
        //       members: ['assessmentStatus.Complete'],
        //     },
        //   },
        //   {
        //     uniqueName: 'moduleNo',
        //     sort: 'asc',
        //   },
        // ],
        // columns: [{ uniqueName: 'trainingComponent', sort: 'asc' }],
        // measures: [{ uniqueName: 'moduleScore', aggregation: 'average' }],
        // drills: {
        //   drillAll: false,
        // },
        rows: [
          {
            uniqueName: 'countryReviewTitle',
            sort: 'asc',
          },
          {
            uniqueName: 'trainingComponent',
            sort: 'asc',
          },
          {
            uniqueName: 'moduleNo',
            sort: 'asc',
          },
        ],
        columns: [{ uniqueName: 'assessmentStatus', sort: 'asc' }],
        measures: [{ uniqueName: 'moduleScore', aggregation: 'average' }],
        drills: {
          drillAll: false,
        },
      },
    })
  }, [selectedOrganizationId, statisticsData])

  const ref: React.RefObject<WebDataRocks.Pivot> =
    React.useRef<WebDataRocks.Pivot>(null)

  const onReportComplete = () => {
    if (ref.current) {
      ref.current.webdatarocks.off('reportcomplete')
    }
  }

  const customizeToolbar = (toolbar: any) => {
    const tabs = toolbar.getTabs() // get all tabs from the toolbar
    toolbar.getTabs = function () {
      delete tabs[0] // delete the first tab
      delete tabs[1]
      delete tabs[2]
      delete tabs[4]
      delete tabs[6]
      return tabs
    }
  }

  return (
    <React.Fragment>
      <BaseAppBar>
        <BaseToolbar
          title={t('report:institutionalization.reportOrganization.title')}
        >
          {' '}
          {!lodash.isEmpty(reportConfiguration) && (
            <Fab
              aria-label="delete-institutionalization-forms"
              color="primary"
              onClick={() => {
                setSelectedOrganizationId('')
                setReportConfiguration(undefined)
              }}
              size="small"
            >
              <ArrowBackIcon />
            </Fab>
          )}
        </BaseToolbar>
      </BaseAppBar>
      <>
        {!isLoading && !statisticsData && (
          <Empty
            title={t('report:institutionalization.reportOrganization.nodata')}
          />
        )}
        {lodash.isEmpty(reportConfiguration) ? (
          <Card>
            <TextField
              margin="normal"
              required
              id="organization"
              fullWidth
              select
              label={t('report:institutionalization.reportOrganization.filter')}
              name="organization"
              value={selectedOrganizationId}
              onChange={(e) => {
                setSelectedOrganizationId(e.target.value)
              }}
              disabled={isLoading || !lodash.isEmpty(reportConfiguration)}
            >
              {organizations &&
                organizations.map((organization: IOrganization) => (
                  <MenuItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </MenuItem>
                ))}
            </TextField>
          </Card>
        ) : (
          <Card aria-disabled={isLoading}>
            <WebDataRocks.Pivot
              ref={ref}
              toolbar={true}
              beforetoolbarcreated={customizeToolbar}
              width="100%"
              report={reportConfiguration}
              reportcomplete={() => onReportComplete()}
            ></WebDataRocks.Pivot>
          </Card>
        )}
      </>
    </React.Fragment>
  )
}

export default OrganizationAssessment

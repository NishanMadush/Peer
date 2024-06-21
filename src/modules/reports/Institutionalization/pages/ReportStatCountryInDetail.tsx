import 'webdatarocks/webdatarocks.css'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Card, Fab, MenuItem, TextField } from '@mui/material'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as WebDataRocks from 'react-webdatarocks'

import Empty from '../../../../core/components/Empty'
import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import { AssessmentStatusEnum } from '../../../../shared/interfaces/institutionalization'
import {
  IInstitutionalizationStatistic,
  LevelStatEnum,
} from '../../../../shared/interfaces/report'
import { useAuth } from '../../../auth/contexts/AuthProvider'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import { DefaultUsers } from '../../../baseUser/constants/helper'
import { ICountry } from '../../../countries/interfacesAndTypes/country'
import { useProfileBasics } from '../../../users/hooks/useProfileBasics'
import { IProfileBasics } from '../../../users/interfacesAndTypes/profile'
import { useCountries } from '../hooks/useCountries'
import { useReportStatistics } from '../hooks/useStatistics'

const ReportStatCountry = (): JSX.Element => {
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const { data: countries } = useCountries()
  const { isLoading, getStatistics } = useReportStatistics()
  const { isLoading: isLoadingProfileBasics, getProfileBasics } =
    useProfileBasics()

  const [reportConfiguration, setReportConfiguration] = useState<any>(undefined)
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [statisticsData, setStatisticsData] = useState<any>(undefined)
  const [allowMultiple, setAllowMultiple] = useState<boolean>(false)

  const { userInfo } = useAuth()

  useEffect(() => {
    // Get relevant statistics
    getStatistics(LevelStatEnum.Assessment)
      .then((statistics: Partial<IInstitutionalizationStatistic>[]) => {
        // Start processing if data available
        if (statistics) {
          setStatisticsData(statistics)
        }
        console.log('>>>>>>>>>>>>>>>>>>>>> 1: ', statistics)
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
        setReportConfiguration(undefined)
      })

    // All the countries are shown to the admin
    if (
      userInfo.role === DefaultUsers.SUPER_ADMINISTRATOR ||
      userInfo.role === DefaultUsers.ADPC_ADMINISTRATOR
    ) {
      setAllowMultiple(true)
    } else {
      setSelectedCountryId(
        userInfo?.employment?.organization?.organizationId?.countryId
      )
    }
  }, [])

  // Pre process data
  useEffect(() => {
    if (!statisticsData || lodash.isEmpty(selectedCountryId)) return

    const cleanedData = lodash.filter(statisticsData, {
      countryId: selectedCountryId,
      level: LevelStatEnum.Assessment,
      assessmentStatus: AssessmentStatusEnum.Complete,
    })

    console.log('>>>>>>>>>>>>>>>>>>>>> 2: ', cleanedData)

    // Set configuration/data to populate pivot table
    setReportConfiguration({
      dataSource: {
        data: [
          {
            // assessmentScore: { type: 'number' },
            // assessmentStatus: { type: 'string' },
            // country: { type: 'string' },
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
        rows: [
          {
            uniqueName: 'countryReviewTitle',
            sort: 'asc',
          },
          // {
          //   uniqueName: 'assessmentStatus',
          //   sort: 'asc',
          //   filter: {
          //     members: ['assessmentStatus.Complete'],
          //   },
          // },
          {
            uniqueName: 'moduleNo',
            sort: 'asc',
          },
        ],
        columns: [{ uniqueName: 'trainingComponent', sort: 'asc' }],
        measures: [{ uniqueName: 'moduleScore', aggregation: 'average' }],
        drills: {
          drillAll: false,
        },
      },
    })
  }, [selectedCountryId, statisticsData])

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
          title={t('report:institutionalization.reportCountry.title')}
        >
          {!lodash.isEmpty(reportConfiguration) && allowMultiple && (
            // Admin shown all the countries
            <Fab
              aria-label="delete-institutionalization-forms"
              color="primary"
              onClick={() => {
                setSelectedCountryId('')
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
            title={t('report:institutionalization.reportCountry.nodata')}
          />
        )}
        {lodash.isEmpty(reportConfiguration) ? (
          <Card>
            <TextField
              margin="normal"
              required
              id="country"
              fullWidth
              select
              label={t('report:institutionalization.reportCountry.filter')}
              name="country"
              value={selectedCountryId}
              onChange={(e) => {
                setSelectedCountryId(e.target.value)
              }}
              disabled={isLoading || !lodash.isEmpty(reportConfiguration)}
            >
              {countries &&
                countries.map((country: ICountry) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
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

export default ReportStatCountry

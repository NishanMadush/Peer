import 'webdatarocks/webdatarocks.css'

import { Card } from '@mui/material'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as WebDataRocks from 'react-webdatarocks'

import Empty from '../../../../core/components/Empty'
import { useSnackbar } from '../../../../core/contexts/SnackbarProvider'
import { IInstitutionalizationOrganization } from '../../../../shared/interfaces/institutionalization'
import { ISearchResult } from '../../../../shared/interfaces/result'
import BaseAppBar from '../../../baseUser/components/BaseAppBar'
import BaseToolbar from '../../../baseUser/components/BaseToolbar'
import { useReportOrganization } from '../hooks/useReportOrganization'

const OrganizationAssessment = (): JSX.Element => {
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const { isLoading, getAssessments } = useReportOrganization()

  const [reportConfiguration, setReportConfiguration] = useState<any>(undefined)

  useEffect(() => {
    getAssessments()
      .then((resultAssessments: ISearchResult) => {
        // Start processing if data available
        if (resultAssessments?.results) {
          const assessments =
            resultAssessments.results as IInstitutionalizationOrganization[]

          // Pre process data
          const cleanedData = [] as any[]
          lodash.map(assessments, function mapAssessment(assessment) {
            lodash.map(
              assessment?.institutionalization?.modules,
              function mapModules(module) {
                cleanedData.push({
                  country: assessment.countryId,
                  institute: assessment.organizationId,
                  date: assessment.complete,
                  component: assessment.trainingComponent,
                  score: assessment.score,
                  moduleNo: module.moduleNo,
                  moduleScore: module.moduleScore,
                })
                return true
              }
            )
            return true
          })

          // Set configuration/data to populate pivot table
          setReportConfiguration({
            dataSource: {
              data: [
                {
                  country: { type: 'string' },
                  institute: { type: 'string' },
                  date: { type: 'date' },
                  component: { type: 'string' },
                  score: { type: 'number' },
                  moduleNo: { type: 'string' },
                  moduleScore: { type: 'number' },
                },
                ...cleanedData,
              ],
            },
            slice: {
              rows: [{ uniqueName: 'moduleNo', sort: 'asc' }],
              columns: [{ uniqueName: 'component', sort: 'asc' }],
              measures: [{ uniqueName: 'moduleScore', aggregation: 'average' }],
              drills: {
                drillAll: false,
              },
            },
          })
        } else {
          setReportConfiguration(null)
        }
      })
      .catch((err: Error) => {
        snackbar.error(err?.message ?? t('common.errors.unexpected.subTitle'))
        setReportConfiguration(null)
      })
  }, [])

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
        <BaseToolbar title={t('report.title')}></BaseToolbar>
      </BaseAppBar>
      {!isLoading && reportConfiguration === null && (
        <Empty
          title={t(
            'report:reportManagement.organizationAssessment.nodata.assessment'
          )}
        />
      )}
      {!lodash.isEmpty(reportConfiguration) && (
        <Card aria-disabled={isLoading}>
          <WebDataRocks.Pivot
            ref={ref}
            toolbar={true}
            beforetoolbarcreated={customizeToolbar}
            width="100%"
            report={reportConfiguration} //"https://cdn.webdatarocks.com/reports/report.json"
            reportcomplete={() => onReportComplete()}
          ></WebDataRocks.Pivot>
        </Card>
      )}
    </React.Fragment>
  )
}

export default OrganizationAssessment

import { Button } from '@mui/material'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { useQueryErrorResetBoundary } from 'react-query'
import { useNavigate } from 'react-router-dom'

import { ROOT_ROUTE } from '../../modules/baseUser/constants/routes'
import { HttpError } from '../../services/ApiService'

import Loader from './Loader'
import Result from './Result'

type QueryWrapperProps = {
  children: React.ReactNode
}

const errorHandler = (error: Error) => {
  // console.log('%%%%%%%%%%%%%%%%%%%%%%%', error)
}

const QueryWrapper = ({ children }: QueryWrapperProps): JSX.Element => {
  const { reset } = useQueryErrorResetBoundary()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <ErrorBoundary
      onReset={reset}
      // onError={errorHandler}
      // onError={(error, errorInfo) => {
      //   // log the error
      //   console.log('********************** Error caught!')
      //   console.error('********************** ', error)
      //   console.error('********************** ', errorInfo)
      // }}
      // onReset={() => {
      //   // reloading the page to restore the initial state
      //   // of the current page
      //   console.log('********************** reloading the page...')
      //   // window.location.reload()

      //   // other reset logic...
      // }}
      fallbackRender={({ error, resetErrorBoundary }) => {
        const errorDetails = error as unknown as HttpError

        return (
          <Result
            extra={
              <Button
                onClick={() => {
                  // return resetErrorBoundary
                  // errorDetails?.code === 401 ? handleLogout : resetErrorBoundary
                  navigate(`/${ROOT_ROUTE}`)
                  return resetErrorBoundary
                }}
                variant="contained"
              >
                {/* {t('common.retry')} */}
                {'Go to home'}
              </Button>
            }
            status="error"
            subTitle={
              errorDetails?.message
                ? errorDetails.message
                : t('common.errors.unexpected.subTitle')
            }
            title={t('common.errors.unexpected.title')}
          />
        )
      }}
    >
      <React.Suspense fallback={<Loader />}>{children}</React.Suspense>
    </ErrorBoundary>
  )
}

export default QueryWrapper

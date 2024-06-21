import axios, { AxiosError } from 'axios'
import i18next from 'i18next'
import { useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { API_ENDPOINT } from '../core/constants/apiEndpoints'
import { useSnackbar } from '../core/contexts/SnackbarProvider'
import { useAuth } from '../modules/auth/contexts/AuthProvider'

export class HttpError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}
export type ApiError = HttpError | Error

/**
 * Converts possible AxiosError objects to normal Error objects
 *
 * @returns HttpError if AxiosError, else original error
 */
export const transformAxiosError = (e: Error): ApiError => {
  if (axios.isAxiosError(e) && e.response) {
    const statusCode = e.response.status

    if (statusCode === 429) {
      return new HttpError('Please try again later.', statusCode)
    }
    if (typeof e.response.data === 'string') {
      return new HttpError(e.response.data, statusCode)
    }
    if (e.response.data?.message) {
      return new HttpError(e.response.data.message, statusCode)
    }
    if (e.response.statusText) {
      return new HttpError(e.response.statusText, statusCode)
    }

    return new HttpError(`Http ${statusCode} error`, statusCode)
  }
  return e
}

// Create own axios instance with defaults.
const ApiService = axios.create({
  withCredentials: true,
  baseURL: API_ENDPOINT,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const AxiosInterceptor = ({ children }: any) => {
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const { userInfo } = useAuth()
  const handleError = useErrorHandler()

  useEffect(() => {
    console.log('useInfo ---> ', userInfo)

    const axiosReqInterceptor = ApiService.interceptors.request.use(
      (config: any) => {
        config.headers = {
          Authorization: `Bearer ${userInfo?.tokens?.access?.token}`,
          // language: i18next.language,
          'peer-language': i18next.language,
        }
        console.log('~!@# API request config: ', config)
        return config
      },
      (error: AxiosError) => {
        console.log('~!@# API request error: ', error)
        return error
      }
    )

    const axiosResInterceptor = ApiService.interceptors.response.use(
      (response: any) => {
        console.log('~!@# API response: ', response)
        return response
      },
      (error: AxiosError) => {
        const transformedError = transformAxiosError(error)
        console.log('~!@# API response error: ', error)
        console.log('~!@# API transformedError error: ', transformedError)

        // Auto redirect unauthenticated response to login page
        if (
          transformedError instanceof HttpError &&
          transformedError?.code === 401
        ) {
          snackbar.error(
            transformedError?.message
              ? transformedError.message
              : t('common.errors.unexpected.subTitle')
          )
          window.localStorage.clear()
          navigate('/login')
        }
        return Promise.reject(transformedError)
        // handleError(transformedError)
        // return Promise.reject(error)
      }
    )

    return () => {
      ApiService.interceptors.request.eject(axiosReqInterceptor)
      ApiService.interceptors.response.eject(axiosResInterceptor)
    }
  }, [navigate, userInfo])

  return children
}

export { ApiService, AxiosInterceptor }

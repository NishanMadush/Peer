// prettier-ignore
// eslint-disable
import React, { createContext, useContext, useState } from 'react'

import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_USER_INFO,
  LOCAL_STORAGE_USER_LANGUAGE,
  LOCAL_STORAGE_USER_PERMISSION,
  LOCAL_STORAGE_USER_TOKENS,
} from '../../../core/constants/localStorage'
import { useLocalStorage } from '../../../core/hooks/useLocalStorage'
import { useLogin } from '../hooks/useLogin'
import { useLogout } from '../hooks/useLogout'
import { AuthContextInterface } from '../interfacesAndTypes/authInfo'
import { ILocalUserInfo } from '../interfacesAndTypes/userInfo'

export const AuthContext = createContext({} as AuthContextInterface)

type AuthProviderProps = {
  children?: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps): any => {
  const [, setLocalPermissions] = useLocalStorage<any>(
    LOCAL_STORAGE_USER_PERMISSION,
    ''
  )
  const [localUserInfo, setLocalUserInfo] = useLocalStorage<any>(
    LOCAL_STORAGE_USER_INFO,
    ''
  )
  const [, setLocalUserLanguage] = useLocalStorage<any>(
    LOCAL_STORAGE_USER_LANGUAGE,
    ''
  )

  const { isLoggingIn, login } = useLogin()
  const { isLoggingOut, logout } = useLogout()
  const [userInfo, setUserInfo] = useState<ILocalUserInfo | undefined>(
    localUserInfo
  ) // Make ths undefined to keep user in one tab

  const hasRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) {
      return true
    }
    if (!userInfo) {
      return false
    }
    return roles.includes(userInfo.role)
  }

  const handleLogin = async (email: string, password: string) => {
    return login({ email, password })
      .then((data: any) => {
        // setAuthKey(data?.tokens?.access.token)
        // setTokenKey(data?.tokens)
        const loggedUserInfo = {
          ...data?.user,
          tokens: { ...data?.tokens },
        }
        setUserInfo(loggedUserInfo)
        setLocalPermissions(data?.permissions)
        setLocalUserInfo(loggedUserInfo)
        setLocalUserLanguage(data?.language)
        return data?.tokens?.access.token
      })
      .catch((err: any) => {
        // eslint-disable-next-line typesafe/no-throw-sync-func
        throw err
      })
  }

  const handleLogout = async () => {
    let refreshToken = ''
    try {
      refreshToken = `${userInfo?.tokens?.refresh?.token}` //tokenKey?.refresh.token
    } catch (error) {
      console.log('~!@# logout token error', error)
    }

    return logout(refreshToken)
      .then((data: any) => {
        return data
      })
      .catch((err: any) => {
        // eslint-disable-next-line typesafe/no-throw-sync-func
        throw err
      })
      .finally(() => {
        //logout from the client ignoring server response
        // setAuthKey('')
        // setTokenKey('')
        setUserInfo(undefined)
        setLocalPermissions('')
        setLocalUserInfo('')
        setLocalUserLanguage('')
      })
  }

  return (
    <AuthContext.Provider
      value={{
        hasRole,
        isLoggingIn: isLoggingIn ? isLoggingIn : false,
        isLoggingOut: isLoggingOut ? isLoggingOut : false,
        login: handleLogin,
        logout: handleLogout,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): any {
  return useContext(AuthContext)
}

export default AuthProvider

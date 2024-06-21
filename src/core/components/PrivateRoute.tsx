import { Navigate, Route, RouteProps } from 'react-router'

import { PUBLIC_LOGIN_ROUTE } from '../../modules/auth/constants/routes'
import { useAuth } from '../../modules/auth/contexts/AuthProvider'
import { COMMON_403_ROUTE } from '../constants/routes'
import { useLocalStorage } from '../hooks/useLocalStorage'

type PrivateRouteProps = {
  roles?: string[]
  permission?: string
} & RouteProps

const PrivateRoute = ({
  roles,
  permission,
  ...routeProps
}: PrivateRouteProps): JSX.Element => {
  const { hasRole, userInfo } = useAuth()
  const userPermissions = useLocalStorage('permissions', '')

  if (userInfo) {
    if (
      !hasRole(roles) ||
      !permission ||
      !userPermissions[0].includes(`${permission}`)
    ) {
      return <Navigate to={`/${COMMON_403_ROUTE}`} />
    }
    return <Route {...routeProps} />
  } else {
    return <Navigate to={`/${PUBLIC_LOGIN_ROUTE}`} />
  }
}

export default PrivateRoute

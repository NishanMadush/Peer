import { useAuth } from '../../auth/contexts/AuthProvider'

export function useCommonExceptions(error: any): any {
  console.log('~!@# error --> ', error)
  const { logout } = useAuth()

  logout().catch((error: any) =>
    // snackbar.error(
    //   error?.message ? error.message : t('common.errors.unexpected.subTitle')
    // )
    console.log('~!@# error happened')
  )
}

import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { ROOT_ROUTE } from '../../modules/baseUser/constants/routes'
import { ReactComponent as ForbiddenSvg } from '../assets/403.svg'
import Result from '../components/Result'

const Forbidden = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Result
      extra={
        <Button
          color="secondary"
          component={RouterLink}
          to={`/${ROOT_ROUTE}`}
          variant="contained"
        >
          {t('common.backHome')}
        </Button>
      }
      image={<ForbiddenSvg />}
      maxWidth="sm"
      subTitle={t('common.errors.forbidden.subTitle')}
      title={t('common.errors.unexpected.title')}
    />
  )
}

export default Forbidden

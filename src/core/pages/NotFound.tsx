import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import Result from '../../core/components/Result'
import { ROOT_ROUTE } from '../../modules/baseUser/constants/routes'
import { ReactComponent as NotFoundSvg } from '../assets/404.svg'

const NotFound = (): JSX.Element => {
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
      image={<NotFoundSvg />}
      maxWidth="sm"
      subTitle={t('common.errors.notFound.subTitle')}
      title={t('common.errors.notFound.title')}
    />
  )
}

export default NotFound

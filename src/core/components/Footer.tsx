import { Box, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { PUBLIC_BASE_ROUTE_URL } from '../constants/routes'

const Footer = (): JSX.Element => {
  return (
    <Box sx={{ p: 6 }} component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        {'© '}
        <Link
          color="inherit"
          component={RouterLink}
          to={`${PUBLIC_BASE_ROUTE_URL}/`}
        >
          {process.env.REACT_APP_NAME}
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  )
}

export default Footer

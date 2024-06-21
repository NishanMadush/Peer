import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, Toolbar, Typography } from '@mui/material'

import { useSettings } from '../../../core/contexts/SettingsProvider'

type BaseToolbarProps = {
  children?: React.ReactNode
  title?: string
}

const BaseToolbar = ({ children, title }: BaseToolbarProps): JSX.Element => {
  const { toggleDrawer } = useSettings()

  return (
    <Toolbar sx={{ px: { xs: 3, sm: 6 } }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer}
        sx={{
          display: { lg: 'none' },
          marginRight: 2,
          marginLeft: 2,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h2" component="h1" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {children}
    </Toolbar>
  )
}

export default BaseToolbar

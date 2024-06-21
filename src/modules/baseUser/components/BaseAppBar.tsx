import { AppBar } from '@mui/material'
import React from 'react'

import { drawerCollapsedWidth, drawerWidth } from '../../../core/config/layout'
import { useSettings } from '../../../core/contexts/SettingsProvider'

type BaseAppBarProps = {
  children: React.ReactNode
}

const BaseAppBar = ({ children }: BaseAppBarProps): JSX.Element => {
  const { collapsed } = useSettings()
  const width = collapsed ? drawerCollapsedWidth : drawerWidth

  return (
    <AppBar
      color="default"
      position="fixed"
      // sx={{
      //   width: { lg: `calc(100% - ${width}px)` },
      //   marginLeft: { lg: width },
      // }}
    >
      {children}
    </AppBar>
  )
}

export default BaseAppBar

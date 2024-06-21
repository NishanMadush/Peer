import { Box, BoxProps } from '@mui/material'

import { ReactComponent as LogoSvg } from '../assets/logo.svg'

type LogoProps = {
  colored?: boolean
  size?: number
} & BoxProps

const Logo = ({
  colored = false,
  size = 100,
  ...boxProps
}: LogoProps): JSX.Element => {
  return (
    <Box {...boxProps}>
      <LogoSvg
        height={size}
        // width={size}
        style={colored ? { backgroundColor: 'red' } : {}}
      />
    </Box>
  )
}

export default Logo

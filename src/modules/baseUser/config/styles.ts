import lodash from 'lodash'

import { useSettings } from '../../../core/contexts/SettingsProvider'

enum elementStyle {
  TableRowStart = 'table.start',
  TableRowEnd = 'table.end',
}

const styleWithDirection = {
  table: {
    start: {
      ltr: { borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' },
      rtl: { borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' },
    },
    end: {
      ltr: { borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' },
      rtl: { borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' },
    },
  },
}

const customStyles = (element: string): any => {
  const { direction } = useSettings()

  const style = lodash.get(styleWithDirection, `${element}.${direction}`)
  return style ?? {}
}

export { elementStyle, customStyles }

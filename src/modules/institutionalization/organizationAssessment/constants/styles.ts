import { SxProps, Theme } from '@mui/material'

export const assessmentRightStyles: Record<string, SxProps<Theme> | undefined> =
  {
    assessmentTable: {
      module: {
        textAlign: {
          textAlign: 'right',
        },
        textSpace: {
          mr: 3,
          float: 'right',
        },
      },
      indicator: {
        textAlign: {
          textAlign: 'right',
        },
        textSpace: {
          margin: 0,
          float: 'right',
        },
        radioSpace: {
          paddingRight: 0,
        },
      },
      rowStart: {
        borderTopRightRadius: '1rem',
        borderBottomRightRadius: '1rem',
      },
      rowEnd: {
        borderTopLeftRadius: '1rem',
        borderBottomLeftRadius: '1rem',
      },
    },
  }

export const assessmentLeftStyles: Record<string, SxProps<Theme> | undefined> =
  {
    assessmentTable: {
      module: {
        textAlign: {
          textAlign: 'left',
        },
        textSpace: {
          ml: 3,
          float: 'left',
        },
      },
      indicator: {
        textAlign: {
          textAlign: 'left',
        },
        textSpace: {
          margin: 0,
          float: 'left',
        },
        radioSpace: {
          paddingLeft: 0,
        },
      },
      rowStart: {
        borderTopLeftRadius: '1rem',
        borderBottomLeftRadius: '1rem',
      },
      rowEnd: {
        borderTopRightRadius: '1rem',
        borderBottomRightRadius: '1rem',
      },
    },
  }

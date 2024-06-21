import { SxProps, Theme } from '@mui/material'

export const assessmentRightStyles: Record<string, SxProps<Theme> | undefined> =
  {
    report: {
      base: {
        textAlign: {
          textAlign: 'right',
        },
      },
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
      subQuestion: {
        textAlign: {
          textAlign: 'right',
        },
      },
    },
  }

export const assessmentLeftStyles: Record<string, SxProps<Theme> | undefined> =
  {
    report: {
      base: {
        textAlign: {
          textAlign: 'left',
        },
      },
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
      subQuestion: {
        textAlign: {
          textAlign: 'left',
        },
      },
    },
  }

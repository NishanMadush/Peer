import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SchoolIcon from '@mui/icons-material/School'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material'
import lodash from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ITrainingComponentTile } from '../../../shared/interfaces/dashboard'

// const socials = [
//   {
//     bgcolor: 'primary.main',
//     icon: <ThumbUpIcon sx={{ color: '#fff' }} />,
//     name: '2023-Jan',
//     trend: <ArrowDropUpIcon sx={{ color: 'success.main' }} />,
//     unitKey: 'admin.home.followers.units.likes',
//     value: 'Country report',
//   },
//   {
//     bgcolor: 'error.main',
//     icon: <FavoriteIcon style={{ color: '#fff' }} />,
//     name: '4.2',
//     trend: <ArrowRightIcon sx={{ color: 'action.disabled' }} />,
//     unitKey: 'admin.home.followers.units.love',
//     value: 'Current institutionalization Score',
//   },
//   {
//     bgcolor: 'warning.main',
//     icon: <EmojiEmotionsIcon style={{ color: '#fff' }} />,
//     name: '2023-Jun',
//     trend: <ArrowDropDownIcon sx={{ color: 'error.main' }} />,
//     unitKey: 'admin.home.followers.units.smiles',
//     value: 'Next assessment',
//   },
// ]

const bgcolors = [
  'primary.main',
  'primary.main',
  'primary.main',
  'primary.main',
]

type PeerTrainingWidgetProps = {
  trainingComponentTiles: ITrainingComponentTile[]
}

const PeerTrainingWidget = ({
  trainingComponentTiles,
}: PeerTrainingWidgetProps): JSX.Element => {
  const { t } = useTranslation()

  if (!lodash.isArray(trainingComponentTiles)) {
    return <></>
  }

  return (
    <React.Fragment>
      {trainingComponentTiles.map((trainingComponent, index) => (
        <Card key={trainingComponent.code} sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              aria-label={`${trainingComponent.code} avatar`}
              sx={{ bgcolor: bgcolors[0], mr: 2 }}
            >
              {<SchoolIcon sx={{ color: '#fff' }} />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography component="div" variant="h6">
                {trainingComponent.code}
              </Typography>
              <Typography variant="body1" color="textSecondary" component="div">
                {trainingComponent.score}
              </Typography>
              <Typography sx={{ fontSize: 10 }}>
                {trainingComponent?.date}
                {trainingComponent?.country
                  ? ` | ${trainingComponent?.country}`
                  : ''}
              </Typography>
            </Box>
            {trainingComponent.score > 3 ? (
              <ArrowDropUpIcon sx={{ color: 'success.main' }} />
            ) : trainingComponent.score < 3 ? (
              <ArrowDropDownIcon sx={{ color: 'error.main' }} />
            ) : (
              <ArrowRightIcon sx={{ color: 'action.disabled' }} />
            )}
          </CardContent>
        </Card>
      ))}
    </React.Fragment>
  )
}

export default PeerTrainingWidget

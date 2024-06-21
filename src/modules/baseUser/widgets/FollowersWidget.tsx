import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const socials = [
  {
    bgcolor: 'primary.main',
    icon: <ThumbUpIcon sx={{ color: '#fff' }} />,
    name: '2023-Jan',
    trend: <ArrowDropUpIcon sx={{ color: 'success.main' }} />,
    unitKey: 'admin.home.followers.units.likes',
    value: 'Country report',
  },
  {
    bgcolor: 'error.main',
    icon: <FavoriteIcon style={{ color: '#fff' }} />,
    name: '4.2',
    trend: <ArrowRightIcon sx={{ color: 'action.disabled' }} />,
    unitKey: 'admin.home.followers.units.love',
    value: 'Current institutionalization Score',
  },
  {
    bgcolor: 'warning.main',
    icon: <EmojiEmotionsIcon style={{ color: '#fff' }} />,
    name: '2023-Jun',
    trend: <ArrowDropDownIcon sx={{ color: 'error.main' }} />,
    unitKey: 'admin.home.followers.units.smiles',
    value: 'Next assessment',
  },
]

const FollowersWidget = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      {socials.map((social) => (
        <Card key={social.name} sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              aria-label={`${social.name} avatar`}
              sx={{ bgcolor: social.bgcolor, mr: 2 }}
            >
              {social.icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography component="div" variant="h6">
                {social.value}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                {t(social.name)}
              </Typography>
            </Box>
            {social.trend}
          </CardContent>
        </Card>
      ))}
    </React.Fragment>
  )
}

export default FollowersWidget

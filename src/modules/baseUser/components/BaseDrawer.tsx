import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ApartmentIcon from '@mui/icons-material/Apartment'
import Assessment from '@mui/icons-material/Assessment'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BarChartIcon from '@mui/icons-material/BarChart'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FlagCircleIcon from '@mui/icons-material/FlagCircle'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import HomeIcon from '@mui/icons-material/Home'
import LanguageIcon from '@mui/icons-material/Language'
import PeopleIcon from '@mui/icons-material/People'
import PersonIcon from '@mui/icons-material/Person'
import PublicIcon from '@mui/icons-material/Public'
import SchoolIcon from '@mui/icons-material/School'
import SettingsIcon from '@mui/icons-material/Settings'
import TranslateIcon from '@mui/icons-material/Translate'
import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import lodash from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import Logo from '../../../core/components/Logo'
import { drawerCollapsedWidth, drawerWidth } from '../../../core/config/layout'
import { LOCAL_STORAGE_USER_PERMISSION } from '../../../core/constants/localStorage'
import { useSettings } from '../../../core/contexts/SettingsProvider'
import { useSnackbar } from '../../../core/contexts/SnackbarProvider'
import { useLocalStorage } from '../../../core/hooks/useLocalStorage'
import { useAuth } from '../../auth/contexts/AuthProvider'
import { COUNTRY_MANAGEMENT_PERMISSION } from '../../countries/constants/permissions'
import { COUNTRY_MANAGEMENT_ROUTE } from '../../countries/constants/routes'
import { INSTITUTIONALIZATION_COUNTRY_MANAGEMENT_PERMISSION } from '../../institutionalization/countryReview/constants/permission'
import { INSTITUTIONALIZATION_COUNTRIES_REVIEWS_MANAGEMENT_ROUTE } from '../../institutionalization/countryReview/constants/routes'
import { INSTITUTIONALIZATION_FORM_MANAGEMENT_PERMISSION } from '../../institutionalization/formTemplate/constants/permissions'
import { INSTITUTIONALIZATION_FORMS_TEMPLATES_MANAGEMENT_ROUTE } from '../../institutionalization/formTemplate/constants/routes'
import { INSTITUTIONALIZATION_ORGANIZATION_MANAGEMENT_PERMISSION } from '../../institutionalization/organizationAssessment/constants/permissions'
import {
  INSTITUTIONALIZATION_ORGANIZATIONS_ASSESSMENTS_MANAGEMENT_ROUTE,
  INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE,
} from '../../institutionalization/organizationAssessment/constants/routes'
import { LANGUAGE_MANAGEMENT_PERMISSION } from '../../languages/constants/permissions'
import { LANGUAGE_MANAGEMENT_ROUTE } from '../../languages/constants/routes'
import { ORGANIZATION_MANAGEMENT_PERMISSION } from '../../organizations/constants/permissions'
import { ORGANIZATION_MANAGEMENT_ROUTE } from '../../organizations/constants/routes'
import { REPORT_PERMISSION } from '../../reports/Institutionalization/constants/permissions'
import {
  REPORT_INSTITUTIONALIZATION_ASSESSMENT_ROUTE,
  REPORT_INSTITUTIONALIZATION_COUNTRY_IN_DETAIL_ROUTE,
  REPORT_INSTITUTIONALIZATION_COUNTRY_ROUTE,
  REPORT_INSTITUTIONALIZATION_ORGANIZATION_ROUTE,
} from '../../reports/Institutionalization/constants/routes'
import { USER_MANAGEMENT_PERMISSION } from '../../users/constants/permissions'
import { USER_MANAGEMENT_ROUTE } from '../../users/constants/routes'
import {
  DASHBOARD_PERMISSION,
  HELP_PERMISSION,
  HOME_PERMISSION,
  PROFILE_PERMISSION,
  SETTINGS_PERMISSION,
} from '../constants/permissions'
import {
  DASHBOARD_ROUTE,
  HELP_ROUTE,
  PROFILE_ROUTE,
  ROOT_ROUTE,
} from '../constants/routes'
import {
  IBaseDrawerBasicItem,
  IMenuItem,
} from '../interfacesAndTypes/baseDrawer'

import BaseAppBar from './BaseAppBar'
import BaseToolbar from './BaseToolbar'

//#region BaseDrawerItem

type BaseDrawerItemProps = {
  item: IBaseDrawerBasicItem
  title: string
  collapsed: boolean
  onListItemClick: (item: IBaseDrawerBasicItem) => void
}

const BaseDrawerItem = ({
  item,
  title,
  collapsed,
  onListItemClick,
}: BaseDrawerItemProps) => {
  const handleOnClick = () => {
    onListItemClick(item)
  }

  return item.rightIcon ? (
    <ListItemButton key={item.path} onClick={handleOnClick}>
      <ListItemAvatar>
        <Avatar sx={{ color: 'inherit', bgcolor: 'transparent' }}>
          <item.leftIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        sx={{
          display: collapsed ? 'none' : 'block',
        }}
      />
      {item.rightIcon === 'ExpandMoreIcon' ? (
        <ExpandMoreIcon />
      ) : item.rightIcon === 'ExpandLessIcon' ? (
        <ExpandLessIcon />
      ) : null}
    </ListItemButton>
  ) : (
    <ListItemButton
      component={NavLink}
      key={item.path}
      activeClassName="Mui-selected"
      end={true}
      to={`${item.path}`}
      onClick={handleOnClick}
    >
      <ListItemAvatar>
        <Avatar sx={{ color: 'inherit', bgcolor: 'transparent' }}>
          <item.leftIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        sx={{
          display: collapsed ? 'none' : 'block',
        }}
      />
    </ListItemButton>
  )
}

//#endregion

type BaseDrawerProps = {
  collapsed: boolean
  mobileOpen: boolean
  onDrawerToggle: () => void
  onSettingsToggle: () => void
}

export const menuItems = [
  // {
  //   leftIcon: HomeIcon,
  //   key: 'admin.drawer.menu.home',
  //   path: `/${ROOT_ROUTE}/${DASHBOARD_ROUTE}`,
  //   permission: DASHBOARD_PERMISSION,
  // },
  // {
  //   leftIcon: BarChartIcon,
  //   key: 'admin.drawer.menu.dashboard',
  //   path: `/${ROOT_ROUTE}`,
  //   permission: HOME_PERMISSION,
  // },
  // {
  //   leftIcon: AccountTreeIcon,
  //   key: 'admin.drawer.menu.masterData',
  //   path: `#`,
  //   permission: HOME_PERMISSION,
  //   subMenus: [
  //     {
  //       leftIcon: PublicIcon,
  //       key: 'admin.drawer.menu.countryManagement',
  //       path: `/${ROOT_ROUTE}/${COUNTRY_MANAGEMENT_ROUTE}`,
  //       permission: COUNTRY_MANAGEMENT_PERMISSION,
  //     },
  //     {
  //       leftIcon: TranslateIcon,
  //       key: 'admin.drawer.menu.languageManagement',
  //       path: `/${ROOT_ROUTE}/${LANGUAGE_MANAGEMENT_ROUTE}`,
  //       permission: LANGUAGE_MANAGEMENT_PERMISSION,
  //     },
  //   ],
  // },
  {
    leftIcon: HomeIcon,
    key: 'admin.drawer.menu.home',
    path: `/${ROOT_ROUTE}`,
    permission: DASHBOARD_PERMISSION,
  },
  {
    leftIcon: TranslateIcon,
    key: 'admin.drawer.menu.languageManagement',
    path: `/${ROOT_ROUTE}/${LANGUAGE_MANAGEMENT_ROUTE}`,
    permission: LANGUAGE_MANAGEMENT_PERMISSION,
  },
  {
    leftIcon: PublicIcon,
    key: 'admin.drawer.menu.countryManagement',
    path: `/${ROOT_ROUTE}/${COUNTRY_MANAGEMENT_ROUTE}`,
    permission: COUNTRY_MANAGEMENT_PERMISSION,
  },
  {
    leftIcon: ApartmentIcon,
    key: 'admin.drawer.menu.reportOrganization',
    path: `/${ROOT_ROUTE}/${ORGANIZATION_MANAGEMENT_ROUTE}`,
    permission: ORGANIZATION_MANAGEMENT_PERMISSION,
  },
  {
    leftIcon: PeopleIcon,
    key: 'admin.drawer.menu.userManagement',
    path: `/${ROOT_ROUTE}/${USER_MANAGEMENT_ROUTE}`,
    permission: USER_MANAGEMENT_PERMISSION,
  },
  {
    leftIcon: HelpCenterIcon,
    key: 'admin.drawer.menu.help',
    path: `/${ROOT_ROUTE}/${HELP_ROUTE}`,
    permission: HELP_PERMISSION,
  },
  {
    leftIcon: SchoolIcon,
    key: 'admin.drawer.menu.institutionalizationGroup',
    path: `#`,
    permission: HOME_PERMISSION,
    subMenus: [
      {
        leftIcon: AssignmentIcon,
        key: 'admin.drawer.menu.institutionalizationFormTemplate',
        path: `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_FORMS_TEMPLATES_MANAGEMENT_ROUTE}`,
        permission: INSTITUTIONALIZATION_FORM_MANAGEMENT_PERMISSION,
      },
      {
        leftIcon: AccessTimeFilledIcon,
        key: 'admin.drawer.menu.institutionalizationCountryReview',
        path: `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_COUNTRIES_REVIEWS_MANAGEMENT_ROUTE}`,
        permission: INSTITUTIONALIZATION_COUNTRY_MANAGEMENT_PERMISSION,
      },
      {
        leftIcon: BorderColorIcon,
        key: 'admin.drawer.menu.institutionalizationOrganizationAssessment',
        path: `/${ROOT_ROUTE}/${INSTITUTIONALIZATION_ORGANIZATIONS_HISTORY_MANAGEMENT_ROUTE}`,
        permission: INSTITUTIONALIZATION_ORGANIZATION_MANAGEMENT_PERMISSION,
      },
    ],
  },
  {
    leftIcon: Assessment,
    key: 'admin.drawer.menu.report',
    path: `#`,
    permission: REPORT_PERMISSION,
    subMenus: [
      {
        leftIcon: Assessment,
        key: 'admin.drawer.menu.reportCountry',
        path: `/${ROOT_ROUTE}/${REPORT_INSTITUTIONALIZATION_COUNTRY_ROUTE}`,
        permission: REPORT_PERMISSION,
      },
      {
        leftIcon: Assessment,
        key: 'admin.drawer.menu.reportOrganization',
        path: `/${ROOT_ROUTE}/${REPORT_INSTITUTIONALIZATION_ORGANIZATION_ROUTE}`,
        permission: REPORT_PERMISSION,
      },
      {
        leftIcon: Assessment,
        // key: 'admin.drawer.menu.reportCountryInDetail',
        key: 'admin.drawer.menu.reportAssessment',
        path: `/${ROOT_ROUTE}/${REPORT_INSTITUTIONALIZATION_COUNTRY_IN_DETAIL_ROUTE}`,
        permission: REPORT_PERMISSION,
      },
      // {
      //   leftIcon: Assessment,
      //   key: 'admin.drawer.menu.reportAssessment',
      //   path: `/${ROOT_ROUTE}/${REPORT_INSTITUTIONALIZATION_ASSESSMENT_ROUTE}`,
      //   permission: REPORT_PERMISSION,
      // },
    ],
  },
]

const BaseDrawer = ({
  collapsed,
  mobileOpen,
  onDrawerToggle,
  onSettingsToggle,
}: BaseDrawerProps): JSX.Element => {
  const { isLoggingOut, logout, userInfo } = useAuth()
  const { direction } = useSettings()
  const snackbar = useSnackbar()
  const { t } = useTranslation()

  const localPermissions = useLocalStorage(LOCAL_STORAGE_USER_PERMISSION, '')
  const userPermissions = localPermissions[0] ?? []

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  const width = collapsed ? drawerCollapsedWidth : drawerWidth

  const handleOnListItemClick = (item: IMenuItem) => {
    setOpenSubMenu(
      item?.subMenus && item?.key && item.key !== openSubMenu ? item.key : null
    )
  }
  const handleLogout = () => {
    logout().catch((error: any) =>
      snackbar.error(
        error?.message ? error.message : t('common.errors.unexpected.subTitle')
      )
    )
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* <Logo sx={{ display: 'flex', p: 4 }} /> */}
      <Logo sx={{ display: 'flex', p: 2 }} />
      <List component="nav" sx={{ px: 2 }}>
        {menuItems.map(
          (item: IMenuItem) =>
            userPermissions.includes(`${item.permission}`) && (
              <React.Fragment key={`item${item.key}`}>
                <BaseDrawerItem
                  key={item.path}
                  item={
                    item?.subMenus && item.key === openSubMenu
                      ? { ...item, rightIcon: 'ExpandLessIcon' }
                      : item.subMenus
                      ? { ...item, rightIcon: 'ExpandMoreIcon' }
                      : item
                  }
                  title={t(`common:${item.key}`)}
                  collapsed={collapsed}
                  onListItemClick={handleOnListItemClick}
                />
                <Collapse
                  in={item.key === openSubMenu}
                  timeout="auto"
                  unmountOnExit
                  sx={{ pl: collapsed ? 1 : 3 }}
                >
                  {item.subMenus &&
                    item.subMenus.map(
                      (subItem: IBaseDrawerBasicItem) =>
                        userPermissions.includes(`${subItem.permission}`) && (
                          <BaseDrawerItem
                            key={subItem.path}
                            item={subItem}
                            title={t(subItem.key)}
                            collapsed={collapsed}
                            onListItemClick={() => {
                              // console.log(subItem)
                            }}
                          />
                        )
                    )}
                </Collapse>
              </React.Fragment>
            )
        )}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <List component="nav" sx={{ p: 2 }}>
        {userPermissions.includes(PROFILE_PERMISSION) && (
          <ListItemButton
            component={NavLink}
            to={`/${ROOT_ROUTE}/${PROFILE_ROUTE}`}
          >
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            {userInfo && (
              <ListItemText
                primary={`${userInfo.firstName} ${userInfo.lastName}`}
                sx={{
                  display: collapsed ? 'none' : 'block',
                }}
              />
            )}
          </ListItemButton>
        )}
        {userPermissions.includes(SETTINGS_PERMISSION) && (
          <ListItemButton onClick={onSettingsToggle}>
            <ListItemAvatar>
              <Avatar>
                <SettingsIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t('admin.drawer.menu.settings')}
              sx={{
                display: collapsed ? 'none' : 'block',
              }}
            />
          </ListItemButton>
        )}
        <ListItemButton onClick={handleLogout}>
          <ListItemAvatar>
            <Avatar>
              <ExitToAppIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t('admin.drawer.menu.logout')}
            sx={{
              display: collapsed ? 'none' : 'block',
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <Box
      aria-label="Admin drawer"
      component="nav"
      sx={{
        width: { lg: width },
        flexShrink: { lg: 0 },
      }}
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        anchor={direction === 'ltr' ? 'left' : 'right'}
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        anchor={direction === 'ltr' ? 'left' : 'right'}
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default BaseDrawer

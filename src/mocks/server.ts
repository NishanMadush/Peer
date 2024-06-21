import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { API_ENDPOINT } from '../core/constants/apiEndpoints'
import {
  AUTH_USER_FORGOT_PASSWORD_ENDPOINT,
  AUTH_USER_INFO_ENDPOINT,
  AUTH_USER_LOGIN_ENDPOINT,
  AUTH_USER_LOGOUT_ENDPOINT,
  AUTH_USER_REGISTER_ENDPOINT,
  AUTH_USER_RESET_PASSWORD_ENDPOINT,
  AUTH_USER_UPDATE_PASSWORD_ENDPOINT,
} from '../modules/auth/constants/apiEndpoints'
import {
  ACTIVITY_LOGS_ENDPOINT,
  DASHBOARD_STAT_CURD_ENDPOINT,
  NOTIFICATION_CURD_ENDPOINT,
} from '../modules/baseUser/constants/apiEndpoints'
import dashboard from '../modules/baseUser/hooks/dashboard.json'
import { USERS_CRUD_ENDPOINT } from '../modules/users/constants/apiEndpoints'

// import { COUNTRIES_CRUD_ENDPOINT } from './../modules/countries/constants/apiEndpoints'
import activityLogs from './activityLogs.json'
import notifications from './notifications.json'
import profileInfo from './profileInfo.json'
import userInfo from './userInfo.json'
import users from './users.json'

function generateId() {
  return (Math.floor(Math.random() * 10000) + 1).toString()
}

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios, { delayResponse: 2000 })

// Activity
mock.onGet(`${API_ENDPOINT}/${ACTIVITY_LOGS_ENDPOINT}`).reply(200, activityLogs)

// Auth
mock
  .onPut(`${API_ENDPOINT}/${AUTH_USER_UPDATE_PASSWORD_ENDPOINT}`)
  .reply(({ data }) => [200, data])
mock.onPost(`${API_ENDPOINT}/${AUTH_USER_FORGOT_PASSWORD_ENDPOINT}`).reply(200)
mock.onPost(`${API_ENDPOINT}/${AUTH_USER_RESET_PASSWORD_ENDPOINT}`).reply(200)
// mock
//   .onPost(`${API_ENDPOINT}/${AUTH_USER_LOGIN_ENDPOINT}`)
//   .reply(200, 'AUTHKEY123')
mock.onPost(`${API_ENDPOINT}/${AUTH_USER_LOGOUT_ENDPOINT}`).reply(200)
mock.onPost(`${API_ENDPOINT}/${AUTH_USER_REGISTER_ENDPOINT}`).reply(201)
mock
  .onGet(`${API_ENDPOINT}/${AUTH_USER_INFO_ENDPOINT}`, {
    params: { key: 'AUTHKEY123' },
  })
  .reply(200, userInfo)

// Notifications
mock
  .onGet(`${API_ENDPOINT}/${NOTIFICATION_CURD_ENDPOINT}`)
  .reply(200, notifications)

// Profile
// mock
//   .onGet(`${API_ENDPOINT}/${USERS_PROFILE_CURD_ENDPOINT}`)
//   .reply(200, profileInfo)
// mock
//   .onPut(`${API_ENDPOINT}/${USERS_PROFILE_CURD_ENDPOINT}`)
//   .reply(({ data }) => [200, data])

// Users
mock
  .onDelete(`${API_ENDPOINT}/${USERS_CRUD_ENDPOINT}`)
  .reply(({ data }) => [200, data])
mock.onGet(`${API_ENDPOINT}/${USERS_CRUD_ENDPOINT}`).reply(200, users)
mock
  .onPost(`${API_ENDPOINT}/${USERS_CRUD_ENDPOINT}`)
  .reply(({ data }) => [201, { ...JSON.parse(data), id: generateId() }])
mock
  .onPut(`${API_ENDPOINT}/${USERS_CRUD_ENDPOINT}`)
  .reply(({ data }) => [200, data])

// //Dashboard
mock
  .onGet(`${API_ENDPOINT}/${DASHBOARD_STAT_CURD_ENDPOINT}`)
  .reply(200, dashboard)

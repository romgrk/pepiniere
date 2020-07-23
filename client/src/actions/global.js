import {
  UI,
  LOGGED_IN,
  LOG_IN,
  LOG_OUT,
  SHOW,
  SHOW_NOTIFICATION
} from '../constants/ActionTypes'
import { createAction, createAsyncAction, createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'

import openCentered from '../helpers/open-centered'
import settings from './settings.js'
import members from './members.js'
import categories from './categories.js'
import tasks from './tasks.js'
import runs from './runs.js'

const createPayload = (message, details) => ({ message, details })

export const showNotification = createAction(SHOW_NOTIFICATION)
export const showInfo         = createAction(SHOW.INFO, createPayload)
export const showSuccess      = createAction(SHOW.SUCCESS, createPayload)
export const showWarning      = createAction(SHOW.WARNING, createPayload)
export const showError        = createAction(SHOW.ERROR, createPayload)

export const showFAQ  = createAction(UI.SHOW_FAQ)
export const closeFAQ = createAction(UI.CLOSE_FAQ)

export const fetchAll = createAsyncAction(() => (dispatch, getState) => {
  const { ui: { loggedIn } } = getState()

  if (loggedIn.value === false && process.env.NODE_ENV !== 'development')
    return Promise.reject(new Error('Not logged in'))

  return Promise.all([
    settings.fetch(),
    members.fetch(),
    categories.fetch(),
    tasks.fetch(),
    runs.fetch(),
  ])
})

export const checkIsLoggedIn = createFetchActions(LOGGED_IN, requests.auth.isLoggedIn)
export const login = createAsyncAction((password) => (dispatch, getState) => {
  const { ui: { loggedIn } } = getState()

  if (loggedIn.value === true)
    return Promise.resolve()

  dispatch({ type: LOG_IN.REQUEST })

  return requests.auth.login(password)
    .then(isLoggedIn => {
      if (!isLoggedIn)
        return Promise.reject(new Error('Invalid password'))

      dispatch({ type: LOG_IN.RECEIVE, payload: isLoggedIn })
      return fetchAll()
    })
    .catch(error => {
      dispatch({ type: LOG_IN.ERROR, isError: true, error })
    })
})

export const logout = createAsyncAction(() => (dispatch, getState) => {
  const { ui: { loggedIn } } = getState()

  if (loggedIn.value === false)
    return Promise.resolve()

  dispatch({ type: LOG_OUT.REQUEST })

  return requests.auth.logout()
    .then(isLoggedOut => {
      dispatch({ type: LOG_OUT.RECEIVE, payload: !isLoggedOut })
      return isLoggedOut
    })
    .catch(error => {
      dispatch({ type: LOG_OUT.ERROR, isError: true, error })
      showError('Logout failed')
    })
})

export default {
  showNotification,
  showInfo,
  showSuccess,
  showWarning,
  showError,
  showFAQ,
  closeFAQ,
  checkIsLoggedIn,
  login,
  logout,
  fetchAll,
}

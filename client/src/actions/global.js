import {
  LOGGED_IN,
  LOG_IN,
  LOG_OUT,
  SHOW,
  SHOW_NOTIFICATION
} from '../constants/ActionTypes'
import { createAction, createAsyncAction, createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'

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

export const fetchAll = createAsyncAction(() => (dispatch, getState) => {
  const { auth: { loggedIn } } = getState()

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

export default {
  showNotification,
  showInfo,
  showSuccess,
  showWarning,
  showError,
  fetchAll,
}

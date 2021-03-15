/*
 * auth.js
 */

import {
  LOGGED_IN,
  LOG_IN,
  LOG_OUT,
} from '../constants/ActionTypes'
import syncSocket from '../helpers/sync-socket'
import { createAction, createAsyncAction, createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'
import sync from './sync'
import ui from './ui'

export const checkIsLoggedIn = createFetchActions(LOGGED_IN, requests.auth.isLoggedIn)

export const login = createAsyncAction((password) => (dispatch, getState) => {
  const { auth: { loggedIn } } = getState()

  if (loggedIn.value === true)
    return Promise.resolve()

  dispatch({ type: LOG_IN.REQUEST })
  ui.clearNotifications()

  return requests.auth.login(password)
    .then(isLoggedIn => {
      if (!isLoggedIn)
        return Promise.reject(new Error('Invalid password'))

      dispatch({ type: LOG_IN.RECEIVE, payload: isLoggedIn })

      syncSocket.start()
      return sync.all()
    })
    .catch(error => {
      dispatch({ type: LOG_IN.ERROR, isError: true, error })
    })
})

export const logout = createFetchActions(LOG_OUT, requests.auth.logout)

export default {
  checkIsLoggedIn,
  login,
  logout,
}

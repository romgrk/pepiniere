/*
 * auth.js
 */

import {
  LOGGED_IN,
  LOG_IN,
  LOG_OUT,
} from '../constants/ActionTypes'
import { createAction, createAsyncAction, createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'
import global from './global'

export const checkIsLoggedIn = createFetchActions(LOGGED_IN, requests.auth.isLoggedIn)
export const login = createAsyncAction((password) => (dispatch, getState) => {
  const { auth: { loggedIn } } = getState()

  if (loggedIn.value === true)
    return Promise.resolve()

  dispatch({ type: LOG_IN.REQUEST })

  return requests.auth.login(password)
    .then(isLoggedIn => {
      if (!isLoggedIn)
        return Promise.reject(new Error('Invalid password'))

      dispatch({ type: LOG_IN.RECEIVE, payload: isLoggedIn })
      return global.fetchAll()
    })
    .catch(error => {
      dispatch({ type: LOG_IN.ERROR, isError: true, error })
    })
})

export const logout = createAsyncAction(() => (dispatch, getState) => {
  const { auth: { loggedIn } } = getState()

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
      global.showError('Logout failed')
    })
})

export default {
  checkIsLoggedIn,
  login,
  logout,
}

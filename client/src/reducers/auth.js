/*
 * auth.js
 */


import {
  LOGGED_IN,
  LOG_IN,
  LOG_OUT,
} from '../constants/ActionTypes'

const initialState = {
  loggedIn: {
    isLoading: false,
    value: false,
  },
}

export default function auth(state = initialState, action) {
  if (action.isError) {
    if (action.payload === 'Not authenticated')
      return { loggedIn: { isLoading: false, value: false } }
  }

  switch (action.type) {
    case LOGGED_IN.REQUEST:
      return { ...state, loggedIn: { ...state.loggedIn, isLoading: true } }
    case LOGGED_IN.RECEIVE:
      return { ...state, loggedIn: { isLoading: false, value: action.payload } }
    case LOGGED_IN.ERROR:
      return { ...state, loggedIn: { isLoading: false, value: false } }

    case LOG_IN.REQUEST:
      return { ...state, loggedIn: { ...state.loggedIn, isLoading: true } }
    case LOG_IN.RECEIVE:
      return { ...state, loggedIn: { isLoading: false, value: action.payload } }
    case LOG_IN.ERROR:
      return { ...state, loggedIn: { isLoading: false, value: false } }

    case LOG_OUT.REQUEST:
      // Let's just be optimist about this one
      return { ...state, loggedIn: { ...state.loggedIn, isLoading: false, value: false } }
    case LOG_OUT.RECEIVE:
      return { ...state, loggedIn: { isLoading: false, value: action.payload } }
    case LOG_OUT.ERROR:
      return { ...state, loggedIn: { ...state.loggedIn, isLoading: false } }

    default:
      return state
  }
}

import { startOfToday, addDays } from 'date-fns'
import {
  LOGGED_IN,
  LOG_IN,
  LOG_OUT,
  SHOW,
  SHOW_NOTIFICATION,
  UI
} from '../constants/ActionTypes'

const initialState = {
  currentDate: addDays(startOfToday(), 1),
  loggedIn: {
    isLoading: false,
    value: false,
  },
  notifications: [],
}

export default function ui(state = initialState, action) {
  if (action.isError) {
    console.error(action.error)

    const message =
      (action.error.fromServer ? 'Server ' : '')
      + action.error.message
    const details = undefined

    let update = {}

    if (action.payload === 'Not authenticated')
      update = { loggedIn: { isLoading: false, value: false } }

    return {
      ...state,
      notifications: state.notifications.concat({
        type: 'error',
        message: message,
        details: details,
      }),
      ...update,
    }
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
      return { ...state, loggedIn: { ...state.loggedIn, isLoading: true } }
    case LOG_OUT.RECEIVE:
      return { ...state, loggedIn: { isLoading: false, value: action.payload } }
    case LOG_OUT.ERROR:
      return { ...state, loggedIn: { ...state.loggedIn, isLoading: false } }

    case UI.SET_CURRENT_DATE:
      return { ...state, currentDate: action.payload }

    case SHOW_NOTIFICATION:
      return { ...state, notifications: state.notifications.concat(action.payload) }
    case SHOW.INFO:
      return { ...state, notifications: state.notifications.concat({ type: 'info', ...action.payload }) }
    case SHOW.SUCCESS:
      return { ...state, notifications: state.notifications.concat({ type: 'success', ...action.payload }) }
    case SHOW.WARNING:
      return { ...state, notifications: state.notifications.concat({ type: 'warning', ...action.payload }) }
    case SHOW.ERROR:
      return { ...state, notifications: state.notifications.concat({ type: 'error', ...action.payload }) }

    default:
      return state
  }
}

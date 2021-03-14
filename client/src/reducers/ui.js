import { startOfToday, addDays } from 'date-fns'
import {
  SHOW,
  SHOW_NOTIFICATION,
  UI
} from '../constants/ActionTypes'

const initialState = {
  metadata: {},
  didInitialLoad: false,
  currentDate: addDays(startOfToday(), 1),
  notifications: [],
  clearNotificationsBefore: null,
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
    case UI.SET_METADATA:
      return { ...state, metadata: action.payload }

    case UI.SET_CURRENT_DATE:
      return { ...state, currentDate: action.payload }

    case UI.SET_DID_LOAD:
      return { ...state, didInitialLoad: true }

    case UI.CLEAR_NOTIFICATIONS:
      return { ...state, clearNotificationsBefore: Date.now() }
    case UI.SHOW_NOTIFICATION:
      return { ...state, notifications: state.notifications.concat(action.payload) }
    case UI.SHOW_INFO:
      return { ...state, notifications: state.notifications.concat({ type: 'info', date: Date.now(), ...action.payload }) }
    case UI.SHOW_SUCCESS:
      return { ...state, notifications: state.notifications.concat({ type: 'success', date: Date.now(), ...action.payload }) }
    case UI.SHOW_WARNING:
      return { ...state, notifications: state.notifications.concat({ type: 'warning', date: Date.now(), ...action.payload }) }
    case UI.SHOW_ERROR:
      return { ...state, notifications: state.notifications.concat({ type: 'error', date: Date.now(), ...action.payload }) }

    default:
      return state
  }
}

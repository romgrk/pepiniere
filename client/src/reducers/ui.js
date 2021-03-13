import { startOfToday, addDays } from 'date-fns'
import {
  SHOW,
  SHOW_NOTIFICATION,
  UI
} from '../constants/ActionTypes'

const initialState = {
  didInitialLoad: false,
  currentDate: addDays(startOfToday(), 1),
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
    case UI.SET_CURRENT_DATE:
      return { ...state, currentDate: action.payload }

    case UI.SET_DID_LOAD:
      return { ...state, didInitialLoad: true }

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

import {
  createModelConstants,
  createNetworkConstants,
  createConstants
} from '../helpers/create-actions.js'

// UI
export const UI = createConstants('UI', [
  'SET_CURRENT_DATE',
  'SET_DID_LOAD',
  // Notifications
  'CLEAR_NOTIFICATIONS',
  'SHOW_NOTIFICATION',
  'SHOW_INFO',
  'SHOW_SUCCESS',
  'SHOW_WARNING',
  'SHOW_ERROR',
])

export const LOGGED_IN = createNetworkConstants('LOGGED_IN')
export const LOG_IN = createNetworkConstants('LOG_IN')
export const LOG_OUT = createNetworkConstants('LOG_OUT')

export const SETTINGS = createModelConstants('SETTINGS', [
  'CHANGE_PASSWORD',
  'RESTORE_BACKUP',
])
export const MEMBERS = createModelConstants('MEMBERS')
export const CATEGORIES = createModelConstants('CATEGORIES')
export const TASKS = createModelConstants('TASKS')
export const RUNS = createModelConstants('RUNS', ['ADD_MEMBER', 'REMOVE_MEMBER'])

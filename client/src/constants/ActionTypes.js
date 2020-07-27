import {
  createModelConstants,
  createNetworkConstants,
  createConstants
} from '../helpers/create-actions.js'

// UI
export const UI = createConstants('UI', [
  'SET_CURRENT_DATE',
  'ADD_FILTERING_CATEGORY',
  'DELETE_FILTERING_CATEGORY',
  'SET_FILTERING_CATEGORIES',
])

export const LOGGED_IN = createNetworkConstants('LOGGED_IN')
export const LOG_IN = createNetworkConstants('LOG_IN')
export const LOG_OUT = createNetworkConstants('LOG_OUT')

// Notifications
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
export const SHOW = {
  INFO:    'SHOW.INFO',
  SUCCESS: 'SHOW.SUCCESS',
  WARNING: 'SHOW.WARNING',
  ERROR:   'SHOW.ERROR',
}
export const SETTINGS = createModelConstants('SETTINGS', ['CHANGE_PASSWORD'])
export const MEMBERS = createModelConstants('MEMBERS')
export const CATEGORIES = createModelConstants('CATEGORIES')
export const TASKS = createModelConstants('TASKS')
export const RUNS = createModelConstants('RUNS')

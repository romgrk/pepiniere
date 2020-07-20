import {
  createModelConstants,
  createNetworkConstants,
  createConstants
} from '../helpers/create-actions.js'

// UI
export const UI = createConstants('UI', [
  'SHOW_FAQ',
  'CLOSE_FAQ',
  'ADD_FILTERING_CATEGORY',
  'DELETE_FILTERING_CATEGORY',
  'SET_FILTERING_CATEGORIES',
])

export const LOGGED_IN = createNetworkConstants('LOGGED_IN')
// Notifications
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
export const SHOW = {
  INFO:    'SHOW.INFO',
  SUCCESS: 'SHOW.SUCCESS',
  WARNING: 'SHOW.WARNING',
  ERROR:   'SHOW.ERROR',
}
export const SETTINGS = createModelConstants('SETTINGS')
export const MEMBERS = createModelConstants('MEMBERS')
export const CATEGORIES = createModelConstants('CATEGORIES')
export const TASKS = createModelConstants('TASKS')
export const RUNS = createModelConstants('RUNS')

import { combineReducers } from 'redux'

import ui from './ui.js'
import auth from './auth.js'
import settings from './settings.js'
import members from './members.js'
import categories from './categories.js'
import tasks from './tasks.js'
import runs from './runs.js'

const rootReducer = combineReducers({
  ui,
  auth,
  settings,
  members,
  categories,
  tasks,
  runs,
})

export default rootReducer

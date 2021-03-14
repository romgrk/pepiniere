import { createAsyncAction } from '../helpers/create-actions'
import { saveStore } from '../store'
import * as requests from '../requests'

import ui from './ui.js'
import auth from './auth.js'
import settings from './settings.js'
import members from './members.js'
import categories from './categories.js'
import tasks from './tasks.js'
import runs from './runs.js'

export const fetchAll = createAsyncAction(() => (dispatch, getState) => {
  const { auth: { loggedIn } } = getState()

  if (loggedIn.value === false && process.env.NODE_ENV !== 'development')
    return Promise.reject(new Error('Not logged in'))

  settings.fetch.request()
  members.fetch.request()
  categories.fetch.request()
  tasks.fetch.request()
  runs.fetch.request()

  return requests.sync.all().then(response => {

    settings.fetch.receive(response.settings)
    members.fetch.receive(response.members)
    categories.fetch.receive(response.categories)
    tasks.fetch.receive(response.tasks)
    runs.fetch.receive(response.runs)

    ui.setDidLoad()
    // saveStore() // FIXME: uncomment this
  })
  .catch(err => {
    if (err.message === 'Not authenticated' && getState().auth.loggedIn.value) {
      auth.logout.receive()
      ui.showInfo('Your session has expired. Please login again.')
    } else {
      ui.showError(err.message)
    }

    settings.fetch.error()
    members.fetch.error()
    categories.fetch.error()
    tasks.fetch.error()
    runs.fetch.error()
  })
})

export default {
  fetchAll,
}

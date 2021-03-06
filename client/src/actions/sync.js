import { indexBy, prop, merge as assign } from 'rambda'
import { createAsyncAction } from '../helpers/create-actions'
import * as store from '../store'
import * as requests from '../requests'

import syncSocket from '../helpers/sync-socket'
import ui from './ui.js'
import auth from './auth.js'
import settings from './settings.js'
import members from './members.js'
import categories from './categories.js'
import tasks from './tasks.js'
import runs from './runs.js'

const indexById = indexBy(prop('id'))


export const init = () => {
  return store.init().then(storeInstance => {
    // Hydrate data
    hydrate(store.getSyncData())

    // Sync data
    all()
    .then(() => { syncSocket.start() })
    .catch(err => {
      /* Ignore, user not authenticated */
      console.error(err)
    })

    // Setup interval check, in case the WebSocket
    // isn't available
    setInterval(() => {
      if (syncSocket.isAlive()) return
      if (!storeInstance.getState().auth.loggedIn.value) return
      all()
    }, 15 * 1000)

    return storeInstance
  })
  .catch(err => {
    ui.showError('An error occurred while initializing the app: ' + err.message)
    // Clear the store as we don't know how the data is
    store.clear()
  })
}

export const hydrate = (syncData) => {
  if (!syncData)
    return
  try {
    ui.setMetadata(syncData.metadata)
    settings.fetch.receive(syncData.settings)
    members.fetch.receive(syncData.members)
    categories.fetch.receive(syncData.categories)
    tasks.fetch.receive(syncData.tasks)
    runs.fetch.receive(syncData.runs)
  } catch(err) {
    console.error('Error while hydrating syncData')
    console.error(err)
    store.clear()
    return false
  }
  return true
}

export const all = createAsyncAction(() => (dispatch, getState) => {
  const { ui: { metadata }, auth: { loggedIn } } = getState()

  if (loggedIn.value === false && process.env.NODE_ENV !== 'development')
    return Promise.reject(new Error('Not logged in'))

  settings.fetch.request()
  members.fetch.request()
  categories.fetch.request()
  tasks.fetch.request()
  runs.fetch.request()

  return requests.sync.all(metadata).then(response => {
    const syncData = combine(store.getSyncData(), response)
    store.setSyncData(syncData)

    const didHydrate = hydrate(syncData)
    if (didHydrate) {
      store.save()
      ui.setMetadata(syncData.metadata)
    }
    else {
      store.clear()
      ui.setMetadata({})
    }

    ui.setDidLoad()
  })
  .catch(err => {
    if (err.message === 'Not authenticated') {
      if (getState().auth.loggedIn.value) {
        auth.logout.receive()
        ui.showInfo('Your session has expired. Please login again.')
      }
    } else {
      ui.showError(err.message)
    }

    settings.fetch.error()
    members.fetch.error()
    categories.fetch.error()
    tasks.fetch.error()
    runs.fetch.error()

    return Promise.reject(err)
  })
})

export default {
  init,
  all,
  hydrate,
}


// Helpers

/** Combines syncData instances */
function combine(previous = {}, updated) {
  return {
    metadata: updated.metadata,
    categories: combineRows(previous.categories, updated.categories),
    members: combineRows(previous.members, updated.members),
    runs: combineRows(previous.runs, updated.runs),
    settings: combineRows(previous.settings, updated.settings),
    tasks: combineRows(previous.tasks, updated.tasks),
  }
}

function combineRows(previousRows = [], updatedRows) {
  const previousById = indexById(previousRows)
  const updatedById = indexById(updatedRows)
  const rowsById = assign(previousById, updatedById)
  const newRows = Object.values(rowsById).filter(row => row.deleted !== 1)
  return newRows
}

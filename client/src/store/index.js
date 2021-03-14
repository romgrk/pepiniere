/* eslint-disable global-require */

import storage from 'localforage'
import { clone } from 'rambda'

import { setStore } from '../helpers/create-actions'

const configureStore = (
  process.env.NODE_ENV === 'production' ?
    require('./store.prod') :
    require('./store.dev')
).default

const STORE_KEY = 'SAVED_APP_STATE'

let store

export default function initializeStore() {
  return storage.getItem(STORE_KEY).then(data => {
    let initialState = {}
    try {
      if (data)
        initialState = JSON.parse(data)
    } catch(err) {
      console.error('Error while parsing initial state')
      console.error(err)
    }

    store = configureStore(initialState)
    setStore(store)
    return store
  })
}

export function getStore() {
  return store
}

export function saveStore() {
  const state = clone(store.getState())
  delete state.ui
  traverse(state, (key, value, node) => {
    if (key === 'isLoading' || key === 'isCreating')
      node[key] = false
  })
  const serialized = JSON.stringify(state)
  storage.setItem(STORE_KEY, serialized)
}

function traverse(root, fn) {
  Object.keys(root).forEach(key => {
    const value = root[key]
    if (typeof value === 'object' && value !== null)
      traverse(value, fn)
    else
      fn(key, value, root)
  })
}

/*
 * Unload listener
 */

const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload'
const visibilityEvent = 'visibilitychange'

window.addEventListener(terminationEvent, saveStore)
window.addEventListener(visibilityEvent,  saveStore)


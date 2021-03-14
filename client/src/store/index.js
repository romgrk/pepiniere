/* eslint-disable global-require */

import storage from 'localforage'
import { clone } from 'rambda'

import { setStore } from '../helpers/create-actions'

window.clearStore = clear

const configureStore = (
  process.env.NODE_ENV === 'production' ?
    require('./store.prod') :
    require('./store.dev')
).default

const STORE_KEY = 'SAVED_APP_STATE'

let store
let syncData

export default function initializeStore() {
  return storage.getItem(STORE_KEY).then(data => {
    let initialState = {}
    try {
      if (data) {
        const deserialized = JSON.parse(data)
        initialState = deserialized.state
        syncData = deserialized.syncData
      }
    } catch(err) {
      console.error('Error while parsing initial state')
      console.error(err)
    }

    store = configureStore(initialState)
    setStore(store)
    return store
  })
}

export function get() {
  return store
}

export function save(d) {
  const { auth } = store.getState()
  const state = { auth }

  const serialized = JSON.stringify({
    state,
    syncData,
  })

  storage.setItem(STORE_KEY, serialized)
}

export function clear() {
  syncData = undefined
  storage.removeItem(STORE_KEY)
}

export function getSyncData() {
  return syncData
}

export function setSyncData(d) {
  if (d && d.bubbles)
    debugger
  syncData = d
}

/*
 * Unload listener
 */

const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload'
const visibilityEvent = 'visibilitychange'

window.addEventListener(terminationEvent, save)
window.addEventListener(visibilityEvent,  save)


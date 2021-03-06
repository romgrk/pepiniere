import {
  set,
  lensPath,
  map,
  indexBy,
  prop,
} from 'rambda'
import { SETTINGS } from '../constants/ActionTypes'

import toLoadable from '../helpers/to-loadable'

const initialState = {
  isLoading: false,
  data: {}
}

export default function settings(state = initialState, action) {
  switch (action.type) {
    case SETTINGS.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case SETTINGS.FETCH.RECEIVE:
      return { ...state, isLoading: false, data:
        toLoadable(map(prop('value'), indexBy(prop('id'), action.payload))) }
    case SETTINGS.FETCH.ERROR:
      return { ...state, isLoading: false }
    case SETTINGS.UPDATE.REQUEST:
      return set(lensPath(['data', action.payload.key, 'isLoading']), true, state)
    case SETTINGS.UPDATE.RECEIVE:
      return set(lensPath(['data', action.meta.key]), { isLoading: false, data: action.meta.value }, state)
    case SETTINGS.UPDATE.ERROR:
      return set(lensPath(['data', action.meta.key, 'isLoading']), false, state)
    default:
      return state
  }
}

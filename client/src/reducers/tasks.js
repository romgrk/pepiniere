import {
  set,
  lensPath,
  indexBy,
  prop,
  assoc,
  dissoc,
} from 'ramda'
import { TASKS } from '../constants/ActionTypes'

import toLoadable from '../helpers/to-loadable'

const initialState = {
  isLoading: false,
  isCreating: false,
  data: {}
}

export default function members(state = initialState, action) {
  switch (action.type) {

    case TASKS.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case TASKS.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: toLoadable(indexBy(prop('id'), action.payload)) }
    case TASKS.FETCH.ERROR:
      return { ...state, isLoading: false }

    case TASKS.CREATE.REQUEST:
      return { ...state, isCreating: true }
    case TASKS.CREATE.RECEIVE:
      return { ...state, isCreating: false, data:
        assoc(action.payload.id, { isLoading: false, data: action.payload }, state.data) }
    case TASKS.CREATE.ERROR:
      return { ...state, isCreating: false }

    case TASKS.UPDATE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case TASKS.UPDATE.RECEIVE:
      return set(lensPath(['data', action.meta.id]), { isLoading: false, data: action.payload }, state)
    case TASKS.UPDATE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), false, state)

    case TASKS.DELETE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case TASKS.DELETE.RECEIVE:
      return { ...state, data: dissoc(action.meta.id, state.data) }
    case TASKS.DELETE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), true, state)

    default:
      return state
  }
}

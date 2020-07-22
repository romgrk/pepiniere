import {
  set,
  lensPath,
  indexBy,
  prop,
  assoc,
  dissoc
} from 'ramda'
import { RUNS } from '../constants/ActionTypes'

import toLoadable from '../helpers/to-loadable'

const initialState = {
  isLoading: false,
  isCreating: false,
  data: {}
}

export default function runs(state = initialState, action) {
  switch (action.type) {

    case RUNS.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case RUNS.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: toLoadable(indexBy(prop('id'), action.payload)) }
    case RUNS.FETCH.ERROR:
      return { ...state, isLoading: false }

    case RUNS.CREATE.REQUEST:
      return { ...state, isCreating: true }
    case RUNS.CREATE.RECEIVE:
      return { ...state, isCreating: false, data:
        assoc(action.payload.id, { isLoading: false, data: action.payload }, state.data) }
    case RUNS.CREATE.ERROR:
      return { ...state, isCreating: false }

    case RUNS.UPDATE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case RUNS.UPDATE.RECEIVE:
      return set(lensPath(['data', action.meta.id]), { isLoading: false, data: action.payload }, state)
    case RUNS.UPDATE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), false, state)

    case RUNS.DELETE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case RUNS.DELETE.RECEIVE:
      return { ...state, data: dissoc(action.meta.id, state.data) }
    case RUNS.DELETE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), true, state)

    default:
      return state
  }
}

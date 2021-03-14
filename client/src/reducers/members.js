import {
  set,
  lensPath,
  indexBy,
  prop,
  assoc,
  dissoc,
} from 'rambda'
import { MEMBERS } from '../constants/ActionTypes'

import toLoadable from '../helpers/to-loadable'

const initialState = {
  isLoading: false,
  isCreating: false,
  data: {}
}

export default function members(state = initialState, action) {
  switch (action.type) {

    case MEMBERS.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case MEMBERS.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: toLoadable(indexBy(prop('id'), action.payload)) }
    case MEMBERS.FETCH.ERROR:
      return { ...state, isLoading: false }

    case MEMBERS.CREATE.REQUEST:
      return { ...state, isCreating: true }
    case MEMBERS.CREATE.RECEIVE:
      return { ...state, isCreating: false, data:
        assoc(action.payload.id, { isLoading: false, data: action.payload }, state.data) }
    case MEMBERS.CREATE.ERROR:
      return { ...state, isCreating: false }

    case MEMBERS.UPDATE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case MEMBERS.UPDATE.RECEIVE:
      return set(lensPath(['data', action.meta.id]), { isLoading: false, data: action.payload }, state)
    case MEMBERS.UPDATE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), false, state)

    case MEMBERS.DELETE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case MEMBERS.DELETE.RECEIVE:
      return { ...state, data: dissoc(action.meta.id, state.data) }
    case MEMBERS.DELETE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), true, state)

    default:
      return state
  }
}

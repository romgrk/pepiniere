import {
  indexBy,
  prop,
  assoc,
  dissoc,
} from 'rambda'
import { set, merge } from 'object-path-immutable'
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
      return set(state, ['data', action.payload.id, 'isLoading'], true)
    case RUNS.UPDATE.RECEIVE:
      return set(state, ['data', action.meta.id], { isLoading: false, data: action.payload })
    case RUNS.UPDATE.ERROR:
      return set(state, ['data', action.meta.id, 'isLoading'], false)

    case RUNS.ADD_MEMBER.REQUEST:
      return merge(state, ['data', action.payload.id], {
        isLoading: true,
        data: {
          membersId:
            state.data[action.payload.id].data.membersId.concat({
              isLoading: true,
              id: action.payload.memberId,
            })
        }
      })
    case RUNS.ADD_MEMBER.RECEIVE:
      return merge(state, ['data', action.meta.id], {
        isLoading: true,
        data: {
          membersId:
            state.data[action.meta.id].data.membersId.map(mId =>
              mId.id === action.meta.memberId ? mId.id : mId)
        }
      })
    case RUNS.ADD_MEMBER.ERROR:
      return merge(state, ['data', action.meta.id], {
        isLoading: false,
        data: {
          membersId:
            state.data[action.meta.id].data.membersId.filter(mId =>
              typeof mId === 'number' ?
                mId !== action.meta.memberId :
                mId.id !== action.meta.memberId)
        }
      })

    case RUNS.REMOVE_MEMBER.REQUEST:
      return merge(state, ['data', action.payload.id], {
        isLoading: true,
        data: {
          membersId:
            state.data[action.payload.id].data.membersId.filter(mId =>
              typeof mId === 'number' ?
                mId !== action.payload.memberId :
                mId.id !== action.payload.memberId)
        }
      })
    case RUNS.REMOVE_MEMBER.RECEIVE:
      return set(state, ['data', action.meta.id, 'isLoading'], false)
    case RUNS.REMOVE_MEMBER.ERROR:
      return merge(state, ['data', action.payload.id], {
        isLoading: false,
        data: {
          membersId:
            state.data[action.meta.id].data.membersId.concat(action.meta.memberId)
        }
      })

    case RUNS.DELETE.REQUEST:
      return set(state, ['data', action.payload.id, 'isLoading'], true)
    case RUNS.DELETE.RECEIVE:
      return { ...state, data: dissoc(action.meta.id, state.data) }
    case RUNS.DELETE.ERROR:
      return set(state, ['data', action.meta.id, 'isLoading'], true)

    default:
      return state
  }
}

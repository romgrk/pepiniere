import { UI } from '../constants/ActionTypes'
import { createAction } from '../helpers/create-actions'


export const setCurrentDate          = createAction(UI.SET_CURRENT_DATE)
export const setDidLoad              = createAction(UI.SET_DID_LOAD)

export default {
  setCurrentDate,
  setDidLoad,
}

import { UI } from '../constants/ActionTypes'
import { createAction } from '../helpers/create-actions'


const createPayload = (message, details) => ({ message, details })


export const setMetadata             = createAction(UI.SET_METADATA)
export const setCurrentDate          = createAction(UI.SET_CURRENT_DATE)
export const setDidLoad              = createAction(UI.SET_DID_LOAD)

export const clearNotifications = createAction(UI.CLEAR_NOTIFICATIONS, createPayload)
export const showNotification   = createAction(UI.SHOW_NOTIFICATION)
export const showInfo           = createAction(UI.SHOW_INFO, createPayload)
export const showSuccess        = createAction(UI.SHOW_SUCCESS, createPayload)
export const showWarning        = createAction(UI.SHOW_WARNING, createPayload)
export const showError          = createAction(UI.SHOW_ERROR, createPayload)

export default {
  setMetadata,
  setCurrentDate,
  setDidLoad,
  clearNotifications,
  showNotification,
  showInfo,
  showSuccess,
  showWarning,
  showError,
}

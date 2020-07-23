import { SETTINGS } from '../constants/ActionTypes'

import { createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'

const settings = {
  fetch:  createFetchActions(SETTINGS.FETCH,  requests.settings.list),
  update: createFetchActions(SETTINGS.UPDATE, requests.settings.update,
    (key, value) => ({ key, value }),
    (res, key, value) => ({ key, value }),
    (err, key, value) => ({ key, value })),
  changePassword: createFetchActions(SETTINGS.CHANGE_PASSWORD, requests.settings.changePassword,
    (password, newPassword) => ({ password, newPassword }),
    (res, password, newPassword) => ({ password, newPassword }),
    (err, password, newPassword) => ({ password, newPassword })),
}

export default settings

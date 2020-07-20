import { MEMBERS } from '../constants/ActionTypes'

import { createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'

const members = {
  fetch:  createFetchActions(MEMBERS.FETCH,  requests.members.list),
  update: createFetchActions(MEMBERS.UPDATE, requests.members.update,
    (id, data) => ({ id, data }),
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
  create: createFetchActions(MEMBERS.CREATE, requests.members.create,
    (data) => ({ data }),
    (res, data) => ({ data }),
    (err, data) => ({ data })),
  delete: createFetchActions(MEMBERS.DELETE, requests.members.delete,
    (id) => ({ id }),
    (res, id) => ({ id }),
    (err, id) => ({ id })),
}
export default members

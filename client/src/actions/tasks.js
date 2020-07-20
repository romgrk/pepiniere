import { TASKS } from '../constants/ActionTypes'

import { createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'

const tasks = {
  fetch:  createFetchActions(TASKS.FETCH,  requests.tasks.list),
  update: createFetchActions(TASKS.UPDATE, requests.tasks.update,
    (id, data) => ({ id, data }),
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
  create: createFetchActions(TASKS.CREATE, requests.tasks.create,
    (data) => ({ data }),
    (res, data) => ({ data }),
    (err, data) => ({ data })),
  delete: createFetchActions(TASKS.DELETE, requests.tasks.delete,
    (id) => ({ id }),
    (res, id) => ({ id }),
    (err, id) => ({ id })),
}
export default tasks

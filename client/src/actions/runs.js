import { RUNS } from '../constants/ActionTypes'

import { createFetchActions } from '../helpers/create-actions'
import * as requests from '../requests'

const runs = {
  fetch:  createFetchActions(RUNS.FETCH,  requests.runs.list),
  update: createFetchActions(RUNS.UPDATE, requests.runs.update,
    (id, data) => ({ id, data }),
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
  create: createFetchActions(RUNS.CREATE, requests.runs.create,
    (data) => ({ data }),
    (res, data) => ({ data }),
    (err, data) => ({ data })),
  delete: createFetchActions(RUNS.DELETE, requests.runs.delete,
    (id) => ({ id }),
    (res, id) => ({ id }),
    (err, id) => ({ id })),
}
export default runs

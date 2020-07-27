import { UI } from '../constants/ActionTypes'
import { createAction } from '../helpers/create-actions'


export const setCurrentDate    = createAction(UI.SET_CURRENT_DATE)
export const addFilteringCategory    = createAction(UI.ADD_FILTERING_CATEGORY)
export const deleteFilteringCategory = createAction(UI.DELETE_FILTERING_CATEGORY)
export const setFilteringCategories   = createAction(UI.SET_FILTERING_CATEGORIES)

export default {
  setCurrentDate,
  addFilteringCategory,
  deleteFilteringCategory,
  setFilteringCategories,
}

/*
 * models.js
 */

import {
  startOfToday,
  endOfToday,
} from 'date-fns'



export function isVisibleToday(member) {
  const { data: { isPermanent, startDate, endDate } } = member
  if (isPermanent)
    return true
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (start < startOfToday() && end > endOfToday())
    return true
  return false
}

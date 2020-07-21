/*
 * models.js
 */

import {
  startOfToday,
  endOfToday,
} from 'date-fns'



export function abbreviate(name) {
  if (!name)
    return ''
  return name.slice(0, 1) + '.'
}



export function isVisibleAtDate(member, date) {
  const { data: { isPermanent, startDate, endDate } } = member
  if (isPermanent)
    return true
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (start < date && end > date)
    return true
  return false
}

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

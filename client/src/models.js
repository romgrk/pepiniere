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

export function isVisibleAfterToday(member) {
  const { data: { isPermanent, startDate } } = member
  if (isPermanent)
    return false
  const start = new Date(startDate)
  if (start > startOfToday())
    return true
  return false
}


export function compareRun(a, b) {
  const da = new Date(a.data.date)
  const db = new Date(b.data.date)
  const ia = a.data.isAM
  const ib = b.data.isAM

  if (da < db)
    return -1

  if (da > db)
    return +1

  if (ia && !ib)
    return -1

  if (!ia && ib)
    return +1

  return 0
}

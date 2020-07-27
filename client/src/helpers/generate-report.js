/*
 * generate-report.js
 */

import xlsx from 'sheetjs-style'
import SpreadsheetColumn from 'spreadsheet-column'
import {
  map,
  compose,
  reduce,
  groupBy,
  flatten,
  filter,
  sortBy,
  identity,
  uniq,
} from 'rambda'

const spreadsheetCoords = new SpreadsheetColumn({ zero: true })


const parseYear  = r => +r.date.slice(0, 4)
const parseMonth = r => +r.date.slice(5, 7) - 1
const parseDay   = r => +r.date.slice(8, 10)

const groupByMonth = groupBy(parseMonth)
const groupByDay   = groupBy(parseDay)

const reduceMembersId = compose(uniq, reduce((acc, { membersId }) => acc.concat(membersId), []))


export default function generateReport(year, runs, members, categories, tasks) {
  const book  = xlsx.utils.book_new()
  const sheet = xlsx.utils.json_to_sheet([])

  const runsForYear = filter(r => parseYear(r) === year, runs)

  const runsByMonth = groupByMonth(runsForYear)
  const runsByTask = groupBy(r => r.taskId, runs)
  const runsByCategory = groupBy(r => tasks[r.taskId].categoryId, runs)

  const months = sortBy(identity, Object.keys(runsByMonth).map(Number))
  const tasksId = Object.keys(runsByTask)
  const categoriesId = Object.keys(runsByCategory)

  const tasksIdByCategory = groupBy(taskId => tasks[taskId].categoryId, tasksId)
  const tasksIdInOrder = flatten(map(categoryId => tasksIdByCategory[categoryId], categoriesId))
  const columnByTaskId = {}

  const DATA_START_COLUMN = 4
  const DATA_END_COLUMN = DATA_START_COLUMN + tasksIdInOrder.length
  const DATA_START_ROW  = 2
  const VOLUNTEER_COLUMN = 3

  let row

  // Row 1: categories
  row = 0
  sheet[p(row, 0)] = { t: 's', v: '' }
  sheet[p(row, 1)] = { t: 's', v: '' }
  sheet[p(row, 2)] = { t: 's', v: '' }
  sheet[p(row, 3)] = { t: 's', v: '' }
  {
    let previousTasks = 0

    categoriesId.forEach(categoryId => {
      const category = categories[categoryId]
      sheet[p(row, DATA_START_COLUMN + previousTasks)] = {
        t: 's',
        v: category.name,
        s: {
          font: { bold: true, color: { rgb: 'FF' + category.color.slice(1) } },
          alignment: { horizontal: 'center', vertical: 'center' },
        }
      }
      const length = tasksIdByCategory[categoryId].length

      mergeCells(
        sheet,
        c(0, DATA_START_COLUMN + previousTasks),
        c(0, DATA_START_COLUMN + previousTasks + length - 1)
      )

      previousTasks += length
    })
  }

  // Row 2: tasks
  row = 1
  sheet[p(row, 0)] = { t: 's', v: 'Month',  s: { font: { bold: true } } }
  sheet[p(row, 1)] = { t: 's', v: 'Day',  s: { font: { bold: true } } }
  sheet[p(row, 2)] = { t: 's', v: 'Name', s: { font: { bold: true } } }
  sheet[p(row, 3)] = { t: 's', v: 'Vol.', s: { font: { bold: true } } }
  {
    let previousTasks = 0

    categoriesId.forEach(categoryId => {
      const tasksId = tasksIdByCategory[categoryId]

      tasksId.forEach(taskId => {
        const task = tasks[taskId]
        const column = DATA_START_COLUMN + previousTasks
        columnByTaskId[taskId] = column

        sheet[p(row, column)] = {
          t: 's',
          v: task.name,
          s: {
            font: { bold: true },
            alignment: { vertical: 'center' },
          }
        }

        previousTasks += 1
      })
    })
  }

  // Data rows
  row = 2
  months.forEach(month => {
    const runs = runsByMonth[month]
    const runsByDay = groupByDay(runs)
    const days = sortBy(identity, Object.keys(runsByDay).map(Number))

    let monthStartRow = row

    days.forEach(day => {
      const runs = runsByDay[day]
      const membersId = reduceMembersId(runs)

      sheet[p(row, 1)] = {
        t: 's',
        v: day,
        s: {
          font: { bold: true, sz: '16' },
          alignment: { horizontal: 'center', vertical: 'center' },
        }
      }
      mergeCells(sheet, c(row, 1), c(row + membersId.length - 1, 1))

      membersId.forEach((memberId, i) => {
        const member = members[memberId]
        const runsForMember = filter(r => r.membersId.includes(memberId), runs)

        sheet[p(row + i, 2)] = { t: 's', v: getMemberName(member, memberId) }
        sheet[p(row + i, 3)] = { t: 'n', v: getMemberVolunteer(member, memberId) }
        runsForMember.forEach(r => {
          const column = columnByTaskId[r.taskId]
          sheet[p(row + i, column)] = { t: 'n', v: 4 }
        })
      })

      row += membersId.length
    })

    sheet[p(monthStartRow, 0)] = {
      t: 's',
      v: getMonthName(month),
      s: {
        font: { bold: true, sz: '16' },
        alignment: { horizontal: 'center', vertical: 'center' },
      }
    }
    mergeCells(sheet, c(monthStartRow, 0), c(row - 1, 0))
  })
  const DATA_END_ROW = row

  // Total hours row
  row += 1
  sheet[p(row, 0)] = { t: 's', v: 'TOTAL HOURS', s: { font: { bold: true } } }
  mergeCells(sheet, c(row, 0), c(row, 2))
  tasksIdInOrder.forEach((_, i) => {
    const column = DATA_START_COLUMN + i
    sheet[p(row, column)] = {
      t: 'n',
      f: `=SUM(${p(DATA_START_ROW, column)}:${p(DATA_END_ROW, column)})`,
      s: {
        font: { bold: true },
        alignment: { vertical: 'center' },
      }
    }
  })
  const TOTAL_HOURS_ROW = row

  // Task/category percentage row
  row += 1
  sheet[p(row, 0)] = { t: 's', v: '% TASK/CATEGORY', s: { font: { bold: true } } }
  mergeCells(sheet, c(row, 0), c(row, 2))
  {
    let previousTasks = 0

    categoriesId.forEach(categoryId => {
      const tasks = tasksIdByCategory[categoryId]

      const startColumn = DATA_START_COLUMN + previousTasks
      const endColumn = startColumn + tasks.length - 1

      tasks.forEach((_, index) => {
        const column = startColumn + index
        sheet[p(row, column)] = {
          t: 'n',
          f: `=${p(row - 1, column)}/SUM(${p(row - 1, startColumn)}:${p(row - 1, endColumn)})`,
          s: {
            font: { bold: true },
          }
        }
      })

      previousTasks += tasks.length
    })
  }

  // Total percentage row
  row += 1
  sheet[p(row, 0)] = { t: 's', v: '% TASK/TOTAL', s: { font: { bold: true } } }
  mergeCells(sheet, c(row, 0), c(row, 2))
  {
    let previousTasks = 0

    categoriesId.forEach(categoryId => {
      const tasks = tasksIdByCategory[categoryId]

      const totalRow = row + 3
      const totalColumn = VOLUNTEER_COLUMN

      tasks.forEach((_, index) => {
        const column = DATA_START_COLUMN + previousTasks + index
        sheet[p(row, column)] = {
          t: 'n',
          f: `=${p(row - 2, column)}/${p(totalRow, totalColumn)}`,
          s: {
            font: { bold: true },
          }
        }
      })

      previousTasks += tasks.length
    })
  }

  // Category/total percentage row
  row += 1
  sheet[p(row, 0)] = { t: 's', v: '% CATEGORY/TOTAL', s: { font: { bold: true } } }
  mergeCells(sheet, c(row, 0), c(row, 2))
  {
    const hoursRow = row - 3

    let previousTasks = 0

    categoriesId.forEach(categoryId => {
      const tasks = tasksIdByCategory[categoryId]

      const totalRow = row + 2
      const totalColumn = VOLUNTEER_COLUMN

      const startColumn = DATA_START_COLUMN + previousTasks
      const endColumn   = startColumn + tasks.length - 1

      sheet[p(row, startColumn)] = {
        t: 'n',
        f: `=SUM(${p(hoursRow, startColumn)}:${p(hoursRow, endColumn)})/${p(totalRow, totalColumn)}`,
        s: {
          font: { bold: true },
          alignment: { horizontal: 'center' },
        }
      }
      mergeCells(
        sheet,
        c(row, startColumn),
        c(row, endColumn)
      )

      previousTasks += tasks.length
    })
  }

  // Total volunteer days row
  row += 1
  sheet[p(row, 0)] = { t: 's', v: 'TOTAL VOLUNTEER DAYS', s: { font: { bold: true } } }
  mergeCells(sheet, c(row, 0), c(row, 2))
  {
    const column = VOLUNTEER_COLUMN
    sheet[p(row, column)] = {
      t: 'n',
      f: `=SUM(${p(DATA_START_ROW, column)}:${p(DATA_END_ROW, column)})`,
      s: {
        font: { bold: true },
        alignment: { vertical: 'center' },
      }
    }
  }

  // Total hours all row
  row += 1
  sheet[p(row, 0)] = { t: 's', v: 'TOTAL HOURS (ALL)', s: { font: { bold: true } } }
  mergeCells(sheet, c(row, 0), c(row, 2))
  {
    const column = VOLUNTEER_COLUMN
    sheet[p(row, column)] = {
      t: 'n',
      f: `=SUM(${p(TOTAL_HOURS_ROW, DATA_START_COLUMN)}:${p(TOTAL_HOURS_ROW, DATA_END_COLUMN)})`,
      s: {
        font: { bold: true },
        alignment: { vertical: 'center' },
      }
    }
  }

  // Finalize & append sheet
  sheet['!cols'] = [
    { wch: 6 },
    { wch: 6 },
    { wch: 25 },
    { wch: 4 },
  ]
  setRef(sheet)
  xlsx.utils.book_append_sheet(book, sheet, 'Report')

  const output = xlsx.write(book, { bookType: 'xlsx', bookSST:false, type:'array' })

  return output
}


// Date helpers

function getMonthName(index) {
  const date = new Date()
  date.setMonth(index)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  return month
}


// XLSX helpers

/* p for position */
function p(row, column) {
  return `${spreadsheetCoords.fromInt(column)}${row + 1}`
}

/* c for cell */
function c(row, column) {
  return { c: column, r: row }
}

function mergeCells(sheet, start, end) {
  const merges = sheet['!merges'] || []
  merges.push({
    s: start,
    e: end,
  })
  sheet['!merges'] = merges
}

function setRef(sheet) {
  const keys = Object.keys(sheet)

  let maxRow    = 0
  let maxColumn = 0

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (key.startsWith('!'))
      continue

    const [_, letters, digits] = key.match(/(\D+)(\d+)/)
    const row    = +digits
    const column = spreadsheetCoords.fromStr(letters)

    if (row > maxRow)
      maxRow = row

    if (column > maxColumn)
      maxColumn = column
  }

  sheet['!ref'] = `A1:${p(maxRow, maxColumn)}`
}


// Model helpers

function getMemberName(member, id) {
  if (!member)
    return `[DELETED ${id}]`

  return [member.firstName, member.lastName].join(' ')
}

function getMemberVolunteer(member, id) {
  if (!member)
    return ''
  return member.isPermanent ? '' : '1'
}

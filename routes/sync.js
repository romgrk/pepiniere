const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')

const Category = require('../models/category.js')
const Member = require('../models/member.js')
const Run = require('../models/run.js')
const Settings = require('../models/settings.js')
const Task = require('../models/task.js')

/* GET all items */
router.post('/all', (req, res, next) => {
  const after = req.body.after
  const params = { after }

  Promise.all([
    Category.findAll(params),
    Member.findAll(params),
    Run.findAll(params),
    Settings.findAll(params),
    Task.findAll(params),
  ])
  .then(([
    categories,
    members,
    runs,
    settings,
    tasks
  ]) => ({
    categories, members, runs, settings, tasks
  }))
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router

const express = require('express')
const router = express.Router()

const { readRoute, writeRoute } = require('../helpers/handlers.js')
const Task = require('../models/task.js')

/* GET members list */
router.get('/list', readRoute((req) =>
  Task.findAll()
))

/* GET single member */
router.get('/get/:id', readRoute((req) =>
  Task.findById(req.params.id)
))

/* POST create member */
router.use('/create', writeRoute((req) =>
  Task.create(req.body)
))

/* POST update member */
router.use('/update/:id', writeRoute((req) =>
  Task.update({ ...req.body, id: req.params.id })
))

/* POST delete member */
router.use('/delete/:id', writeRoute((req) =>
  Task.delete(req.params.id)
))


module.exports = router

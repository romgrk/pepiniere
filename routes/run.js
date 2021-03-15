const express = require('express')
const router = express.Router()

const { readRoute, writeRoute } = require('../helpers/handlers.js')
const Run = require('../models/run.js')

/* GET members list */
router.get('/list', readRoute(() =>
  Run.findAll()
))

/* GET single member */
router.get('/get/:id', writeRoute((req) =>
  Run.findById(req.params.id)
))

/* POST create member */
router.use('/create', writeRoute((req) =>
  Run.create(req.body)
))

/* POST update run */
router.use('/update/:id', writeRoute((req) =>
  Run.update({ ...req.body, id: req.params.id })
))

/* POST add member */
router.use('/add-member/:id/:memberId', writeRoute((req) =>
  Run.addMember(req.params.id, +req.params.memberId)
))

/* POST remove member */
router.use('/remove-member/:id/:memberId', writeRoute((req) =>
  Run.removeMember(req.params.id, +req.params.memberId)
))

/* POST delete member */
router.use('/delete/:id', writeRoute((req) =>
  Run.delete(req.params.id)
))


module.exports = router

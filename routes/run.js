const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const Run = require('../models/run.js')

/* GET members list */
router.get('/list', (req, res, next) => {
  Run.findAll()
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single member */
router.get('/get/:id', (req, res, next) => {
  Run.findById(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST create member */
router.use('/create', (req, res, next) => {
  Run.create(req.body)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update run */
router.use('/update/:id', (req, res, next) => {
  Run.update({ ...req.body, id: req.params.id })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST add member */
router.use('/add-member/:id/:memberId', (req, res, next) => {
  Run.addMember(req.params.id, +req.params.memberId)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST remove member */
router.use('/remove-member/:id/:memberId', (req, res, next) => {
  Run.removeMember(req.params.id, +req.params.memberId)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST delete member */
router.use('/delete/:id', (req, res, next) => {
  Run.delete(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router

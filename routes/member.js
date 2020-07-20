const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const Member = require('../models/member.js')

/* GET members list */
router.get('/list', (req, res, next) => {
  Member.findAll()
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single member */
router.get('/get/:id', (req, res, next) => {
  Member.findById(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update member */
router.use('/update/:id', (req, res, next) => {
  Member.update({ ...req.body, id: req.params.id })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST delete member */
router.use('/delete/:id', (req, res, next) => {
  Member.delete(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router

const express = require('express')
const router = express.Router()

const { imageHandler, errorHandler, readRoute, writeRoute } = require('../helpers/handlers.js')
const Member = require('../models/member.js')

/* GET members list */
router.get('/list', readRoute((req, res, next) =>
  Member.findAll()
))

/* GET single member */
router.get('/get/:id', readRoute((req, res, next) =>
  Member.findById(req.params.id)
))

/* GET member profile */
router.get('/photo/:id', (req, res, next) => {
  Member.findPhotoById(req.params.id)
  .then(imageHandler(res))
  .catch(errorHandler(res))
})

/* POST create member */
router.use('/create', writeRoute((req, res, next) =>
  Member.create(req.body)
))

/* POST update member */
router.use('/update/:id', writeRoute((req, res, next) =>
  Member.update({ ...req.body, id: req.params.id })
))

/* POST delete member */
router.use('/delete/:id', writeRoute((req, res, next) =>
  Member.delete(req.params.id)
))


module.exports = router

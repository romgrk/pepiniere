const express = require('express')
const router = express.Router()

const { readRoute, writeRoute } = require('../helpers/handlers.js')
const Category = require('../models/category.js')

/* GET members list */
router.get('/list', readRoute((req, res, next) =>
  Category.findAll()
))

/* GET single member */
router.get('/get/:id', readRoute((req, res, next) =>
  Category.findById(req.params.id)
))

/* POST create member */
router.use('/create', writeRoute((req, res, next) =>
  Category.create(req.body)
))

/* POST update member */
router.use('/update/:id', writeRoute((req, res, next) =>
  Category.update({ ...req.body, id: req.params.id })
))

/* POST delete member */
router.use('/delete/:id', writeRoute((req, res, next) =>
  Category.delete(req.params.id)
))


module.exports = router

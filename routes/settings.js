const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const Settings = require('../models/settings.js')

/* GET users list */
router.get('/list', (req, res, next) => {
  Settings.findAll()
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update setting */
router.use('/update/:key', (req, res, next) => {
  if (req.params.key === 'password')
    return errorHandler(res)(new Error('use /settings/change-password'))

  Settings.update(req.params.key, req.body.value)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST change password */
router.use('/change-password', (req, res, next) => {
  Settings.validatePassword(req.body.password)
  .then(() => Settings.changePassword(req.body.newPassword))
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST restore backup */
router.use('/restore-backup', (req, res, next) => {
  Settings.restoreBackup(req.files.file)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router

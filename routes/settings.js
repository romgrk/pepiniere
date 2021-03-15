const express = require('express')
const router = express.Router()

const { readRoute, writeRoute } = require('../helpers/handlers.js')
const Settings = require('../models/settings.js')

/* GET users list */
router.get('/list', readRoute((req, res, next) =>
  Settings.findAll()
))

/* POST update setting */
router.use('/update/:id', writeRoute((req, res, next) => {
  if (req.params.id === 'password')
    return Promise.reject(new Error('use /settings/change-password'))

  return Settings.update(req.params.id, req.body.value)
}))

/* POST change password */
router.use('/change-password', writeRoute((req, res, next) =>
  Settings.validatePassword(req.body.password)
    .then(() => Settings.changePassword(req.body.newPassword))
))

/* POST restore backup */
router.use('/restore-backup', writeRoute((req, res, next) =>
  Settings.restoreBackup(req.files.file)
))

module.exports = router

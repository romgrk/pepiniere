const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const passport = require('../passport')


/* GET check if user is logged in */
router.use('/is-logged-in', (req, res) => {
  (
    req.isAuthenticated() ?
      Promise.resolve(true) :
      Promise.resolve(false)
  )
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST login */
router.use('/login',
  passport.authenticate('local',
    { failureRedirect: '/api/auth/login-failure' }
  ),
  (req, res) => {
    dataHandler(res)(true)
})
router.use('/login-failure', (req, res) => {
  dataHandler(res)(false)
})

/* POST logout */
router.use('/logout', (req, res) => {
  const sessionID = req.sessionID
  req.logout()

  req.app.wss.getWss().clients.forEach(client => {
    if (client.sessionID === sessionID) {
      client.close()
    }
  })

  dataHandler(res)(true)
})


module.exports = router

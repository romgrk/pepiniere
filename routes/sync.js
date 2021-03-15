const WebSocket = require('ws')
const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const socketClients = require('../helpers/socket-clients.js')

const Category = require('../models/category.js')
const Member = require('../models/member.js')
const Run = require('../models/run.js')
const Settings = require('../models/settings.js')
const Task = require('../models/task.js')

let wss

/* GET all items */
router.post('/all', (req, res, next) => {

  /* If this changes, we send a full update to the client */
  const id = 1
  /* Last update time  in seconds. We remove 1 min to 
   * ensure no data is missed in case of long requests. */
  const lastUpdate = Math.floor(Date.now() / 1000) - 1 * 60
  /* Whether or not this is a full sync */
  const full  = req.body.id !== id || !Boolean(req.body.lastUpdate)

  const metadata = { id, lastUpdate, full }

  /* Should contain the last `metadata` sent to the client */
  const params = full ? {} : req.body

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
    tasks,
  ]) => ({
    // Metadata
    metadata,
    // Data
    categories,
    members,
    runs,
    settings,
    tasks,
  }))
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* WS endpoint */
router.ws('/socket', (ws, req) => {
  wss = req.app.wss

  if (!req.isAuthenticated())
    return ws.close(401)

  ws.sessionID = req.sessionID

  ws.on('message', (msg) => {
    console.log(msg)
  })
})

socketClients.on('update', req => {
  if (!wss)
    return

  wss.getWss().clients.forEach(client => {
    /* Skip origin of this update */
    if (req.sessionID === client.sessionID)
      return
    if (client.readyState === WebSocket.OPEN) {
      client.send('update-available')
    }
  })
})


module.exports = router

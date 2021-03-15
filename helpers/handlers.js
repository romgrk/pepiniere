/*
 * handlers.js
 */

const socketClients = require('./socket-clients')

const errorHandler = res => err => {
  res.json({
    ok: false,
    message: err.toString(),
    type: err.type,
    stack: err.stack.split('\n')
  })
  res.end()
}

const dataHandler = res => data => {
  res.json({ ok: true, data: data })
  res.end()
}

const imageHandler = res => data => {
  res.contentType('image/png')
  res.end(data, 'binary')
}

const okHandler = res => data => {
  res.json({ ok: true })
  res.end()
}

const socketHandler = req => data => {
  socketClients.emit('update', req)
  return data
}

const readRoute = fn => {
  return (req, res, next) =>
    fn(req, res, next)
      .then(dataHandler(res))
      .catch(errorHandler(res))
}

const writeRoute = fn => {
  return (req, res, next) =>
    fn(req, res, next)
      .then(socketHandler(req))
      .then(dataHandler(res))
      .catch(errorHandler(res))
}

module.exports = {
  errorHandler,
  dataHandler,
  imageHandler,
  okHandler,
  socketHandler,
  readRoute,
  writeRoute,
}

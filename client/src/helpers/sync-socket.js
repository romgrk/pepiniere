import sync from '../actions/sync'
import * as store from '../store'

const HOST =
  process.env.NODE_ENV === 'production' ?
    window.location.host : 'localhost:3001'


let connectionWanted = false
let socket = null

function spawn() {
  if (socket)
    return

  if (!window.WebSocket)
    return

  socket = new window.WebSocket(`ws://${HOST}/api/sync/socket`)

  socket.addEventListener('open', () => {
    socket.send('connected')
  })

  socket.addEventListener('message', data => {
    console.log('message', data)
    sync.all()
  })

  socket.addEventListener('error', err => {
    console.log('error', err)
  })

  socket.addEventListener('close', data => {
    socket = null

    if (store.get().getState().auth.loggedIn.value === false) {
      console.log('Connection closed and user is logged out.')
      stop()
      return 
    }

    if (connectionWanted) {
      console.log('Connection closed. Retrying in 15 seconds.')
      setTimeout(spawn, 15 * 1000)
    }
  })
}

function close() {
  if (!socket)
    return
  socket.close()
  socket = null
}


export function start() {
  connectionWanted = true
  spawn()
}

export function stop() {
  connectionWanted = false
  close()
}

export function isAlive() {
  return Boolean(socket)
}

export default { start, stop, isAlive }

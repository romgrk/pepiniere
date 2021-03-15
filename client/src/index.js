import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import ws from 'ws'
import 'font-awesome/css/font-awesome.min.css'

import initializeStore, { getSyncData } from './store'
import App from './App'
import sync from './actions/sync'
import syncSocket from './helpers/sync-socket'
import registerServiceWorker from './helpers/registerServiceWorker'
import './helpers/platform-detect.js'
import './styles/index.scss'

window.ALLOW_DELETION = false


console.log(`Mode: ${process.env.NODE_ENV}`)

initializeStore().then(store => {
  // Hydrate sync data
  sync.hydrate(getSyncData())

  // Render app
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

  // Sync data
  sync.all()
  .then(() => {
    syncSocket.start()
  })
  .catch(err => {
    /* Ignore, user not authenticated */
    console.error(err)
  })

  setInterval(() => {
    if (syncSocket.isAlive())
      return
    if (!store.getState().auth.loggedIn.value)
      return
    sync.all()
  }, 15 * 1000)
})

// Register service worker
registerServiceWorker()



// HMR

if (module.hot) {
  /* eslint-disable global-require */

  module.hot.accept(['./App'], () => {
    const NextApp = require('./App').default;
    render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.querySelector('#root')
    )
  })

  module.hot.accept('./styles/index.scss', () =>
    require('./styles/index.scss'))
}

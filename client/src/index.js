import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'font-awesome/css/font-awesome.min.css'

import initializeStore from './store'
import App from './App'
import global from './actions/global'
import auth from './actions/auth'
import registerServiceWorker from './helpers/registerServiceWorker'
import './helpers/platform-detect.js'
import './styles/index.scss'


window.ALLOW_DELETION = false

initializeStore().then(store => {

  // Render app
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

  auth.checkIsLoggedIn().then(isLoggedIn => {
    if (isLoggedIn)
      global.fetchAll()
  })

  setInterval(() => {
    const state = store.getState()
    if (state.auth.loggedIn.value)
      global.fetchAll()
  }, 60 * 1000)
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

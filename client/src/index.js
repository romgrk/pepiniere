import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'font-awesome/css/font-awesome.min.css'

import './helpers/platform-detect.js'

import store from './store'
import App from './App'
import registerServiceWorker from './helpers/registerServiceWorker'
import isLocalhost from './helpers/is-localhost.js'

import './styles/index.css'

import * as requests from './requests.js'
import global from './actions/global'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)



if (false) {
  global.checkIsLoggedIn.receive(true)
  global.fetchAll()
}
else /* production */ {
  global.checkIsLoggedIn()
  .then(isLoggedIn => {
    if (isLoggedIn)
      global.fetchAll()
  })
}

setInterval(() => {
  const state = store.getState()
  if (state.ui.loggedIn.value)
    global.fetchAll()
}, 60 * 1000)



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

  module.hot.accept('./styles/index.css', () =>
    require('./styles/index.css'))
}

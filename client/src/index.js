import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'font-awesome/css/font-awesome.min.css'

import './helpers/platform-detect.js'

import store from './store'
import App from './App'
import registerServiceWorker from './helpers/registerServiceWorker'

import './styles/index.scss'

import global from './actions/global'


window.ALLOW_DELETION = false

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)


if (false /* process.env.NODE_ENV === 'development' */) {
  global.checkIsLoggedIn.receive(true)
  global.fetchAll()
}
else {
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

  module.hot.accept('./styles/index.scss', () =>
    require('./styles/index.scss'))
}

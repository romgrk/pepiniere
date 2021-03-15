import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'font-awesome/css/font-awesome.min.css'

import App from './App'
import sync from './actions/sync'
import registerServiceWorker from './helpers/registerServiceWorker'
import './helpers/platform-detect.js'
import './styles/index.scss'

window.ALLOW_DELETION = false


console.log(`Mode: ${process.env.NODE_ENV}`)

// Initialize store & data
sync.init().then(store => {

  // Render app
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
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

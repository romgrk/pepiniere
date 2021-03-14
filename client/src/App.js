import React from 'react'
import prop from 'prop-types'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import qs from 'qs'

import Auth from './actions/auth'

import Navbar from './components/Navbar'
import Notifications from './containers/Notifications'
import MembersPage from './containers/MembersPage'
import LoginPage from './containers/LoginPage'
import TasksPage from './containers/TasksPage'
import SettingsPage from './containers/SettingsPage'
import SchedulePage from './containers/SchedulePage'
import ReportsPage from './containers/ReportsPage'
import Title from './components/Title'

import routes from './routes'

const indexPath = '/schedule'


/* Redirection logic */
function checkRedirect(location, isLoggedIn, isLoggingIn) {
  if (!isLoggedIn && !isLoggingIn && location.pathname !== '/login')
    return <Redirect to={`/login?redirect_to=${location.pathname}`} />

  if (isLoggedIn && location.pathname === '/login')
    return <Redirect to={getRedirectTo(location.search)} />

  if (isLoggedIn && location.pathname === '/')
    return <Redirect to={indexPath} />

  return null
}

function App({ isLoggedIn, isLoggingIn }) {

  return (
    <Router>
      <>
        <Route
          render={props => checkRedirect(props.location, isLoggedIn, isLoggingIn)}
        />

        <div className='App vbox'>

          <div className='App__navbar'>
            <Route render={(props) =>
              <Navbar
                inverted
                direction='horizontal'
                visible={isLoggedIn}
                index={routes.findIndex(i => props.location.pathname.startsWith(i.path))}
                items={routes}
              >
                <Navbar.Title className='sm-hidden'>
                  <Title large keepCase muted>
                    Tree Nursery
                  </Title>
                </Navbar.Title>
                <Navbar.Button icon='sign-out' title='Logout' onClick={Auth.logout}>
                  Logout
                </Navbar.Button>
              </Navbar>
            }/>
          </div>

          <div className='App__content vbox fill'>

            <Route render={(props) => {
              /* Render document title */
              const activeItem = routes.find(i => props.location.pathname.startsWith(i.path))

              if (activeItem && activeItem.title !== undefined)
                document.title = activeItem.title

              return null
            } }/>

            <Switch>
              <Route path='/login'    component={LoginPage} />
              <Route path='/settings' component={SettingsPage} />
              <Route path='/members'  component={MembersPage} />
              <Route path='/tasks'    component={TasksPage} />
              <Route path='/schedule' component={SchedulePage} />
              <Route path='/reports'  component={ReportsPage} />
              <Route path='/'         render={() => <Redirect to={indexPath} />} />
            </Switch>
          </div>

          <Notifications />
        </div>
      </>
    </Router>
  )
}

App.propTypes = {
  isLoggedIn: prop.bool.isRequired,
  isLoggingIn: prop.bool.isRequired,
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: createSelector(state => state.auth.loggedIn.value, state => state),
  isLoggingIn: createSelector(state => state.auth.loggedIn.isLoading, state => state),
})

export default connect(mapStateToProps)(App)


function getRedirectTo(search) {
  const q = qs.parse(search.replace(/^\?/, ''))
  if (q.redirect_to)
    return q.redirect_to
  return indexPath
}

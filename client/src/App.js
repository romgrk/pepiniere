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

import Global from './actions/global'

import Navbar from './components/Navbar'

import NotificationsContainer from './containers/NotificationsContainer'
import MembersPage from './containers/MembersPage'
import LoginPage from './containers/LoginPage'
import TasksPage from './containers/TasksPage'
import SettingsPage from './containers/SettingsPage'
import SchedulePage from './containers/SchedulePage'
import ReportsPage from './containers/ReportsPage'
import Title from './components/Title'

const items = [
  { type: 'item', icon: 'cogs',        label: null,       path: '/settings' },
  { type: 'item', icon: 'user-circle', label: 'Members',  path: '/members'},
  { type: 'item', icon: 'tasks',       label: 'Tasks',    path: '/tasks' },
  { type: 'item', icon: 'calendar',    label: 'Schedule', path: '/schedule',     index: true },
  { type: 'item', icon: 'table',       label: 'Report',   path: '/reports' },
]
const indexPath = items.find(i => i.index).path

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
                direction='horizontal'
                visible={isLoggedIn}
                index={items.findIndex(i => props.location.pathname.startsWith(i.path))}
                items={items}
              >
                <Navbar.Title className='sm-hidden'>
                  <Title large keepCase muted>
                    Tree Nursery
                  </Title>
                </Navbar.Title>
                <Navbar.Button icon='sign-out' title='Logout' onClick={Global.logout} />
              </Navbar>
            }/>
          </div>

          <div className='App__content vbox fill'>

            <Route render={(props) => {
              /* Render document title */
              const activeItem = items.find(i => props.location.pathname.startsWith(i.path))

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
            </Switch>
          </div>

          <NotificationsContainer />
        </div>
      </>
    </Router>
  )
}

App.propTypes = {
  location: prop.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: createSelector(state => state.ui.loggedIn.value, state => state),
  isLoggingIn: createSelector(state => state.ui.loggedIn.isLoading, state => state),
})

export default connect(mapStateToProps)(App)


function getRedirectTo(search) {
  const q = qs.parse(search.replace(/^\?/, ''))
  if (q.redirect_to)
    return q.redirect_to
  return indexPath
}

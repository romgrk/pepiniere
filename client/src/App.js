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
  { type: 'item', icon: 'calendar',    label: 'Schedule', path: '/schedule' },
  { type: 'item', icon: 'table',       label: 'Report',   path: '/reports',     index: true },
]
const indexRoute = items.find(i => i.index).path

function getRedirectTo(search) {
  const q = qs.parse(search)
  if (q.redirect_to)
    return q.redirect_to
  return indexRoute
}

function App({ isLoggedIn, isLoggingIn }) {

  // Redirect on certain conditions
  const checkLocation = (props) => {
    if (isLoggedIn)
      debugger
    if (!isLoggedIn && !isLoggingIn && props.location.pathname !== '/login')
      return <Redirect to={`/login?redirect_to=${props.location.pathname}`} />

    if (isLoggedIn && props.location.pathname === '/')
      return <Redirect to={indexRoute} />

    if (isLoggedIn && props.location.pathname === '/login')
      return <Redirect to={getRedirectTo(props.location.search)} />

    return null
  }

  return (
    <Router>

      <>
        <Route render={checkLocation}/>

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
                <Navbar.Button icon='sign-out'        title='Log Out' onClick={Global.logout} />
              </Navbar>
            }/>
          </div>

          <div className='App__content vbox fill'>

            <Route render={(props) => {
              /*
              * Render document title
              */
              const activeItem = items.find(i => i.path === props.location.pathname)

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

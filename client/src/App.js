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

import Global from './actions/global'

import Navbar from './components/Navbar'

import FAQContainer from './containers/FAQContainer'
import IndexContainer from './containers/IndexContainer'
import NotificationsContainer from './containers/NotificationsContainer'
import SettingsPage from './containers/SettingsPage'
import MembersPage from './containers/MembersPage'
import TasksPage from './containers/TasksPage'
import SchedulePage from './containers/SchedulePage'
import Title from './components/Title'

const items = [
  { type: 'item', icon: 'cogs',        label: null,       path: '/settings' },
  { type: 'item', icon: 'user-circle', label: 'Members',  path: '/members'},
  { type: 'item', icon: 'tasks',       label: 'Tasks',    path: '/tasks' },
  { type: 'item', icon: 'calendar',    label: 'Schedule', path: '/schedule',     index: true },
  { type: 'item', icon: 'table',       label: 'Report',   path: '/reports' },
]
const indexRoute = items.find(i => i.index).path

function Routes({ isLoggedIn, isLoggingIn }) {

  // Redirect on certain conditions
  const checkLocation = (props) =>
    (!isLoggedIn && !isLoggingIn && props.location.pathname !== '/') ?
      <Redirect to='/' /> :
    (isLoggedIn && props.location.pathname === '/') ?
      <Redirect to={indexRoute} /> :
      null

  return (
    <Router>
      <div className='App vbox'>

        <Route render={checkLocation}/>

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
              <Navbar.Button icon='sign-out'        title='Log Out' onClick={Global.logOut} />
            </Navbar>

          }/>
        </div>

        <div className='App__content vbox fill'>

          <Route render={(props) => {
            /*
             * Render document title
             */
            const activeItem = items.find(i => i.path === props.location.pathname)

            if (!activeItem || activeItem.title === undefined)
              return null

            document.title = `${activeItem.title} - Grants`

            return null
          } }/>

          <Switch>
            <Route path='/settings' component={SettingsPage} />
            <Route path='/members'  component={MembersPage} />
            <Route path='/tasks'    component={TasksPage} />
            <Route path='/schedule' component={SchedulePage} />
          </Switch>
        </div>

        <NotificationsContainer />
        <IndexContainer />
        <FAQContainer />
      </div>
    </Router>
  )
}

Routes.propTypes = {
  location: prop.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: createSelector(state => state.ui.loggedIn.value, state => state),
  isLoggingIn: createSelector(state => state.ui.loggedIn.isLoading, state => state),
})

export default connect(mapStateToProps)(Routes)

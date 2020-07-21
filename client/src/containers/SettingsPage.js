import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import { fromLoadable } from '../helpers/to-loadable'
import Settings from '../components/Settings'

class SettingsContainer extends React.Component {
  render() {
    return (
      <Settings
        isLoading={this.props.settings.isLoading}
        data={this.props.settings.data}
        members={this.props.members}
        categories={this.props.categories}
        tasks={this.props.tasks}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  settings: createSelector(state => state.settings, state => state),
  members: createSelector(state => Object.values(state.members.data), state => state),
  categories: createSelector(state => Object.values(state.categories.data), state => state),
  tasks: createSelector(state => Object.values(state.tasks.data), state => state),
})

export default connect(mapStateToProps)(SettingsContainer)

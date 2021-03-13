import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Index from '../components/Index'

class IndexContainer extends React.Component {
  render() {
    return (
      <Index
        isLoading={this.props.isLoading}
        isLoggedIn={this.props.isLoggedIn}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoading: createSelector(state => state.auth.loggedIn.isLoading, state => state),
  isLoggedIn: createSelector(state => state.auth.loggedIn.value, state => state),
})

export default connect(mapStateToProps)(IndexContainer)

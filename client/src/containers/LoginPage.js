import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import cx from 'classname'

import Global from '../actions/global'

import Button from '../components/Button'
import Input from '../components/Input'


class LoginPage extends React.Component {

  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  state = {
    password: '',
  }

  setPassword = password => {
    this.setState({ password })
  }

  login = () => {
    Global.login(this.state.password)
  }

  render() {
    const { password } = this.state
    const { isLoading } = this.props

    const className = cx('LoginPage vbox box--center')

    return (
      <section className={className}>

        <div className='LoginPage__controls vbox box--justify-center'>
          <Input
            size='large'
            type='password'
            icon='user'
            placeholder='Password'
            className='LoginPage__input'
            value={password}
            onChange={this.setPassword}
            onEnter={this.login}
          />
          <Button
            size='large'
            variant='info'
            className='LoginPage__button'
            loading={isLoading}
            onClick={this.login}
          >
            Login
          </Button>
        </div>

      </section>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoading: createSelector(state => state.ui.loggedIn.isLoading, state => state),
  isLoggedIn: createSelector(state => state.ui.loggedIn.value, state => state),
})

export default connect(mapStateToProps)(LoginPage)

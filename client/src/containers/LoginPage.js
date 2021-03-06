import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import cx from 'clsx'

import Auth from '../actions/auth'

import Button from '../components/Button'
import Input from '../components/Input'


class LoginPage extends React.Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
  }

  state = {
    password: '',
  }

  setPassword = password => {
    this.setState({ password })
  }

  login = () => {
    Auth.login(this.state.password)
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
  isLoading: createSelector(state => state.auth.loggedIn.isLoading, state => state),
  isLoggedIn: createSelector(state => state.auth.loggedIn.value, state => state),
})

export default connect(mapStateToProps)(LoginPage)

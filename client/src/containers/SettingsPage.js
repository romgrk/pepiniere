import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import styled from 'styled-components'
import { sortBy, prop } from 'ramda'

import Global from '../actions/global'
import Settings from '../actions/settings'

import Button from '../components/Button'
import EditableLabel from '../components/EditableLabel'
import Form from '../components/Form'
import Gap from '../components/Gap'
import Input from '../components/Input'
import Label from '../components/Label'
import Text from '../components/Text'
import Title from '../components/Title'


class SettingsPage extends React.Component {

  static propTypes = {
  }

  state = {
    password: '',
    newPassword: '',
  }

  onChangePassword = ev => {
    const { password, newPassword } = this.state
    Settings.changePassword(password, newPassword)
    .then(() => {
      this.setState({
        password: '',
        newPassword: '',
      })
    })
  }

  render() {
    const { isLoading } = this.props
    const { password, newPassword } = this.state

    return (
      <section className='Settings vbox'>

        <div className='Settings__content hbox'>
          <div className='Settings__left fill'>

            {/*
            <Group>
              <Title>Whitelist</Title>
              <Text block muted>
                Emails in this list are allowed to log-in/sign-up to this application.
              </Text>
              <EditableList
                help='Multiple emails allowed. Press <Enter> to submit.'
                placeHolder='Add email…'
                loading={whitelist.isLoading}
                values={whitelist.data || []}
                onAdd={value => this.onListAdd('whitelist', value)}
                onDelete={value => this.onListDelete('whitelist', value)}
              />
            </Group>
            */}

            <Form onSubmit={this.onChangePassword}>
              <Title>Change Password</Title>
              <Text block muted>
                Change the application password here.<br/>
              </Text>
              <Form.Field>
                <Label>Current password:</Label>{' '}
                <Input
                  type='password'
                  value={password}
                  onChange={password => this.setState({ password })}
                />
              </Form.Field>
              <Form.Field>
                <Label>New password:</Label>{' '}
                <Input
                  value={newPassword}
                  onChange={newPassword => this.setState({ newPassword })}
                />
              </Form.Field>
              <Button variant='info' loading={isLoading}>
                Change
              </Button>
            </Form>

          </div>

          <Gap fill='40px' />
        </div>

      </section>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoading: createSelector(state => state.settings.isLoading, state => state),
  settings: createSelector(state => state.settings.data, state => state),
})

export default connect(mapStateToProps)(SettingsPage)

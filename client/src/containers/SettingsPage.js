import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import styled from 'styled-components'
import { sortBy, prop } from 'ramda'

import Global from '../actions/global'
import Settings from '../actions/settings'

import Button from '../components/Button'
import Form from '../components/Form'
import Gap from '../components/Gap'
import Input from '../components/Input'
import Label from '../components/Label'
import Select from '../components/Select'
import Text from '../components/Text'
import Title from '../components/Title'


class SettingsPage extends React.Component {

  static propTypes = {
  }

  state = {
    password: '',
    newPassword: '',

    defaultTasks: [],
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

  onAddDefaultTask = taskId => {
    const defaultTasks = this.state.defaultTasks.concat(taskId)
    Settings.update('defaultTasks', defaultTasks)
    this.setState({ defaultTasks })
  }

  onDeleteDefaultTask = taskId => {
    const defaultTasks = this.state.defaultTasks.filter(id => id !== taskId)
    Settings.update('defaultTasks', defaultTasks)
    this.setState({ defaultTasks })
  }

  componentWillReceiveProps(props) {
    if (props.settings.defaultTasks !== this.props.settings.defaultTasks) {
      this.setState({
        defaultTasks: props.settings.defaultTasks.data || [],
      })
    }
  }

  render() {
    const { isLoading, tasks, categories } = this.props
    const { password, newPassword, defaultTasks, } = this.state

    console.log(defaultTasks)
    return (
      <section className='Settings vbox'>

        <div className='Settings__content vbox'>
          <Form className='Settings__section'>
            <Title>Default Tasks</Title>
            <Text block muted>
              Tasks in this list will be added by default whenever you visit a date.
            </Text>
            <div className='Settings__defaultTasks'>
              {defaultTasks.map(taskId => {
                const task = tasks[taskId] || { data: { name: 'Loading' } }
                const category = categories[task.data.categoryId] || { data: { name: 'Loading' } }

                return (
                  <div key={taskId} className='Settings__defaultTasks__task hbox'>
                    <div className='Settings__defaultTasks__task__name fill'>
                      {category.data.name}: {task.data.name}
                    </div>
                    <Button
                      icon='close'
                      onClick={() => this.onDeleteDefaultTask(taskId)}
                    />
                  </div>
                )
              })}
              {defaultTasks.length === 0 &&
                <div className='Settings__defaultTasks__task text-muted'>
                  No task selected
                </div>
              }
            </div>
            <Select value={'new-task'} onChange={this.onAddDefaultTask}>
              <option value='new-task'>-- Add New Task --</option>
              {Object.values(tasks).map(task =>
                <option value={task.data.id}>
                  {categories[task.data.categoryId].data.name}: {task.data.name}
                </option>
              )}
            </Select>
          </Form>

          <Form className='Settings__section' onSubmit={this.onChangePassword}>
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

      </section>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoading: createSelector(state => state.settings.isLoading, state => state),
  settings: createSelector(state => state.settings.data, state => state),
  tasks: createSelector(state => state.tasks.data, state => state),
  categories: createSelector(state => state.categories.data, state => state),
})

export default connect(mapStateToProps)(SettingsPage)

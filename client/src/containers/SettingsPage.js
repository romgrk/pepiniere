import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Global from '../actions/global'
import Settings from '../actions/settings'

import Button from '../components/Button'
import Form from '../components/Form'
import Gap from '../components/Gap'
import Input from '../components/Input'
import Label from '../components/Label'
import Select from '../components/Select'
import Spinner from '../components/Spinner'
import Text from '../components/Text'
import Title from '../components/Title'


class SettingsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      newPassword: '',

      defaultTasks: props.settings.defaultTasks ?
        (props.settings.defaultTasks.data || []) : [],

      backupKey: 'initial',
      backup: undefined,
    }
  }

  componentWillReceiveProps(props) {
    if (props.settings.defaultTasks !== this.props.settings.defaultTasks) {
      this.setState({
        defaultTasks: props.settings.defaultTasks.data || [],
      })
    }
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
    const defaultTasks = this.state.defaultTasks.concat(+taskId)
    Settings.update('defaultTasks', defaultTasks)
    this.setState({ defaultTasks })
  }

  onDeleteDefaultTask = taskId => {
    const defaultTasks = this.state.defaultTasks.filter(id => id !== +taskId)
    Settings.update('defaultTasks', defaultTasks)
    this.setState({ defaultTasks })
  }

  onChangeBackup = ev => {
    const file = ev.target.files[0]
    if (!file)
      return
    this.setState({
      backupKey: file.name,
      backup: file
    })
  }

  onRestoreBackup = () => {
    const { backup } = this.state
    if (!backup)
      return

    Settings.restoreBackup(backup)
    .then(() => Global.fetchAll())
    .then(() => {
      this.setState({ backupKey: 'initial', backup: undefined })
    })
  }

  render() {
    const { isLoading, tasks, categories } = this.props
    const { password, newPassword, backup, backupKey, defaultTasks, } = this.state

    return (
      <section className='Settings'>

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
              <option key={task.data.id} value={task.data.id}>
                {categories[task.data.categoryId].data.name}: {task.data.name}
              </option>
            )}
          </Select>
          {this.props.settings.defaultTasks &&
            this.props.settings.defaultTasks.isLoading &&
            <>
              <Gap h='10px' />
              <Spinner />
            </>
          }
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

        <Form className='Settings__section' onSubmit={this.onRestoreBackup}>
          <Title>Restore Backup</Title>
          <Text block muted>
            Restore a previous backup.
          </Text>
          <Form.Field>
            <Label>Backup file:</Label>{' '}
            <input
              key={backupKey}
              type='file'
              onChange={this.onChangeBackup}
            />
          </Form.Field>
          <Button variant='error' loading={isLoading} disabled={!backup}>
            Restore Backup
          </Button>
        </Form>

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

import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import { sortBy, prop } from 'ramda'

import Global from '../actions/global'
import Setting from '../actions/settings'
import Member from '../actions/members'
import Category from '../actions/categories'
import Task from '../actions/tasks'

import isColor from '../helpers/is-color'
import uniq from '../helpers/uniq'
import getEmails from '../helpers/get-emails'
import Button from './Button'
import ColorPicker from './ColorPicker'
import EditableLabel from './EditableLabel'
import EditableList from './EditableList'
import Gap from './Gap'
import Input from './Input'
import Label from './Label'
import Text from './Text'
import Title from './Title'


const Group = styled.div`
  margin-bottom: 30px;
`

class Settings extends React.Component {

  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      whitelist: {},
      newTask: '',
      newCategory: { name: '', color: '#' },
      ...this.parseProps(props)
    }
  }

  componentWillReceiveProps(props) {
    this.setState(this.parseProps(props))
  }

  parseProps(props) {
    const { data } = props

    const state = {}

    Object.keys(data).forEach(key => {
      const value = data[key]

      if (!value.isLoading) {
        state[key] = value
      } else {
        state[key] = { isLoading: true, data: this.state[key] ? this.state[key].data : value.data }
      }
    })

    return state
  }

  onListAdd = (which, value) => {
    const list = this.state[which]

    const emails = uniq(getEmails(value))
    if (emails.length > 0)
      Setting.update(which, uniq(list.data.concat(emails)))
    else
      Global.showError(`Couldn't find any email in the input value.`)
  }

  onListDelete = (which, value) => {
    const list = this.state[which]

    Setting.update(which, list.data.filter(v => v !== value))
  }

  onDeleteUser = (id) => {
    Member.delete(id)
  }

  onUpdateUserName = (id, name) => {
    const user = { ...this.props.members.find(u => u.id === id), name }
    Member.update(id, user)
  }

  onUpdateUserEmail = (id, email) => {
    const user = { ...this.props.members.find(u => u.id === id), email }
    Member.update(id, user)
  }

  onChangeNewTask = newTask => {
    this.setState({ newTask })
  }

  onCreateNewTask = () => {
    const {newTask} = this.state
    if (!newTask)
      return
    Task.create({ name: newTask })
    .then(() => this.setState({ newTask: '' }))
  } 

  onChangeNewCategoryName = name => {
    this.setState({ newCategory: { ...this.state.newCategory, name } })
  }

  onChangeNewCategoryColor = color => {
    this.setState({ newCategory: { ...this.state.newCategory, color } })
  }

  onCreateNewCategory = () => {
    const {newCategory} = this.state
    if (!newCategory.name || !isColor(newCategory.color))
      return
    Category.create(newCategory)
    .then(() => this.setState({ newCategory: { name: '', color: '#' } }))
  }

  render() {
    const {
      members,
      categories,
      tasks,
    } = this.props

    const {
      whitelist,
      newTask,
      newCategory,
    } = this.state

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

            <Group>
              <Title>Users</Title>
              <Text block muted>
                This is the list of users with an account. <br/>
              </Text>

              <table className='table Settings__table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    sortBy(prop('id'), members).map(user =>
                      <tr key={user.id}>
                        <td>
                          {
                            user.googleID === null ?
                              <Label style={{ padding: '0 5px' }}>{user.name}</Label>
                              :
                              <EditableLabel
                                value={user.name}
                                onEnter={name => this.onUpdateUserName(user.id, name)}
                              />
                          }
                        </td>
                        <td>
                          {
                            user.googleID === null ?
                              <Label>{user.email}</Label>
                              :
                              <EditableLabel
                                value={user.email}
                                onEnter={email => this.onUpdateUserEmail(user.id, email)}
                              />
                          }
                      </td>
                        <td className='button-column'>
                          {
                            user.googleID !== null &&
                              <Button
                                flat
                                square
                                small
                                icon='close'
                                onClick={() => this.onDeleteUser(user.id)}
                              />
                          }
                        </td>
                      </tr>
                    )
                  }
                  {
                    members.length === 0 &&
                      <tr className='empty'>
                        <td colSpan='3'>
                          No users yet
                        </td>
                      </tr>
                  }
                </tbody>
              </table>
            </Group>
          </div>

          <Gap fill='40px' />
        </div>

      </section>
    )
  }
}

export default pure(Settings)

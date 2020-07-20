import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { set } from 'object-path-immutable'
import { sortBy, prop } from 'ramda'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import { fromLoadable } from '../helpers/to-loadable'
import isColor from '../helpers/is-color'
import uniq from '../helpers/uniq'
import getEmails from '../helpers/get-emails'

import Global from '../actions/global'
import Setting from '../actions/settings'
import Member from '../actions/members'
import Category from '../actions/categories'
import Task from '../actions/tasks'

import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import ColorPicker from '../components/ColorPicker'
import EditableLabel from '../components/EditableLabel'
import EditableList from '../components/EditableList'
import Gap from '../components/Gap'
import Input from '../components/Input'
import Label from '../components/Label'
import Text from '../components/Text'
import Title from '../components/Title'


const Group = styled.div`
  margin-bottom: 30px;
`

const EMPTY_MEMBER = {
  firstName: '',
  lastName: '',
  country: '',
  photo: '',
  isPermanent: false,
  startDate: null,
  endDate: null,
}

class MembersPage extends React.Component {

  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      newMember: EMPTY_MEMBER,
    }
  }

  onDeleteMember = (member) => {
    Member.delete(member.data.id)
  }

  onCreateMember = (member) => {
    Member.create(member)
  }

  onUpdateMember = (member, key, value) => {
    Member.update(member.data.id, set(member.data, [key], value))
  }

  render() {
    const { members } = this.props
    const { newMember } = this.state

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
              <Title>Members</Title>
              <Text block muted>
                This is the list of users with an account. <br/>
              </Text>

              <table className='table Settings__table'>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Permanent</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    sortBy(prop('id'), members).map(member =>
                      <tr key={member.data.id}>
                        <td>
                          <EditableLabel
                            value={member.data.firstName}
                            onEnter={value => this.onUpdateMember(member, 'firstName', value)}
                          />
                        </td>
                        <td>
                          <EditableLabel
                            value={member.data.lastName}
                            onEnter={value => this.onUpdateMember(member, 'lastName', value)}
                          />
                        </td>
                        <td>
                          <Checkbox
                            checked={Boolean(member.data.isPermanent)}
                            onChange={value => this.onUpdateMember(member, 'isPermanent', value)}
                          />
                        </td>
                        <td className='button-column'>
                          {
                            member.googleID !== null &&
                              <Button
                                flat
                                square
                                small
                                icon='close'
                                onClick={() => this.onDeleteMember(member)}
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

              <div className='row'>
                <Button onClick={this.onCreateMember}>
                  Create
                </Button>
              </div>
            </Group>
          </div>

          <Gap fill='40px' />
        </div>

      </section>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  settings: createSelector(state => state.settings, state => state),
  members: createSelector(state => Object.values(state.members.data), state => state),
  categories: createSelector(state => Object.values(state.categories.data), state => state),
  tasks: createSelector(state => Object.values(state.tasks.data), state => state),
})

export default connect(mapStateToProps)(MembersPage)

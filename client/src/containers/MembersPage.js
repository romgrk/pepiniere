import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { set } from 'object-path-immutable'
import { sortBy, prop } from 'ramda'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import {
  startOfDay,
  endOfDay,
} from 'date-fns'

import Member from '../actions/members'

import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import ColorPicker from '../components/ColorPicker'
import DateValue from '../components/Date'
import EditableLabel from '../components/EditableLabel'
import EditableList from '../components/EditableList'
import Gap from '../components/Gap'
import Input from '../components/Input'
import Label from '../components/Label'
import Text from '../components/Text'
import Title from '../components/Title'

import MemberEditor from './members/MemberEditor'


const Group = styled.div`
  margin-bottom: 30px;
`

class MembersPage extends React.Component {

  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      memberFormMode: null,
      member: null,
      newMember: null,
      showAll: false,
    }
  }

  onDeleteMember = (id) => {
    if (!window.confirm(`Are you sure you want to delete member ${id}?`))
      return
    Member.delete(id)
  }

  onCreateMember = (member) => {
    return Member.create(member.data)
  }

  onUpdateMember = (member, key, value) => {
    return Member.update(member.data.id, set(member.data, [key], value))
  }

  onEditMemberDone = (member) => {
    const { memberFormMode: mode } = this.state
    const action = (mode === MemberEditor.MODE.CREATE) ?
      this.onCreateMember(member) :
      this.onUpdateMember(member)

    action.then(() => {
      this.closeMemberForm()
    })
  }

  openCreateMemberForm = () => {
    this.setState({
      memberFormMode: MemberEditor.MODE.CREATE,
      member: null,
    })
  }

  openUpdateMemberForm = (member) => {
    this.setState({
      memberFormMode: MemberEditor.MODE.UPDATE,
      member: member,
    })
  }

  closeMemberForm = () => {
    this.setState({
      memberFormMode: null,
    })
  }

  render() {
    const { members } = this.props
    const { memberFormMode, member, showAll } = this.state

    const filteredMembers = showAll ? members :
      members.filter(isVisibleToday)
    const visibleMembers = sortBy(prop('id'), filteredMembers)

    return (
      <section className='MembersPage vbox'>

        <div className='MembersPage__listContainer fill'>
          <div className='MembersPage__list fill'>
            {
              visibleMembers.map(member =>
                <div
                  key={member.data.id}
                  className='MembersPage__member vbox'
                  role='button'
                  onClick={() => this.openUpdateMemberForm(member)}
                >
                  <div className='MembersPage__photo text-center'>
                    <img
                      width="auto"
                      height="60px"
                      src='data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; xmlns:xlink=&quot;http://www.w3.org/1999/xlink&quot; version=&quot;1.1&quot; id=&quot;Layer_1&quot; x=&quot;0px&quot; y=&quot;0px&quot; viewBox=&quot;0 0 100 100&quot; enable-background=&quot;new 0 0 100 100&quot; xml:space=&quot;preserve&quot; height=&quot;100px&quot; width=&quot;100px&quot;> <g> 	<path d=&quot;M28.1,36.6c4.6,1.9,12.2,1.6,20.9,1.1c8.9-0.4,19-0.9,28.9,0.9c6.3,1.2,11.9,3.1,16.8,6c-1.5-12.2-7.9-23.7-18.6-31.3   c-4.9-0.2-9.9,0.3-14.8,1.4C47.8,17.9,36.2,25.6,28.1,36.6z&quot;/> 	<path d=&quot;M70.3,9.8C57.5,3.4,42.8,3.6,30.5,9.5c-3,6-8.4,19.6-5.3,24.9c8.6-11.7,20.9-19.8,35.2-23.1C63.7,10.5,67,10,70.3,9.8z&quot;/> 	<path d=&quot;M16.5,51.3c0.6-1.7,1.2-3.4,2-5.1c-3.8-3.4-7.5-7-11-10.8c-2.1,6.1-2.8,12.5-2.3,18.7C9.6,51.1,13.4,50.2,16.5,51.3z&quot;/> 	<path d=&quot;M9,31.6c3.5,3.9,7.2,7.6,11.1,11.1c0.8-1.6,1.7-3.1,2.6-4.6c0.1-0.2,0.3-0.4,0.4-0.6c-2.9-3.3-3.1-9.2-0.6-17.6   c0.8-2.7,1.8-5.3,2.7-7.4c-5.2,3.4-9.8,8-13.3,13.7C10.8,27.9,9.8,29.7,9,31.6z&quot;/> 	<path d=&quot;M15.4,54.7c-2.6-1-6.1,0.7-9.7,3.4c1.2,6.6,3.9,13,8,18.5C13,69.3,13.5,61.8,15.4,54.7z&quot;/> 	<path d=&quot;M39.8,57.6C54.3,66.7,70,73,86.5,76.4c0.6-0.8,1.1-1.6,1.7-2.5c4.8-7.7,7-16.3,6.8-24.8c-13.8-9.3-31.3-8.4-45.8-7.7   c-9.5,0.5-17.8,0.9-23.2-1.7c-0.1,0.1-0.2,0.3-0.3,0.4c-1,1.7-2,3.4-2.9,5.1C28.2,49.7,33.8,53.9,39.8,57.6z&quot;/> 	<path d=&quot;M26.2,88.2c3.3,2,6.7,3.6,10.2,4.7c-3.5-6.2-6.3-12.6-8.8-18.5c-3.1-7.2-5.8-13.5-9-17.2c-1.9,8-2,16.4-0.3,24.7   C20.6,84.2,23.2,86.3,26.2,88.2z&quot;/> 	<path d=&quot;M30.9,73c2.9,6.8,6.1,14.4,10.5,21.2c15.6,3,32-2.3,42.6-14.6C67.7,76,52.2,69.6,37.9,60.7C32,57,26.5,53,21.3,48.6   c-0.6,1.5-1.2,3-1.7,4.6C24.1,57.1,27.3,64.5,30.9,73z&quot;/> </g> </svg>'
                    />
                  </div>
                  <div className='text-bold text-center'>
                    {[
                      getUnicodeFlagIcon(member.data.country),
                      member.data.firstName,
                      abbreviate(member.data.lastName)
                    ].filter(Boolean).join(' ')}
                  </div>
                  <div className='text-center'>
                    {!member.data.isPermanent &&
                      <span><DateValue>{member.data.startDate}</DateValue> - <DateValue>{member.data.endDate}</DateValue></span>
                    }
                    {Boolean(member.data.isPermanent) &&
                      <span>&nbsp;</span>
                    }
                  </div>
                </div>
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
          </div>
        </div>

        <div className='MembersPage__controls row no-padding flex'>
          <Button className='fill' variant='info' onClick={this.openCreateMemberForm}>
            Add Member
          </Button>
          <Checkbox checked={showAll} onChange={showAll => this.setState({ showAll })}>
            Show All
          </Checkbox>
        </div>

        <MemberEditor
          open={memberFormMode !== null}
          mode={memberFormMode}
          member={member}
          onDone={this.onEditMemberDone}
          onCancel={this.closeMemberForm}
        />

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

function abbreviate(name) {
  if (!name)
    return ''

  return name.slice(0, 1) + '.'
}

function isVisibleToday(member) {
  const { data: { isPermanent, startDate, endDate } } = member
  if (isPermanent)
    return true
  const today = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (start < startOfDay(today) && end > endOfDay(today))
    return true
  return false
}

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { set } from 'object-path-immutable'
import { sort } from 'ramda'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

import { abbreviate, isVisibleToday } from '../models'

import Member from '../actions/members'

import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import DateValue from '../components/Date'
import Icon from '../components/Icon'

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

  onDeleteMember = (member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.data.firstName}?`))
      return
    Member.delete(member.data.id)
    .then(() => {
      this.closeMemberForm()
    })
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
    const visibleMembers = sort(({ data: a }, { data: b }) => {
      if (+a.isPermanent !== +b.isPermanent)
        return +b.isPermanent - +a.isPermanent
      return a.id - b.id
    }, filteredMembers)

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
                    {member.data.photo ?
                      <img
                        width="auto"
                        height="60px"
                        src={member.data.photo}
                      /> :
                      <Icon
                        name='user-circle'
                        size='5x'
                        style={{ height: 60, width: 'auto' }}
                      />
                    }
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
          onDelete={this.onDeleteMember}
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

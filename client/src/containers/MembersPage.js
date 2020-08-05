import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link, Route, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { set } from 'object-path-immutable'
import { sort } from 'ramda'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import { isVisibleToday, isVisibleAfterToday } from '../models'

import Member from '../actions/members'

import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import Icon from '../components/Icon'

import MemberCard from './MemberCard'
import MemberEditor from './members/MemberEditor'


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

  onCreateMember = (member) => Member.create(member.data)

  onUpdateMember = (member, key, value) => Member.update(member.data.id, set(member.data, [key], value))

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

  renderMain = () => {
    const { members } = this.props
    const { showAll } = this.state

    const filteredMembers = showAll ? members : members.filter(isVisibleToday)
    const visibleMembers = sort(compareMembers, filteredMembers)

    return (
      <div className='Page__main vbox'>
        <div className='MembersPage__link'>
          <div className='fill' />
          <Link to='/members/future' className='link text-small'>
            Future members <Icon name='arrow-right' />
          </Link>
        </div>

        <div className='MembersPage__listContainer fill'>
          <div className='MembersPage__list fill'>
            {
              visibleMembers.map(member =>
                <MemberCard
                  key={member.data.id}
                  detailed
                  member={member}
                  className='MembersPage__member'
                  onClick={() => this.openUpdateMemberForm(member)}
                />
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
      </div>
    )
  }

  renderFutureSection = () => {
    const { members } = this.props

    const filteredMembers =
      members.filter(isVisibleAfterToday)
    const visibleMembers = sort(compareMembers, filteredMembers)

    return (
      <div className='Page__section vbox'>
        <div className='MembersPage__link'>
          <Link to='/members' className='link text-small'>
            <Icon name='arrow-left' /> Back
          </Link>
          <div className='fill' />
        </div>

        <div className='MembersPage__listContainer fill'>
          <div className='MembersPage__list fill'>
            {
              visibleMembers.map(member =>
                <MemberCard
                  key={member.data.id}
                  detailed
                  member={member}
                  className='MembersPage__member'
                  onClick={() => this.openUpdateMemberForm(member)}
                />
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
        </div>
      </div>
    )
  }

  render() {
    const { location } = this.props
    const { memberFormMode, member } = this.state

    return (
      <section className='MembersPage Page vbox'>

        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            in={true}
            timeout={{ enter: 5000, exit: 5000 }}
            classNames={'transition'}
          >
            <Switch location={location}>
              <Route exact path='/members'        render={this.renderMain} />
              <Route exact path='/members/future' render={this.renderFutureSection} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>

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

export default withRouter(connect(mapStateToProps)(MembersPage))


function compareMembers({ data: a }, { data: b }) {
  if (+a.isPermanent !== +b.isPermanent)
    return +b.isPermanent - +a.isPermanent
  return a.id - b.id
}

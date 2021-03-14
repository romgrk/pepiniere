import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'


import Run from '../../actions/runs'

import Button from '../../components/Button'
import Input from '../../components/Input'
import Title from '../../components/Title'

import MemberCard from '../MemberCard'

const DELETED_MEMBER = {
  isLoading: false,
  data: {
    firstName: '',
    lastName: '',
    country: '',
    photo: '',
    isPermanent: false,
    startDate: null,
    endDate: null,
    deleted: true,
  }
}

class RunComponent extends React.Component {

  static propTypes = {
    members: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      notes: props.run.data.notes,
    }
  }

  componentWillReceiveProps(props) {
    if (props.run !== this.props.run)
      this.setState({
        notes: props.run.data.notes,
      })
  }

  onChangeNotes = notes => {
    this.setState({ notes })
  }

  onBlurNotes = ev => {
    const { run } = this.props
    const notes = ev.target.value
    if (notes === run.data.notes)
      return
    Run.update(run.data.id, { notes })
  }

  onDeleteMember = (memberId) => {
    const { run } = this.props
    Run.removeMember(run.data.id, memberId)
  }

  onDelete = () => {
    const { tasks, run } = this.props
    if (!window.confirm(`Are you sure you want to delete ${tasks[run.data.taskId].data.name}?`))
      return
    Run.delete(run.data.id)
  }

  render() {
    const { run, categories, tasks, members, dispatch, ...rest } = this.props
    const { notes } = this.state
    const task = tasks[run.data.taskId] || { isLoading: true, data: { name: 'Loading' } }
    const category = categories[task.data.categoryId] || { isLoading: true, data: { name: 'Loading' } }
    const runMembers = run.data.membersId.map(id => {
      if (typeof id === 'number')
        return members[id] || id
      const member = members[id.id]
      const loadingMember = { isLoading: true, data: member.data }
      return loadingMember
    })

    return (
      <div key={run.data.id} className='Run vbox' {...rest}>
        <div
          className='Run__title hbox'
        >
          <div className='Run__title__color'
            style={{ backgroundColor: category.data.color }}
          />
          <Title>{task.data.name}</Title>
          <div className='fill' />
          <Button
            icon='remove'
            onClick={this.onDelete}
          />
        </div>
        <div className='Run__members'>
          {
            runMembers.map(m =>
              <MemberCard
                key={m.data ? m.data.id : m}
                className='SchedulePage__member'
                size='small'
                member={m}
                onClick={() => this.onDeleteMember(m.data ? m.data.id : m)}
              />
            )
          }
          {
            runMembers.length === 0 &&
              <MemberCard
                empty
                className='SchedulePage__member'
                size='small'
              />
          }
        </div>
        <div className='Run__notes row'>
          <Input
            className='fill'
            placeholder='Notes...'
            value={notes}
            onChange={this.onChangeNotes}
            onBlur={this.onBlurNotes}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  members: createSelector(state => state.members.data, state => state),
  tasks: createSelector(state => state.tasks.data, state => state),
  categories: createSelector(state => state.categories.data, state => state),
})

export default connect(mapStateToProps)(RunComponent)

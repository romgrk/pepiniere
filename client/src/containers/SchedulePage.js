import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import {
  format,
  startOfToday,
  addDays,
} from 'date-fns'
import cx from 'classname'

import { isVisibleAtDate } from '../models'
import { parseLocal } from '../helpers/time'

import Run from '../actions/runs'

import Button from '../components/Button'
import Gap from '../components/Gap'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Label from '../components/Label'
import Select from '../components/Select'
import Text from '../components/Text'
import Title from '../components/Title'

import MemberCard from './MemberCard'
import DatePicker from './schedule/DatePicker'
import RunComponent from './schedule/Run'


class SchedulePage extends React.Component {

  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  state = {
    date: startOfToday(),
    isAM: true,
    isDragging: false,
    dragPosition: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    dragMember: undefined,
  }

  setDate = (date) => {
    this.setState({ date: parseLocal(date) })
  }

  setAM = (isAM) => {
    this.setState({ isAM })
  }

  onAddNewTask = taskId => {
    const { date, isAM } = this.state

    Run.create({
      taskId,
      membersId: [],
      date: format(date, 'yyyy-MM-dd'),
      isAM,
      notes: '',
    })
  }

  startDrag = (e, member) => {
    e.preventDefault()

    const element = e.target.getBoundingClientRect()
    const dragPosition = getEventPosition(e.nativeEvent)

    this.setState({
      isDragging: true,
      dragPosition,
      dragOffset: { x: dragPosition.x - element.x, y: dragPosition.y - element.y },
      dragMember: member,
    })

    if (e.nativeEvent instanceof TouchEvent) {
      e.target.addEventListener('touchmove', this.onDragMove)
    }
    else {
      document.addEventListener('mousemove', this.onDragMove)
      document.addEventListener('mouseup', this.stopDrag)
    }
  }

  stopDrag = (e) => {
    const { dragPosition, dragMember } = this.state
    const { x, y } = dragPosition
    const runId = getRunID(x, y)

    if (runId) {
      const run = this.props.runs.find(r => r.data.id === runId)
      const membersId = run.data.membersId.concat(dragMember.data.id)
      Run.update(runId, { membersId })
    }

    this.setState({
      isDragging: false,
      dragPosition: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 },
      dragMember: undefined,
    })

    if (e.nativeEvent instanceof TouchEvent) {
      e.target.removeEventListener('touchmove', this.onDragMove)
    }
    else {
      document.removeEventListener('mousemove', this.onDragMove)
      document.removeEventListener('mouseup', this.stopDrag)
    }
  }

  onDragMove = nativeEvent => {
    this.setState({
      dragPosition: getEventPosition(nativeEvent),
    })
  }

  render() {
    const { date, isAM, isDragging, dragPosition, dragOffset, dragMember } = this.state
    const { members, categories, tasks, runs } = this.props
    const dateString = format(date, 'yyyy-MM-dd')

    const visibleRuns = runs.filter(r => r.data.date === dateString && r.data.isAM === isAM)
    const assignedTasksId = visibleRuns.reduce((acc, r) => acc.concat(r.data.taskId), [])
    const assignedMembersId = visibleRuns.reduce((acc, r) => acc.concat(r.data.membersId), [])
    const visibleMembers = members.filter(m =>
      isVisibleAtDate(m, date) && !assignedMembersId.some(id => id === m.data.id))

    const className = cx('SchedulePage vbox', { 'dragging': isDragging })

    return (
      <section className={className}>

        <div className='SchedulePage__dateControls row'>
          <Button icon='chevron-left'  onClick={() => this.setDate(addDays(this.state.date, -1))} />
          <DatePicker
            className='inline fill'
            date={date}
            setDate={this.setDate}
          />
          <Button icon='chevron-right' onClick={() => this.setDate(addDays(this.state.date, 1))} />
        </div>

        <div className='SchedulePage__members hbox'>
          {
            visibleMembers.map(m =>
              <MemberCard
                key={m.data.id}
                className='SchedulePage__member'
                style={{ opacity: dragMember === m ? 0 : 1 }}
                size='small'
                member={m}
                onMouseDown={ev => this.startDrag(ev, m)}
                onTouchStart={ev => this.startDrag(ev, m)}
                onTouchEnd={ev => this.stopDrag(ev)}
              />
            )
          }
          {
            visibleMembers.length === 0 &&
              <MemberCard
                className='SchedulePage__member'
                size='small'
                empty
                label='All users assigned'
              />
          }
        </div>

        <div className='SchedulePage__amControls row'>
          <Button className='fill' active={isAM}  onClick={() => this.setAM(true)}>AM</Button>
          <Button className='fill' active={!isAM} onClick={() => this.setAM(false)}>PM</Button>
        </div>

        <div className='SchedulePage__container fill'>
          <div className='SchedulePage__list fill'>
            {
              visibleRuns.map(r =>
                <RunComponent
                  key={r.data.id}
                  run={r}
                  data-id={r.data.id}
                />
              )
            }
            {
              visibleRuns.length === 0 &&
                <Text center huge muted bold block className='SchedulePage__emptyMessage'>
                  No tasks yet
                </Text>
            }
          </div>
        </div>

        <div className='SchedulePage__controls row no-padding flex'>
          <Select
            className='fill'
            value={'new-task'}
            onChange={this.onAddNewTask}
          >
            <option value='new-task'>Add New Task</option>
            {categories.map(category =>
              <optgroup label={category.data.name}>
                {
                  tasks
                  .filter(t =>
                    t.data.categoryId === category.data.id &&
                    !assignedTasksId.includes(t.data.id))
                  .map(t =>
                    <option key={t.data.id} value={t.data.id}>
                      {t.data.name}
                    </option>
                  )
                }
              </optgroup>
            )}
          </Select>
        </div>

        <div
          className='SchedulePage__dragIndicator'
          style={{
            display: isDragging ? undefined : 'none',
            top:  dragPosition.y - dragOffset.y,
            left: dragPosition.x - dragOffset.x,
          }}
        >
          <MemberCard
            size='small'
            member={dragMember}
            onTouchMove={this.onTouchMoveMember}
            onTouchEnd={this.onTouchEndMember}
          />
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
  runs: createSelector(state => Object.values(state.runs.data), state => state),
})

export default connect(mapStateToProps)(SchedulePage)


function formatDate(date) {
  if (date.getFullYear() === new Date().getFullYear())
    return format(date, 'EEEE MMM d')
  return format(date, 'EEEE MMM d, yyyy')
}

function getEventPosition(e) {
  if (e instanceof TouchEvent) {
    const touch = e.targetTouches[0] || e.touches[0]
    const x = touch.pageX
    const y = touch.pageY
    return { x, y }
  }

  const x = e.pageX
  const y = e.pageY
  return { x, y }
}

function getRunID(x, y) {
  let target = document.elementFromPoint(x, y)
  let runID
  while (target !== null && (runID = target.getAttribute('data-id')) === null)
    target = target.parentElement
  return +runID
}

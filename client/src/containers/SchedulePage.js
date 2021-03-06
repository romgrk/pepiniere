import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import {
  format,
  isSunday,
  addDays,
} from 'date-fns'
import cx from 'clsx'

import { isVisibleAtDate } from '../models'
import { parseLocal } from '../helpers/time'

import Run from '../actions/runs'
import UI from '../actions/ui'

import Button from '../components/Button'
import Gap from '../components/Gap'
import Label from '../components/Label'
import Switch from '../components/Switch'
import Text from '../components/Text'

import MemberCard from './MemberCard'
import DatePicker from './schedule/DatePicker'
import RunComponent from './schedule/Run'
import TaskPicker from './schedule/TaskPicker'


/*
 * This component implements drag&drop behavior outside of react
 * for performance reasons.
 */

const mapStateToProps = createStructuredSelector({
  didInitialLoad: createSelector(state => state.ui.didInitialLoad, state => state),
  isLoading: createSelector(state => state.runs.isLoading || state.runs.isCreating, state => state),
  currentDate: createSelector(state => state.ui.currentDate, state => state),
  settings: createSelector(state => state.settings, state => state),
  members: createSelector(state => Object.values(state.members.data), state => state),
  categories: createSelector(state => Object.values(state.categories.data), state => state),
  tasks: createSelector(state => Object.values(state.tasks.data), state => state),
  runs: createSelector(state => Object.values(state.runs.data), state => state),
  defaultTasks: createSelector(state =>
    state.settings.data.defaultTasks ? state.settings.data.defaultTasks.data : [], state => state),
})

class SchedulePage extends React.Component {

  static propTypes = {
    didInitialLoad: PropTypes.bool.isRequired,
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  dragPosition = { x: 0, y: 0 }
  dragOffset   = { x: 0, y: 0 }
  state = {
    isAM: true,
    isDragging: false,
    dragMember: undefined,
    lastCreatedDate: undefined,
  }

  constructor(props) {
    super(props)
    this.membersContainer = React.createRef()
  }

  componentDidMount() {
    this.membersContainer.current.addEventListener('touchstart', this.onTouchStartMember, { passive: false })
  }

  componentWillUnmount() {
    this.membersContainer.current.removeEventListener('touchstart', this.onTouchStartMember)
  }

  onTouchStartMember = ev => {
    const id = findDataID(ev)
    if (!id)
      return
    const m = this.props.members.find(m => m.data.id === id)
    this.startDrag(ev, m)
  }

  nextPeriod = () => {
    const { currentDate } = this.props
    const { isAM } = this.state
    if (isAM)
      return this.setState({ isAM: false })
    this.setDate(addDays(currentDate, +1))
    this.setState({ isAM: true })
  }

  previousPeriod = () => {
    const { currentDate } = this.props
    const { isAM } = this.state
    if (!isAM)
      return this.setState({ isAM: true })
    this.setDate(addDays(currentDate, -1))
    this.setState({ isAM: false })
  }

  setDate = (date) => {
    UI.setCurrentDate(parseLocal(date))
  }

  setAM = (isAM) => {
    this.setState({ isAM })
  }

  copyLast = () => {
    const { currentDate, runs } = this.props
    const currentIsAM = this.state.isAM

    const date = currentIsAM ? addDays(currentDate, -1) : currentDate
    const isAM = !currentIsAM

    const lastRuns = getRunsFor(runs, date, isAM)
    const currentRuns = getRunsFor(runs, currentDate, currentIsAM)
    const assignedTasksId = currentRuns.reduce((acc, r) => acc.concat(r.data.taskId), [])
    const assignedMembersId = currentRuns.reduce((acc, r) =>
      acc.concat(
        r.data.membersId.map(mId =>
          typeof mId === 'object' ? mId.id : mId)),
      [])

    lastRuns.forEach(run => {
      if (assignedTasksId.includes(run.data.taskId))
        return

      const newRun = { ...run.data }
      delete newRun.id
      newRun.date = format(currentDate, 'yyyy-MM-dd')
      newRun.isAM = currentIsAM
      newRun.membersId = newRun.membersId.filter(id => !assignedMembersId.includes(id))
      Run.create(newRun)
    })
  }

  addMissingTasks = tasksId => {
    if (this.state.lastCreatedDate === this.props.currentDate)
      return

    this.setState({
      lastCreatedDate: this.props.currentDate,
    })

    this.onAddTasks(tasksId)
  }

  onAddTasks = tasksId => {
    const { isAM } = this.state
    const { currentDate } = this.props

    tasksId.forEach(taskId => {
      Run.create({
        taskId,
        membersId: [],
        date: format(currentDate, 'yyyy-MM-dd'),
        isAM,
        notes: '',
      })
    })
  }

  startDrag = (e, member) => {
    const element = e.target.getBoundingClientRect()
    const dragPosition = getEventPosition(e)

    this.dragPosition = dragPosition
    this.dragOffset = {
      x: dragPosition.x - element.x,
      y: dragPosition.y - element.y,
      // We need both the element & the drag indicator to be
      // the same size for the offset to be correct.
      width: element.width,
      height: element.height,
    }

    this.setState({
      dragMember: member,
    })

    if (window.TouchEvent && e instanceof TouchEvent) {
      e.target.addEventListener('touchmove', this.onDragMove)
      e.target.addEventListener('touchend', this.stopDrag)
    }
    else {
      e.preventDefault()
      this.setState({ isDragging: true })
      document.addEventListener('mousemove', this.onDragMove)
      document.addEventListener('mouseup', this.stopDrag)
      this.applyDragStyles(true)
    }
  }

  stopDrag = (e) => {
    const { dragPosition } = this
    const { dragMember } = this.state
    const { x, y } = dragPosition
    const runId = getRunID(x, y)

    if (runId) {
      Run.addMember(runId, dragMember.data.id)
    }

    this.dragPosition = { x: 0, y: 0 }
    this.dragOffset   = { x: 0, y: 0 }

    this.setState({
      isDragging: false,
      dragMember: undefined,
    })

    if (window.TouchEvent && e instanceof TouchEvent) {
      e.target.removeEventListener('touchmove', this.onDragMove)
    }
    else {
      document.removeEventListener('mousemove', this.onDragMove)
      document.removeEventListener('mouseup', this.stopDrag)
    }
    this.applyDragStyles(false)
  }

  onDragMove = e => {
    const newPosition = getEventPosition(e)

    if (this.state.isDragging === false) {
      /* Touch device: we haven't decided yet if we are scrolling
       * or dragging */
      const dx = Math.abs(newPosition.x - this.dragPosition.x)
      const dy = Math.abs(newPosition.y - this.dragPosition.y)
      const yPercent = dy / (dy + dx)

      if (yPercent < 0.3) {
        /* Horizontal move: user is scrolling */
        this.stopDrag(e)
        return
      }
      else {
        /* Vertical move: user is dragging */
        e.preventDefault()
        this.setState({ isDragging: true })
      }
    }

    this.dragPosition = newPosition
    this.applyDragStyles(true)
  }

  applyDragStyles(isDragging) {
    if (isDragging) {
      this.dragIndicator.style.display = 'initial'
      this.dragIndicator.style.top     = `${this.dragPosition.y - this.dragOffset.y}px`
      this.dragIndicator.style.left    = `${this.dragPosition.x - this.dragOffset.x}px`
      this.dragIndicator.style.width   = `${this.dragOffset.width}px`
      this.dragIndicator.style.height  = `${this.dragOffset.height}px`
    }
    else {
      this.dragIndicator.style.display = 'none'
    }
  }

  render() {
    const { isAM, isDragging, dragMember } = this.state
    const {
      didInitialLoad,
      isLoading,
      defaultTasks,
      currentDate,
      members,
      tasks,
      runs
    } = this.props

    const visibleRuns = getRunsFor(runs, currentDate, isAM)
    const assignedTasksId = visibleRuns.reduce((acc, r) => acc.concat(r.data.taskId), [])
    const assignedMembersId = visibleRuns.reduce((acc, r) =>
      acc.concat(
        r.data.membersId.map(mId =>
          typeof mId === 'object' ? mId.id : mId)),
      [])
    const visibleMembers = members.filter(m =>
      isVisibleAtDate(m, currentDate) && !assignedMembersId.some(id => id === m.data.id))

    const unassignedTasks = tasks.filter(t => !assignedTasksId.includes(t.data.id))
    const missingDefaultTasks = defaultTasks.filter(taskId =>
      visibleRuns.find(r => r.data.taskId === taskId) === undefined)

    if (didInitialLoad && !isLoading && !isSunday(currentDate) && missingDefaultTasks.length > 0) {
      this.addMissingTasks(missingDefaultTasks)
    }

    const className = cx('SchedulePage vbox', { 'dragging': isDragging })

    return (
      <section className={className}>

        <div className='SchedulePage__dateControls hbox'>
          <Button icon='chevron-left'  onClick={this.previousPeriod} />
          <div className='fill' />
          <DatePicker
            date={currentDate}
            setDate={this.setDate}
          />
          <Gap h='10px' />
          <Switch
            label={['AM', 'PM']}
            value={isAM}
            onChange={this.setAM}
          />
          <div className='fill' />
          <Button icon='chevron-right' onClick={this.nextPeriod} />
        </div>

        <div className='SchedulePage__members hbox' ref={this.membersContainer}>
          {
            visibleMembers.map(m =>
              <MemberCard
                key={m.data.id}
                className='SchedulePage__member'
                style={{ opacity: (isDragging && dragMember === m) ? 0 : 1 }}
                size='small'
                member={m}
                data-member-id={m.data.id}
                onMouseDown={ev => this.startDrag(ev, m)}
              />
            )
          }
          {
            visibleMembers.length === 0 &&
              <MemberCard
                className='SchedulePage__member'
                size='small'
                empty
                label='Empty'
              />
          }
        </div>

        <div className='SchedulePage__container fill'>
          <div className='SchedulePage__list fill'>
            {
              visibleRuns.map(r =>
                <RunComponent
                  key={r.data.id}
                  run={r}
                  data-run-id={r.data.id}
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
          <Button icon='clipboard' onClick={this.copyLast}>
            Copy Last Day
          </Button>
          {!didInitialLoad &&
            <Label muted>
              Refreshing data...
            </Label>
          }
          <div className='fill' />
          <TaskPicker
            tasks={unassignedTasks}
            onDone={this.onAddTasks}
          >
            <Button
              icon='plus'
              variant='info'
            >
              Add Tasks
            </Button>
          </TaskPicker>
        </div>

        <div
          className='SchedulePage__dragIndicator'
          ref={ref => (ref && (this.dragIndicator = ref))}
        >
          <MemberCard
            size='small'
            member={dragMember}
          />
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps)(SchedulePage)


function findDataID(e) {
  let current = e.target
  while (current) {
    const id = current.getAttribute('data-member-id')
    if (id)
      return parseInt(id, 10)
    current = current.parentElement
  }
  return undefined
}

function getEventPosition(ev) {
  const e = ev.nativeEvent || ev

  if (window.TouchEvent && e instanceof TouchEvent) {
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
  while (target !== null && (runID = target.getAttribute('data-run-id')) === null)
    target = target.parentElement
  return +runID
}

function getRunsFor(runs, date, isAM) {
  const dateString = format(date, 'yyyy-MM-dd')
  return runs.filter(r => r.data.date === dateString && r.data.isAM === isAM)
}

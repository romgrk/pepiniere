import React from 'react'
import Prop from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import { format } from 'date-fns'
import { path, sort } from 'rambda'
import cx from 'clsx'

import { compareRun } from '../../models'

import Button from '../../components/Button'
import Icon from '../../components/Icon'
import Modal from '../../components/Modal'

class TaskPicker extends React.Component {

  static propTypes = {
    tasks: Prop.arrayOf(Prop.object).isRequired,
    categories: Prop.object.isRequired,
  }

  state = {
    open: false,
    selectedTasks: new Set(),
  }

  open = () => {
    this.setState({ open: true, selectedTasks: new Set() })
  }

  close = () => {
    this.setState({ open: false })
  }

  toggleSelectedTask = taskId => {
    const { selectedTasks } = this.state

    const newSelectedTasks = new Set(selectedTasks)

    if (selectedTasks.has(taskId))
      newSelectedTasks.delete(taskId)
    else
      newSelectedTasks.add(taskId)

    this.setState({
      selectedTasks: newSelectedTasks,
    })
  }

  onDone = () => {
    this.props.onDone(Array.from(this.state.selectedTasks))
    this.close()
  }

  render() {
    const { open, selectedTasks } = this.state
    const { children, tasks, tasksByID, categories, runs } = this.props

    const sortedRuns = sort(compareRun, runs).reverse()
    const orderedTasks = getMRUTasksId(sortedRuns, tasks, tasksByID)

    const trigger = React.Children.map(children, c => 
      React.cloneElement(c, {
        onClick: this.open,
      })
    )

    return (
      <>
        {trigger}
        <Modal
          className='ScheduleTaskPicker__modal'
          scrollable
          showHeader={false}
          open={open}
          onClose={this.close}
        >
          <div className='ScheduleTaskPicker__tasks fill vbox'>
            {orderedTasks.map(t =>
              <div
                key={t.data.id}
                className='ScheduleTaskPicker__task hbox'
                role='button'
                onClick={() => this.toggleSelectedTask(t.data.id)}
              >
                <div
                  className='ScheduleTaskPicker__task__color'
                  style={{ backgroundColor: path([t.data.categoryId, 'data', 'color'], categories) }}
                />
                <div className='ScheduleTaskPicker__task__name fill'>{t.data.name}</div>
                <div className='ScheduleTaskPicker__task__icon'>
                  <Icon
                    size='1x'
                    name={selectedTasks.has(t.data.id) ? 'check' : 'circle-o'}
                  />
                </div>
              </div>
            )}
          </div>
          <div className='ScheduleTaskPicker__actions row'>
            <Button onClick={this.close}>
              Cancel
            </Button>
            <div className='fill' />
            <Button onClick={this.onDone} variant='info'>
              Done
            </Button>
          </div>
        </Modal>
      </>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoading: createSelector(state => state.runs.isLoading, state => state),
  isCreating: createSelector(state => state.runs.isCreating, state => state),
  categories: createSelector(state => state.categories.data, state => state),
  runs: createSelector(state => Object.values(state.runs.data), state => state),
  tasksByID: createSelector(state => state.tasks.data, state => state),
})

export default connect(mapStateToProps)(TaskPicker)


function formatEditableDate(date) {
  return format(date, 'yyyy-MM-dd')
}

function formatReadableDate(date) {
  if (date.getFullYear() === new Date().getFullYear())
    return format(date, 'EEEE MMM d')
  return format(date, 'EEEE MMM d, yyyy')
}

function getMRUTasksId(runs, tasks, tasksByID) {
  const tasksId = []
  const visibleTasksId = new Set(tasks.map(t => t.data.id))
  const usedTasksId = new Set()

  runs.forEach(r => {
    const { taskId } = r.data
    if (!visibleTasksId.has(taskId))
      return
    if (usedTasksId.has(taskId))
      return
    usedTasksId.add(taskId)
    tasksId.push(taskId)
  })

  tasks.forEach(t => {
    if (usedTasksId.has(t.data.id))
      return
    tasksId.push(t.data.id)
  })

  return tasksId.map(id => tasksByID[id])
}

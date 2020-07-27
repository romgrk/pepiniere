import React from 'react'
import Prop from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import { format } from 'date-fns'
import { filter, groupBy } from 'rambda'
import cx from 'classname'

import Button from '../../components/Button'
import Icon from '../../components/Icon'
import Modal from '../../components/Modal'
import Title from '../../components/Title'

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
    const { isCreating, isLoading, tasks, categories } = this.props
    const loading = isCreating || isLoading

    const tasksByCategoryId =
      filter((key, tasks) => tasks.length > 0,
        groupBy(t => t.data.categoryId, tasks))

    return (
      <>
        <Button
          className='ScheduleTaskPicker__button fill'
          variant='info'
          loading={loading}
          onClick={this.open}
        >
          Add Tasks
        </Button>
        <Modal
          className='ScheduleTaskPicker__modal'
          open={open}
          onClose={this.close}
        >
          {Object.entries(tasksByCategoryId).map(([categoryId, tasks]) =>
            <div className='ScheduleTaskPicker__category'>
              <div className='ScheduleTaskPicker__category__name'>
                {categories[categoryId].data.name}
              </div>
              <div className='ScheduleTaskPicker__category__tasks vbox'>
              {tasks.map(t =>
                <div
                  key={t.data.id}
                  className='ScheduleTaskPicker__task hbox'
                  role='button'
                  onClick={() => this.toggleSelectedTask(t.data.id)}
                >
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
            </div>
          )}
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

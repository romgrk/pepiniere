import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { set } from 'object-path-immutable'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Category from '../../actions/categories'
import Task from '../../actions/tasks'

import Button from '../../components/Button'
import ColorPicker from '../../components/ColorPicker'
import EditableLabel from '../../components/EditableLabel'
import Expander from '../../components/Expander'
import Gap from '../../components/Gap'
import Input from '../../components/Input'

import TaskComponent from './Task'

class CategoryComponent extends React.Component {

  state = {
    newTask: '',
  }

  onUpdate = (key, value) => {
    const { category } = this.props
    Category.update(category.data.id, set(category.data, [key], value))
  }

  onDelete = () => {
    const { category } = this.props
    if (!window.confirm(`Are you sure you want to delete ${category.data.name}?`))
      return
    Category.delete(category.data.id)
  }

  onAddTask = () => {
    const { category } = this.props
    const { newTask } = this.state

    if (newTask.trim() === '')
      return

    Task.create({ categoryId: category.data.id, name: newTask })
    .then(() => {
      this.setState({ newTask: '' })
    })
  }

  render() {
    const { category, tasks, isCreating } = this.props

    const currentTasks = tasks.filter(t => t.data.categoryId === category.data.id)

    return (
      <div className='Category'>
        <Expander
          trigger={({ toggle }) =>
            <div className='Category__section hbox'>
              <ColorPicker
                simple
                className='Category__color'
                value={category.data.color}
                onChange={color => this.onUpdate('color', color)}
              />
              <EditableLabel
                size='large'
                className='Category__name fill'
                value={category.data.name}
                onEnter={name => this.onUpdate('name', name)}
              />
              {window.ALLOW_DELETION &&
                <Button
                  size='large'
                  icon='remove'
                  onClick={this.onDelete}
                />
              }
              <Button
                size='large'
                className='Category__toggle'
                icon='chevron-left'
                onClick={toggle}
              />
            </div>
          }
        >
          <>
            <div className='Category__tasks'>
              {
                currentTasks.map(task =>
                  <TaskComponent
                    key={task.data.id}
                    task={task}
                  />
                )
              }
            </div>
            <div className='Category__controls hbox'>
              <Input
                size='large'
                className='fill'
                placeholder='New task'
                value={this.state.newTask}
                onChange={newTask => this.setState({ newTask })}
              />
              <Gap h='10px' />
              <Button
                size='large'
                variant='info'
                onClick={this.onAddTask}
                loading={isCreating}
              >
                Create
              </Button>
            </div>
          </>
        </Expander>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  tasks: createSelector(state => Object.values(state.tasks.data), state => state),
  isCreating: createSelector(state => state.tasks.isCreating, state => state),
})

export default connect(mapStateToProps)(CategoryComponent)

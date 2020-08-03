import React from 'react'
import { Link } from 'react-router-dom'
import { set } from 'object-path-immutable'

import Task from '../../actions/tasks'

import Button from '../../components/Button'
import EditableLabel from '../../components/EditableLabel'
import Gap from '../../components/Gap'
import Icon from '../../components/Icon'


class TaskComponent extends React.Component {

  onUpdate = (key, value) => {
    const { task } = this.props
    Task.update(task.data.id, set(task.data, [key], value))
  }

  onDelete = () => {
    const { task } = this.props
    if (!window.confirm(`Are you sure you want to delete ${task.data.name}?`))
      return
    Task.delete(task.data.id)
  }

  render() {
    const { task } = this.props

    return (
      <div className='Task hbox'>
        <div className='Task__name fill'>
          <EditableLabel
            className='fill'
            value={task.data.name}
            onEnter={name => this.onUpdate('name', name)}
          />
        </div>
        <Link to={`/tasks/${task.data.id}`} className='Button iconButton has-icon'>
          <Icon name='arrow-right' />
        </Link>
        {window.ALLOW_DELETION &&
          <>
            <Gap h='10px' />
            <Button
              icon='remove'
              onClick={this.onDelete}
            />
          </>
        }
      </div>
    )
  }
}

export default (TaskComponent)

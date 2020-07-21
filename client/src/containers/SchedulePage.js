import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { set } from 'object-path-immutable'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import {
  format,
  startOfToday,
  addDays,
} from 'date-fns'

import { abbreviate, isVisibleAtDate } from '../models'

import Category from '../actions/categories'
import Task from '../actions/tasks'

import Button from '../components/Button'
import ColorPicker from '../components/ColorPicker'
import Gap from '../components/Gap'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Label from '../components/Label'
import Text from '../components/Text'
import Title from '../components/Title'


class SchedulePage extends React.Component {

  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  state = {
    date: startOfToday(),
  }

  setDate(date) {
    this.setState({ date })
  }

  render() {
    const { date } = this.state
    const { members, categories, tasks } = this.props

    const visibleMembers = members.filter(m => isVisibleAtDate(m, date))

    return (
      <section className='SchedulePage vbox'>

        <div className='SchedulePage__dateControls row'>
          <Button icon='chevron-left'  onClick={() => this.setDate(addDays(this.state.date, -1))} />
          <Title
            large
            center
            className='inline fill'
          >
            {formatDate(date)}
          </Title>
          <Button icon='chevron-right' onClick={() => this.setDate(addDays(this.state.date, 1))} />
        </div>

        <div className='SchedulePage__members hbox'>
          {
            visibleMembers.map(m =>
              <div
                key={m.data.id}
                className='SchedulePage__member vbox'
                role='button'
                onClick={() => this.openUpdateMemberForm(m)}
              >
                <div className='MembersPage__photo text-center'>
                  {m.data.photo ?
                    <img
                      width="auto"
                      height="50px"
                      src={m.data.photo}
                    /> :
                    <Icon
                      name='user-circle'
                      size='5x'
                      style={{ height: 50, width: 'auto' }}
                    />
                  }
                </div>
                <div className='text-bold text-center no-wrap'>
                  {[m.data.firstName, abbreviate(m.data.lastName)].join(' ')}
                </div>
              </div>
            )
          }
        </div>

        <div className='SchedulePage__container fill'>
          <div className='SchedulePage__list fill'>
            {
              categories.length === 0 &&
                <Text muted>
                  No categories yet
                </Text>
            }
          </div>
        </div>

        <div className='SchedulePage__controls row no-padding flex'>
          <Gap h='10px' />
          <Input
            className='fill'
            value={this.state.newCategoryName}
            onChange={newCategoryName => this.setState({ newCategoryName })}
          />
          <Gap h='10px' />
          <Button variant='info' onClick={this.onAddCategory}>
            Add
          </Button>
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
})

export default connect(mapStateToProps)(SchedulePage)


function formatDate(date) {
  if (date.getFullYear() === new Date().getFullYear())
    return format(date, 'EEEE MMM d')
  return format(date, 'EEEE MMM d, yyyy')
}

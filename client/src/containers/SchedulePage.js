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
  }

  setDate(date) {
    this.setState({ date })
  }

  setAM(isAM) {
    this.setState({ isAM })
  }

  onAddNewTask = taskId => {
  }

  render() {
    const { date, isAM } = this.state
    const { members, categories, tasks, runs } = this.props
    const dateString = format(date, 'yyyy-MM-dd')

    const visibleMembers = members.filter(m => isVisibleAtDate(m, date))
    const visibleRuns = runs.filter(r => r.data.date === dateString && r.data.isAM === isAM)

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
              <MemberCard
                key={m.data.id}
                className='SchedulePage__member'
                size='small'
                member={m}
              />
            )
          }
        </div>

        <div className='SchedulePage__container fill'>
          <div className='SchedulePage__list fill'>
            {
              visibleRuns.map(r =>
                <RunComponent
                  key={r.data.taskId}
                  run={r}
                />
              )
            }
            {
              visibleRuns.length === 0 &&
                <Text center large muted block>
                  No runs yet
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
            {
              tasks.map(t =>
                <option key={t.data.id} value={t.data.id}>
                  {categories[t.data.categoryId].data.name} -- {t.data.name}
                </option>
              )
            }
          </Select>
        </div>
      </section>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  settings: createSelector(state => state.settings, state => state),
  members: createSelector(state => Object.values(state.members.data), state => state),
  categories: createSelector(state => state.categories.data, state => state),
  tasks: createSelector(state => Object.values(state.tasks.data), state => state),
  runs: createSelector(state => Object.values(state.runs.data), state => state),
})

export default connect(mapStateToProps)(SchedulePage)


function formatDate(date) {
  if (date.getFullYear() === new Date().getFullYear())
    return format(date, 'EEEE MMM d')
  return format(date, 'EEEE MMM d, yyyy')
}

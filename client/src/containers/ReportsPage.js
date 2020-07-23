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


class ReportsPage extends React.Component {

  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  state = {
    date: startOfToday(),
  }

  render() {
    const {  } = this.state
    const { members, categories, tasks, runs } = this.props

    const className = cx('ReportsPage vbox')

    return (
      <section className={className}>

        <div className='ReportPage__controls row no-padding flex'>
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

export default connect(mapStateToProps)(ReportsPage)

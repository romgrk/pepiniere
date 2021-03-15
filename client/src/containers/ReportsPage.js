import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'
import {
  map,
  min,
  max,
  range,
  reduce,
  compose,
} from 'rambda'
import cx from 'clsx'

import { fromLoadable } from '../helpers/to-loadable'
import download from '../helpers/download'

import Button from '../components/Button'
import Form from '../components/Form'
import Label from '../components/Label'
import Select from '../components/Select'
import Text from '../components/Text'
import Title from '../components/Title'


const parseYear = r => +r.date.slice(0, 4)
const toYears = map(parseYear)
const getFirstYear = compose(reduce(min, 9999), toYears)
const getLastYear  = compose(reduce(max, 1900), toYears)


const mapStateToProps = createStructuredSelector({
  settings:   createSelector(state => state.settings, state => state),
  members:    createSelector(state => fromLoadable(state.members.data), state => state),
  categories: createSelector(state => fromLoadable(state.categories.data), state => state),
  tasks:      createSelector(state => fromLoadable(state.tasks.data), state => state),
  runs:       createSelector(state => fromLoadable(Object.values(state.runs.data)), state => state),
})

class ReportsPage extends React.Component {
  static propTypes = {
    members: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
    runs: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  state = {
    year: new Date().getFullYear(),
    isGenerating: false,
    error: undefined,
  }

  componentWillReceiveProps(props) {
    if (props.runs !== this.props.runs)
      this.setState({
        year: getLastYear(props.runs)
      })
  }

  onGenerateReport = () => {
    const { year } = this.state
    const { members, categories, tasks, runs } = this.props

    this.setState({ isGenerating: true })

    import('../helpers/generate-report').then(({ default: generateReport }) => {
      const report = generateReport(year, runs, members, categories, tasks)
      download(`report-${year}.xlsx`, report)
    })
    .catch(err => {
      this.setState({ error: err.message })
    })
    .then(() => {
      this.setState({ isGenerating: false })
    })
  }

  render() {
    const { year, isGenerating, error } = this.state
    const { runs } = this.props

    const className = cx('ReportsPage vbox')

    const years =
      runs.length === 0 ?
        [] :
        range(getFirstYear(runs), getLastYear(runs) + 1).reverse()

    return (
      <section className={className}>

        <div className='row'>
          <div className='vbox full-width'>
            <Title>
              Reports
            </Title>
            <Text>
              Select the year for which you want to generate a report for.
            </Text>
            {error &&
              <Label error>
                Error: {error}
              </Label>
            }
          </div>
        </div>

        <Form className='row' onSubmit={this.onGenerateReport}>
          <Select value={year} onChange={year => this.setState({ year: +year })}>
            {years.map(y =>
              <option value={y}>{y}</option>
            )}
          </Select>
          <Button loading={isGenerating}>
            Generate Report
          </Button>
        </Form>


        <div className='row'>
          <div>
            <Title>
              Informations
            </Title>
            <Text>
              Members: <b>{Object.values(this.props.members).length}</b><br/>
              Runs: <b>{this.props.runs.length}</b><br/>
            </Text>
          </div>
        </div>


        <div className='ReportPage__controls row no-padding flex' />
      </section>
    )
  }
}

export default connect(mapStateToProps)(ReportsPage)

import React from 'react'
import prop from 'prop-types'
import {
  Link,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Category from '../actions/categories'

import Button from '../components/Button'
import ColorPicker from '../components/ColorPicker'
import Form from '../components/Form'
import Gap from '../components/Gap'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Text from '../components/Text'
import Title from '../components/Title'

import CategoryComponent from './tasks/Category'


class TasksPage extends React.Component {

  static propTypes = {
    categories: prop.arrayOf(prop.object).isRequired,
    tasks: prop.object.isRequired,
  }

  state = {
    newCategoryName: '',
    newCategoryColor: '',
  }

  onAddCategory = () => {
    const { newCategoryName, newCategoryColor } = this.state

    if (newCategoryName === '')
      return

    const category = {
      name: newCategoryName,
      color: newCategoryColor,
    }
    Category.create(category)
    .then(() => {
      this.setState({
        newCategoryName: '',
        newCategoryColor: '',
      })
    })
  }

  renderMain = () => {
    const { categories } = this.props

    return (
      <div className='Page__main vbox'>
        <div className='TasksPage__listContainer fill'>
          <div className='TasksPage__list fill'>
            {
              categories.map(category =>
                <CategoryComponent
                  key={category.data.id}
                  category={category}
                />
              )
            }
            {
              categories.length === 0 &&
                <Text muted>
                  No categories yet
                </Text>
            }
          </div>
        </div>

        <Form className='Page__controls row no-padding flex' onSubmit={this.onAddCategory}>
          <ColorPicker
            simple
            position='top'
            align='right'
            value={this.state.newCategoryColor}
            onChange={newCategoryColor => this.setState({ newCategoryColor })}
          />
          <Gap h='10px' />
          <Input
            className='fill'
            value={this.state.newCategoryName}
            onChange={newCategoryName => this.setState({ newCategoryName })}
          />
          <Gap h='10px' />
          <Button variant='info'>
            Add
          </Button>
        </Form>
      </div>
    )
  }

  renderTaskSection = ({ match }) => {
    const taskId = +match.params.taskId
    const { tasks, runs } = this.props
    const task = tasks[taskId]

    const runsForTask = runs.filter(r => r.data.taskId === taskId).reverse()

    return (
      <div className='Page__section vbox'>
        <div className='Page__controls Page__controls--top row no-padding flex'>
          <Link to='/tasks' className='Button iconButton has-icon'>
            <Icon name='arrow-left' />
          </Link>
          <Gap h='10px' />
          <Title>{task ? task.data.name : 'Loading...'}</Title>
        </div>

        <div className='TasksPage__listContainer fill'>
          <div className='TasksPage__list fill'>
            {
              runsForTask.map(r =>
                <div key={r.data.id} className='TasksPage__run hbox'>
                  <Text muted className='TasksPage__run__date no-wrap'>
                    {r.data.date}
                  </Text>
                  <Gap h='20px' />
                  <span className='TasksPage__run__notes'>{r.data.notes}</span>
                </div>
              )
            }
            {
              runsForTask.length === 0 &&
                <Text muted>
                  No entry yet
                </Text>
            }
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { location } = this.props

    return (
      <section className='TasksPage Page'>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            in={true}
            timeout={{ enter: 5000, exit: 5000 }}
            classNames={'transition'}
          >
            <Switch location={location}>
              <Route exact path='/tasks' render={this.renderMain} />
              <Route path='/tasks/:taskId' render={this.renderTaskSection} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </section>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  settings: createSelector(state => state.settings, state => state),
  categories: createSelector(state => Object.values(state.categories.data), state => state),
  tasks: createSelector(state => state.tasks.data, state => state),
  runs: createSelector(state => Object.values(state.runs.data), state => state),
})

export default withRouter(connect(mapStateToProps)(TasksPage))


import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { set } from 'object-path-immutable'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Category from '../actions/categories'
import Task from '../actions/tasks'

import Button from '../components/Button'
import ColorPicker from '../components/ColorPicker'
import Gap from '../components/Gap'
import Input from '../components/Input'
import Label from '../components/Label'
import Text from '../components/Text'

import CategoryComponent from './tasks/Category'


class TasksPage extends React.Component {

  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  state = {
    newCategoryName: '',
    newCategoryColor: '',
  }

  onAddCategory = () => {
    const { newCategoryName, newCategoryColor } = this.state
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

  render() {
    const { categories, tasks } = this.props

    return (
      <section className='TasksPage vbox'>

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

        <div className='TasksPage__controls row no-padding flex'>
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
  categories: createSelector(state => Object.values(state.categories.data), state => state),
  tasks: createSelector(state => Object.values(state.tasks.data), state => state),
})

export default connect(mapStateToProps)(TasksPage)


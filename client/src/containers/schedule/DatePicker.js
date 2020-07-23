import React from 'react'
import Prop from 'prop-types'
import { format } from 'date-fns'
import cx from 'classname'

import Input from '../../components/Input'
import Title from '../../components/Title'

class DatePicker extends React.Component {

  static propTypes = {
    date: Prop.object.isRequired,
    setDate: Prop.func.isRequired,
    className: Prop.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      date: props.date
    }
  }

  setEditing(isEditing) {
    this.setState({ isEditing })
  }

  onRef = ref => {
    if (ref)
      ref.focus()
  }

  render() {
    const { isEditing } = this.state
    const { date, setDate, className } = this.props

    const elementClassName = cx('ScheduleDatePicker', className)

    if (!isEditing)
      return (
        <Title
          large
          center
          className={elementClassName}
          role='button'
          onClick={() => this.setEditing(true)}
        >
          {formatReadableDate(date)}
        </Title>
      )

    return (
      <Input
        type='date'
        className={elementClassName}
        value={formatEditableDate(date)}
        onChange={setDate}
        onBlur={() => this.setEditing(false)}
        onEnter={date => { setDate(date); this.setEditing(false) }}
        ref={this.onRef}
      />
    )
  }
}

export default DatePicker


function formatEditableDate(date) {
  return format(date, 'yyyy-MM-dd')
}

function formatReadableDate(date) {
  if (date.getFullYear() === new Date().getFullYear())
    return format(date, 'EEEE MMM d')
  return format(date, 'EEEE MMM d, yyyy')
}

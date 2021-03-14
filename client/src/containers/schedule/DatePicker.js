import React from 'react'
import Prop from 'prop-types'
import { format } from 'date-fns'
import cx from 'clsx'

import getPlatform from '../../helpers/platform-detect'
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
      date: props.date
    }
  }

  blur() {
    if (this.input)
      this.input.blur()
  }

  onChange = (value) => {
    this.props.setDate(value)
    if (getPlatform().isTouch)
      this.blur()
  }

  onRef = ref => {
    if (ref) {
      this.input = ref
    }
  }

  render() {
    const { date, setDate, className } = this.props

    const elementClassName = cx('ScheduleDatePicker', className)

    return (
      <div className={elementClassName}>
        <Title
          large
          center
          className='ScheduleDatePicker__title'
          role='button'
        >
          {formatReadableDate(date)}
        </Title>
        <Input
          type='date'
          className='ScheduleDatePicker__input'
          value={formatEditableDate(date)}
          onChange={this.onChange}
          onEnter={date => { setDate(date); this.blur() }}
          ref={this.onRef}
        />
      </div>
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

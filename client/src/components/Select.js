import React from 'react'
import Prop from 'prop-types'
import classname from 'classname'
import { equals } from 'ramda'

import Button from './Button'
import Icon from './Icon'

class Select extends React.Component {
  static propTypes = {
    status: Prop.oneOf(['info', 'warning', 'error', 'success']),
    validate: Prop.func,
  }

  state = {
    value: '',
  }

  shouldComponentUpdate(nextProps) {
    return !equals(this.props, nextProps)
  }

  accept(ev) {
    this.props.onEnter && this.props.onEnter(ev.target.value, ev)
  }

  isControlled() {
    return this.props.value !== undefined
  }

  getValue() {
    if (this.isControlled())
      return this.props.value
    return this.state.value
  }

  change(value) {
    if (this.props.onChange)
      this.props.onChange(value)
    if (!this.isControlled()) {
      this.setState({ value })
      this.forceUpdate()
    }
  }

  onChange = (ev) => {
    this.change(ev.target.value)
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      icon,
      small,
      large,
      value,
      loading,
      status,
      autoSelect,
      onEnter,
      validate,
      disabled,
      forwardedRef,
      children,
      ...rest
    } = this.props
    /* eslint-enable no-unused-vars */

    const actualValue = this.getValue()

    const actualStatus = status || ((validate && actualValue) ?
      (validate(actualValue) ? 'success' : 'error') :
      undefined)

    const selectClassName = classname(
      'Select',
      className,
      actualStatus,
      {
        small,
        large,
        'has-icon': icon !== undefined,
        disabled,
      }
    )

    return (
      <div className={selectClassName}>
        { icon && <Icon name={icon} className='Select__icon' /> }
        <select
          { ...rest }
          className='Select__element'
          value={actualValue}
          disabled={disabled}
          onChange={this.onChange}
          ref={forwardedRef}
        >
          {children}
        </select>
        { loading && <span className='loading-spinner-tiny'/> }
      </div>
    )
  }
}


function forwardRef(props, ref) {
  return <Select {...props} forwardedRef={ref} />
}
forwardRef.displayName = 'Select'

export default React.forwardRef(forwardRef)

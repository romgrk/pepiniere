import React from 'react'
import prop from 'prop-types'
import cx from 'clsx'

class Switch extends React.Component {
  static propTypes = {
    value: prop.bool.isRequired,
    onChange: prop.func.isRequired,
  }

  onChange = (event) => {
    const newValue = event.target.checked

    if (newValue !== this.props.value)
      this.props.onChange(newValue)
  }

  render() {
    const {
      size,
      className,
      value,
      inverse,
      label,
      ...rest
    } = this.props

    const switchClassName = cx(
      'Switch',
      className,
      size,
      { 'Switch--inverse': inverse }
    )

    return (
      <label className={switchClassName} role='switch' aria-checked={value}>
        <input
          type='checkbox'
          className='Switch__toggle'
          checked={value}
          {...rest}
          onChange={this.onChange}
        />
        <span className='Switch__label'>
          {
            label &&
              <>
                <span className='Switch__on'>{label[0]}</span>
                <span className='Switch__off'>{label[1]}</span>
              </>
          }
          <span className='Switch__focus' />
          <span className='Switch__button' />
        </span>
      </label>
    )
  }
}

Switch.propTypes = {
  size:      prop.oneOf(['mini', 'small', 'medium', 'large']),
  className: prop.string,
  children:  prop.oneOf([prop.array, prop.object]),
  inverse:   prop.bool,
  label:     prop.array,
}
Switch.defaultProps = {
  size: 'medium',
  inverse: false,
  label: ['on', 'off'],
}

export default Switch

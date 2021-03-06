import React from 'react'
import Prop from 'prop-types'
import pure from 'recompose/pure'
import classname from 'clsx'

import Icon from './Icon'
import Spinner from './Spinner'

function Button(props) {
  const {
    className,
    type,
    size,
    active,
    flat,
    basic,
    round,
    square,
    center,
    // Styles:
    variant,
    // Other:
    loading,
    disabled,
    children,
    icon,
    iconAfter,
    onClick,
    ...rest
  } = props
  let { iconButton } = props

  if (iconButton === undefined && !children && icon)
    iconButton = true

  const buttonClassName = classname(
    'Button',
    className,
    type,
    size,
    variant === 'danger' ? 'error' : variant,
    {
      'active': active,
      'flat': flat,
      'basic': basic,
      'round': round,
      'square': square,
      'iconButton': iconButton,
      'center': center,
      'has-icon': icon !== undefined,
    },
  )

  return (
    <button className={buttonClassName}
      onClick={onClick}
      disabled={loading || disabled}
      {...rest}
    >
      { icon !== undefined && <Icon name={icon} marginRight={(round || square || iconButton) ? 0 : 5} className='Button__icon' /> }
      {
        children &&
          <span>{ children }</span>
      }
      {
        loading &&
          <Spinner />
      }
      { iconAfter !== undefined && !loading &&
        <Icon name={iconAfter} className='Button__iconAfter' />
      }
    </button>
  )
}

Button.propTypes = {
  variant: Prop.oneOf([
    'default',
    'normal',
    'info',
    'success',
    'warning',
    'error',
    'muted',
    'subtle',
    'highlight',
  ]),
  className: Prop.string,
  type: Prop.string,
  size: Prop.oneOf(['small', 'medium', 'large']),
  active: Prop.bool,
  loading: Prop.bool,
  disabled: Prop.bool,
  icon: Prop.string,
  iconAfter: Prop.string,
  iconButton: Prop.bool,
  basic: Prop.bool,
  flat: Prop.bool,
  square: Prop.bool,
  round: Prop.bool,
  center: Prop.bool,
  children: Prop.node,
  onClick: Prop.func,
}


export default pure(Button)

import React from 'react'
import pure from 'recompose/pure'
import classname from 'clsx'

function Text(props) {
  const {
    children,
    className,
    inline,
    block,
    bold,
    small,
    medium,
    large,
    huge,
    normal,
    info,
    success,
    warning,
    error,
    muted,
    subtle,
    highlight,
    center,
    tag,
    ...rest
  } = props

  const labelClassName = classname(
    'text',
    className,
    {
      'small': small,
      'medium': medium,
      'large': large,
      'huge': huge,
      'inline': inline,
      'block': block,
      'text-bold': bold,
      'text-normal': normal,
      'text-info': info,
      'text-success': success,
      'text-warning': warning,
      'text-error': error,
      'text-muted': muted,
      'text-subtle': subtle,
      'text-highlight': highlight,
      'text-center': center,
    }
  )

  return (
    React.createElement(
      tag || 'span',
      { className: labelClassName, ...rest },
      children
    )
  )
}

export default pure(Text)

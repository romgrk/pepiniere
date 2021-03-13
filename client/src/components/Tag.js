import React from 'react'
import pure from 'recompose/pure'
import classname from 'clsx'

function Tag(props) {
  const {
    name,
    className,
    size,
    variant,
    ...rest
  } = props

  const tagClassName = classname(
    'Tag',
    className,
    size ? `Tag--${size}` : undefined,
    variant ? `Tag--${variant}` : undefined,
  )

  return (
    <span className={tagClassName} {...rest}>
      {children}
    </span>
  )
}

export default pure(Tag)

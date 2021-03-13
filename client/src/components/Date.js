import React from 'react'
import pure from 'recompose/pure'
import classname from 'clsx'

import getPlatform from '../helpers/platform-detect'
import { isValidDate, humanReadableDate } from '../helpers/human-readable-time'
import Tooltip from './Tooltip'
import Text from './Text'

function Date(props) {
  const {
    children,
    className,
    inline,
    small,
    large,
    info,
    success,
    warning,
    error,
    muted,
    subtle,
    highlight,
    ...rest
  } = props

  const timeClassName = classname(
    'Date',
    className,
    {
      'small': small,
      'large': large,
      'inline': inline,
      'text-info': info,
      'text-success': success,
      'text-warning': warning,
      'text-error': error,
      'text-muted': muted,
      'text-subtle': subtle,
      'text-highlight': highlight,
    }
  )

  const content =
    isValidDate(children) ?
      <abbr className={timeClassName} { ...rest }>
        { humanReadableDate(children) }
      </abbr> :
      <Text muted small>[Invalid date]</Text>

  if (getPlatform().isTouch)
    return content

  return (
    <Tooltip content={children} offset='15px 0'>
      {content}
    </Tooltip>
  )
}

export default pure(Date)

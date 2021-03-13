import React from 'react'
import pure from 'recompose/pure'
import classname from 'clsx'

import getPlatform from '../helpers/platform-detect'
import humanReadableTime, { humanDetailedTime } from '../helpers/human-readable-time'
import Tooltip from './Tooltip'

function Time(props) {
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
    'Time',
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
    <abbr className={timeClassName} { ...rest }>
      { humanReadableTime(children) }
    </abbr>

  if (getPlatform().isTouch)
    return content

  return (
    <Tooltip content={humanDetailedTime(children)} offset='15px 0'>
      {content}
    </Tooltip>
  )
}

export default pure(Time)

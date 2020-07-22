import React from 'react'
import Prop from 'prop-types'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import cx from 'classname'

import { abbreviate } from '../models'

import DateValue from '../components/Date'
import Icon from '../components/Icon'
import Text from '../components/Text'

const IMAGE_SIZE = {
  small: 40,
  medium: 60,
  large: 80,
}

function MemberCard({ className, size, member, detailed, ...rest }) {
  const isDeleted = typeof member === 'number'
  const imageSize = IMAGE_SIZE[size]

  return (
    <div
      className={cx('MemberCard vbox', className)}
      role='button'
      {...rest}
    >
      <div className='MemberCard__photo text-center'>
        {
          isDeleted ?
            <Icon
              name='user-circle'
              size={ size === 'small' ? '3x' : '5x' }
              style={{ height: imageSize, width: 'auto', opacity: 0.6 }}
            /> :
          member.data.photo ?
            <img
              width="auto"
              height={imageSize + 'px'}
              src={member.data.photo}
            /> :
            <Icon
              name='user-circle'
              size={ size === 'small' ? '3x' : '5x' }
              style={{ height: imageSize, width: 'auto' }}
            />
        }
      </div>
      <div className='text-bold text-center no-wrap'>
        {
          isDeleted ?
            <Text muted>[DELETED {member}]</Text> :
          detailed ?
            [
              getUnicodeFlagIcon(member.data.country),
              member.data.firstName,
              abbreviate(member.data.lastName)
            ].filter(Boolean).join(' ') :
            [member.data.firstName, abbreviate(member.data.lastName)].filter(Boolean).join(' ')
        }
      </div>
      {!isDeleted && detailed &&
        <div className='text-center'>
          {!member.data.isPermanent &&
            <span><DateValue>{member.data.startDate}</DateValue> - <DateValue>{member.data.endDate}</DateValue></span>
          }
          {Boolean(member.data.isPermanent) &&
            <span>&nbsp;</span>
          }
        </div>
      }
    </div>
  )
}

MemberCard.propTypes = {
  member: Prop.object.isRequired,
  detailed: Prop.bool,
  size: Prop.oneOf(['small', 'medium', 'large']),
}

MemberCard.defaultProps = {
  detailed: false,
  size: 'medium',
}

export default MemberCard

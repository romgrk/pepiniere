import React from 'react'
import Prop from 'prop-types'
import cx from 'clsx'

import { abbreviate } from '../models'
import getCountryFlag from '../helpers/get-country-flag'
import useLoadingImage from '../helpers/use-loading-image'

import DateValue from '../components/Date'
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'
import Text from '../components/Text'

const IMAGE_SIZE = {
  small: 40,
  medium: 70,
  large: 80,
}

function MemberCard({ className, size, member, empty, label, detailed, ...rest }) {
  const isDeleted = typeof member === 'number'
  const imageSize = IMAGE_SIZE[size]
  const iconSize = size === 'small' ? '3x' : '5x'
  const loaderSize = imageSize * 0.9

  const photoSrc = useLoadingImage(member?.data.photo)
  const isLoadingPhoto = Boolean(member?.data.photo) && !Boolean(photoSrc)

  if (empty || member == undefined)
    return (
      <div className={cx('MemberCard vbox', className)}>
        <div className='MemberCard__photo vbox box--align-center no-pointer-events'>
          <div
            className='MemberCard__photoEmpty'
            style={{ height: imageSize, width: imageSize, opacity: 0.6 }}
          />
        </div>
        <div className='text-bold text-center no-wrap no-pointer-events'>
          <Text muted bold>{ label || 'Add user' }</Text>
        </div>
      </div>
    )

  return (
    <div
      className={cx('MemberCard', className, {
        'MemberCard--loading': member.isLoading,
        'MemberCard--loading-photo': isLoadingPhoto,
      })}
      role='button'
      {...rest}
    >
      <div className='MemberCard__content vbox'>
        <div className='MemberCard__photo vbox box--align-center no-pointer-events'>
          {
            isDeleted ?
              <Icon
                name='user-circle'
                size={iconSize}
                style={{ height: imageSize, width: 'auto', opacity: 0.6 }}
              /> :
            photoSrc ?
              <img
                className='MemberCard__photo__img'
                width="auto"
                height={imageSize + 'px'}
                src={photoSrc}
              /> :
              <>
                <Icon
                  className='MemberCard__photo__icon'
                  name='user-circle'
                  size={iconSize}
                  style={{ height: imageSize, width: 'auto' }}
                />
                {isLoadingPhoto &&
                  <span
                    className='MemberCard__photo__loading'
                    style={{ height: imageSize, width: imageSize }}
                  >
                    <Icon
                      name='circle-o-notch'
                      size={iconSize}
                      spin
                      style={{
                        height:   loaderSize,
                        width:    loaderSize,
                        fontSize: loaderSize,
                      }}
                    />
                  </span>
                }
              </>
          }
        </div>
        <div className='text-bold text-center no-wrap no-pointer-events'>
          {
            isDeleted ?
              <Text muted>[DELETED {member}]</Text> :
              [
                member.data.country ? getCountryFlag(member.data.country) : undefined,
                member.data.firstName,
                abbreviate(member.data.lastName)
              ].filter(Boolean).join(' ')
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
      {
        member.isLoading &&
          <Spinner
            className='MemberCard__spinner'
            size='small'
          />
      }
    </div>
  )
}

MemberCard.propTypes = {
  member: Prop.oneOfType([Prop.object, Prop.number]).isRequired,
  detailed: Prop.bool,
  empty: Prop.bool,
  size: Prop.oneOf(['small', 'medium', 'large']),
  className: Prop.string,
}

MemberCard.defaultProps = {
  detailed: false,
  size: 'medium',
}

export default MemberCard

import React from 'react'
import Prop from 'prop-types'
import pure from 'recompose/pure'
import { lensPath, set } from 'ramda'
import { StyledDropZone as DropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { countries, getEmojiFlag } from 'countries-list'

import resizeImage from '../../helpers/resize-image'
import {formatISO} from '../../helpers/time'

import Button from '../../components/Button'
import Switch from '../../components/Switch'
import Icon from '../../components/Icon'
import Input from '../../components/Input'
import Label from '../../components/Label'
import Modal from '../../components/Modal'
import Title from '../../components/Title'

import CountryDropdown from './CountryDropdown'


const MODE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
}

const EMPTY_MEMBER = {
  isLoading: false,
  data: {
    firstName: '',
    lastName: '',
    country: '',
    photo: '',
    isPermanent: false,
    startDate: null,
    endDate: null,
  }
}


class MemberEditor extends React.Component {
  static MODE = MODE

  static propTypes = {
    open: Prop.bool.isRequired,
    mode: Prop.string,
    member: Prop.object,
    onDelete: Prop.func.isRequired,
    onDone: Prop.func.isRequired,
    onCancel: Prop.func.isRequired,
  }

  constructor(props) {
    super(props)

    const member = this.getMember(props)

    this.state = {
      errorMessage: undefined,
      fieldName: '',
      fieldAmount: '',
      member: member,
      start: member ? formatISO(member.data.startDate) : null,
      end:   member ? formatISO(member.data.endDate) : null,
    }
  }

  componentWillReceiveProps(props, state) {
    if (props.mode !== this.props.mode && props.mode === MODE.CREATE)
      this.setState({
        member: EMPTY_MEMBER,
        start: '',
        end: '',
      })

    if (props.member && props.member !== this.props.member)
      this.setState({
        member: props.member,
        start: formatISO(props.member.data.startDate),
        end: formatISO(props.member.data.endDate),
      })
  }

  getMember(props = this.props) {
    const member = props.open ? this.props.member : EMPTY_MEMBER
    return member
  }

  validate() {
    const start = new Date(this.state.startDate)
    const end = new Date(this.state.endDate)

    if (+start === +end) {
      this.setState({ errorMessage: 'Start date must be different than end date'})
      return false
    }

    if (start > end) {
      this.setState({ errorMessage: 'Start date must be before end date'})
      return false
    }

    this.setState({ errorMessage: undefined })

    return true
  }

  onChange = (key) => (value) => {
      this.setState({ member: set(lensPath(['data', key]), value, this.state.member) })
    }

  onChangeStart = start => {
    this.setState({ start })
  }

  onBlurStart = () => {
    const date = new Date(this.state.start)
    if (Number.isNaN(date.getTime()))
      return
    this.setState({ member: set(lensPath(['data', 'startDate']), date.toISOString(), this.state.member) })
  }

  onChangeEnd = end => {
    this.setState({ end })
  }

  onBlurEnd = () => {
    const date = new Date(this.state.end)
    if (Number.isNaN(date.getTime()))
      return
    this.setState({ member: set(lensPath(['data', 'endDate']), date.toISOString(), this.state.member) })
  }

  onDropFile = file => {
    resizeImage(file, 100)
    .then(dataUrl => {
      this.setState({ member: set(lensPath(['data', 'photo']), dataUrl, this.state.member) })
    })
  }

  onDone = () => {
    if (!this.validate())
      return

    this.props.onDone(this.state.member)
  }

  onCancel = () => {
    this.props.onCancel()
  }

  render() {
    const {open, mode} = this.props
    const {errorMessage, fieldName, fieldAmount} = this.state
    const member = this.state.member ? this.state.member : EMPTY_MEMBER

    const category = undefined

    return (
      <Modal
        className='MemberEditor'
        showHeader={false}
        open={open}
        onClose={this.onCancel}
      >
        <div className='MemberEditor__inner vbox'>
          <table className='MemberEditor__table'>
          <tbody>
            <tr>
              <td colSpan='2'>
                <DropZone
                  dontRead
                  accept='image/*'
                  className='MemberEditor__photo'
                  onDrop={this.onDropFile}
                >
                  {member.data.photo ?
                    <img
                      className='MemberEditor__photo__img'
                      width='auto'
                      height='auto'
                      style={{ maxWidth: 100, maxHeight: 100 }}
                      src={member.data.photo}
                    /> :
                    <Icon
                      name='user-circle'
                      size='5x'
                      style={{ height: 'auto', width: '100%', opacity: 0.6 }}
                    />
                  }
                </DropZone>
              </td>
            </tr>
            <tr>
              <td><Label>First Name</Label></td>
              <td>
                <Input
                  className='full-width'
                  value={member.data.firstName}
                  onChange={this.onChange('firstName')}
                />
              </td>
            </tr>
            <tr>
              <td><Label>Last Name</Label></td>
              <td>
                <Input
                  className='full-width'
                  value={member.data.lastName}
                  onChange={this.onChange('lastName')}
                />
              </td>
            </tr>
            <tr>
              <td><Label>Country</Label></td>
              <td>
                <CountryDropdown
                  className='full-width input-like'
                  value={member.data.country}
                  onChange={this.onChange('country')}
                />
              </td>
            </tr>
            <tr>
              <td><Label>Permanent</Label></td>
              <td>
                <Switch
                  label={['yes', 'no']}
                  value={Boolean(member.data.isPermanent)}
                  onChange={this.onChange('isPermanent')}
                />
              </td>
            </tr>
            <tr>
              <td><Label>Start</Label></td>
              <td>
                <Input
                  className='full-width'
                  type='date'
                  value={member.data.startDate}
                  onChange={this.onChange('startDate')}
                />
              </td>
            </tr>
            <tr>
              <td><Label>End</Label></td>
              <td>
                <Input
                  className='full-width'
                  type='date'
                  value={member.data.endDate}
                  onChange={this.onChange('endDate')}
                />
              </td>
            </tr>
          </tbody>
          </table>

          <div className='fill' />

          {
            errorMessage &&
              <div className='row alert error'>
                {errorMessage}
              </div>
          }

          <br/>

          <div className='row no-padding'>
            <Button
              variant='default'
              onClick={this.onCancel}
              disabled={member.isLoading}
            >
              Cancel
            </Button>
            <div className='fill' />
            {mode === MODE.UPDATE && window.ALLOW_DELETION &&
              <Button
                variant='error'
                onClick={() => this.props.onDelete(member)}
                loading={member.isLoading}
              >
                Delete
              </Button>
            }
            <Button
              className='default'
              variant='info'
              onClick={this.onDone}
              loading={member.isLoading}
            >
              {mode === MODE.UPDATE ? 'Update' : 'Create'}
            </Button>
          </div>

        </div>
      </Modal>
    )
  }
}


const klass = pure(MemberEditor)
klass.MODE = MODE

export default klass


// Helpers

function isCountry(c) {
  return typeof c === 'string' && c.length >= 2
}

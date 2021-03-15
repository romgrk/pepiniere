import React from 'react'
import Prop from 'prop-types'
import pure from 'recompose/pure'
import cx from 'clsx'

import Icon from './Icon'
import Spinner from './Spinner'

function Form(props) {
  const { className, children, preventDefault, onSubmit: onSubmitProp, ...rest } = props

  const formClassName = cx(
    'Form',
    className,
  )

  const onSubmit = ev => {
    if (preventDefault)
      ev.preventDefault()
    if (onSubmitProp)
      onSubmitProp(ev)
  }

  return (
    <form className={formClassName} {...rest} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

Form.propTypes = {
  onSubmit: Prop.func,
  preventDefault: Prop.bol,
}

Form.defaultProps = {
  preventDefault: true,
}

function Field({ children, className, ...rest }) {
  const fieldClassName = cx('Form__field', className)

  return (
    <div className={fieldClassName} {...rest}>
      {children}
    </div>
  )
}

const klass = pure(Form)
klass.Field = Field

export default klass

import React from 'react'
import Prop from 'prop-types'
import pure from 'recompose/pure'
import cx from 'classname'

import Icon from './Icon'
import Spinner from './Spinner'

function Form(props) {
  const { className, children, ...rest } = props

  const formClassName = cx(
    'Form',
    className,
  )

  return (
    <form className={formClassName} action="javascript:void(0)" {...rest}>
      {children}
    </form>
  )
}

Form.propTypes = {
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

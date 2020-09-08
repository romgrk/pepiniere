import React from 'react'
import Prop from 'prop-types'
import pure from 'recompose/pure'
import { countries as countriesByCode } from 'countries-list'

import getCountryFlag from '../../helpers/get-country-flag'

import Dropdown from '../../components/FilteringDropdown'

const countries = Object.values(countriesByCode)


function CountryDropdown({ value, ...rest }) {
  return (
    <Dropdown
      {...rest}
      value={value}
      label={
        <span className={!value ? 'text-muted' : ''}>
          {value ? <>{getCountryFlag(value)} {value}</> : 'No country selected'}
        </span>
      }
      items={countries.map(c => c.name)}
    />
  )
}

export default CountryDropdown

/*
 * get-country-flag.js
 */

import { indexBy } from 'rambda'
import { countries as countriesByCode } from 'countries-list'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

const codes = Object.keys(countriesByCode)

export default function getCountryFlag(country) {
  if (!country)
    return undefined

  const code = codes.find(code => {
    const c = countriesByCode[code]
    if (c.name.toLowerCase() === country.toLowerCase())
      return true
    return false
  })

  if (code)
    return countriesByCode[code].emoji

  return getUnicodeFlagIcon(country)
}

/*
 * platform-detect.js
 */

import bowser from 'bowser'

window.isMobile = false

let platform
let lastUA

getPlatform()

export default function getPlatform() {
  if (navigator.userAgent === lastUA) {
    return platform
  }
  lastUA = navigator.userAgent

  const data = bowser.parse(navigator.userAgent)

  // Windows, macOS, Linux, android, (iOS?)
  const os   = data.os.name.toLowerCase()
  // mobile, desktop, tablet
  const type = data.platform.type.toLowerCase()

  platform = {
    os,
    type,
    isTouch: type === 'mobile' || type === 'tablet',
  }

  document.body.classList.forEach(c => {
    if (c.startsWith('platform-'))
      document.body.classList.remove(c)
  })

  document.body.classList.add(`platform-${platform.os}`)
  document.body.classList.add(`platform-${platform.type}`)
  if (platform.isTouch)
    document.body.classList.add(`platform-isTouch`)

  return platform
}


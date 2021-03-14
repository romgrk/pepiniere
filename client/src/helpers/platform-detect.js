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

  const isDeviceTouch = type === 'mobile' || type === 'tablet'

  const supportsPointer =
    window.matchMedia('(pointerx: fine)').matches ||
    window.matchMedia('(pointerx: coarse)').matches
  const isPointerCoarse = window.matchMedia('(pointerx: coarse)')

  platform = {
    os,
    type,
    isTouch: supportsPointer ? isPointerCoarse : isDeviceTouch,
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


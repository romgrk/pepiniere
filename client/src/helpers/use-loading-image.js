/*
 * use-loading-image.js
 */

import { useState, useEffect } from 'react'

const loadedImages = {}

function loadImage(source) {
  if (loadedImages[source])
    return loadedImages[source]

  const loader = new Promise((resolve, reject) => {
    // timeout to allow data more time to load
    setTimeout(() => {
      const imgLoader = new Image()
      imgLoader.onload = function(){
        resolve(this.src)
        loader.done = true
      }
      imgLoader.src = source
    }, 250)
  })
  loadedImages[source] = loader
  return loader
}

export default function useLoadingImage(source) {
  const [isLoading, setIsLoading] = useState(
    source in loadedImages ?
      loadedImages[source].done !== true :
      true
  )

  useEffect(() => {
    if (!source)
      return
    loadImage(source).then(() => {
      setIsLoading(false)
    })
  }, [source])

  return isLoading ? null : source
}


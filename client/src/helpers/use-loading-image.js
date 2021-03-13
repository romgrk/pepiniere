/*
 * use-loading-image.js
 */

import { useState, useEffect } from 'react'

const loadedImages = {}

function loadImage(source) {
  if (loadedImages[source])
    return loadedImages[source]

  const loader = new Promise((resolve, reject) => {
    const imgLoader = new Image()
    imgLoader.onload = function(){
      loader.done = true
      resolve(this.src)
    }
    imgLoader.src = source
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


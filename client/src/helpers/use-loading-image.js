/*
 * use-loading-image.js
 */

import { useState, useEffect } from 'react'

const loadedImages = {}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    // timeout to allow data more time to load
    setTimeout(() => {
      const imgLoader = new Image()
      imgLoader.onload = function(){
        resolve(this.src)
      }
      imgLoader.src = source
    }, 250)
  })
}

export default function useLoadingImage(source) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!source)
      return
    const loader = loadedImages[source] || loadImage(source)
    loader.then(() => {
      setIsLoading(false)
    })
    loadedImages[source] = loader
  }, [source])

  return isLoading ? null : source
}


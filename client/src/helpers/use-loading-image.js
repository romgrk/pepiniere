/*
 * use-loading-image.js
 */

import { useState, useEffect } from 'react'


export const LoadingState = {
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3,
}

const loadedImages = {}

function loadImage(source) {
  if (loadedImages[source])
    return loadedImages[source]

  const loader = new Promise((resolve, reject) => {
    const imgLoader = new Image()
    imgLoader.onload = function(){
      loader.state = LoadingState.SUCCESS
      resolve(loader.state)
    }
    imgLoader.onerror = function(err){
      loader.state = LoadingState.ERROR
      resolve(loader.state)
    }
    imgLoader.src = source
  })
  loader.state = LoadingState.LOADING

  loadedImages[source] = loader

  return loader
}

export default function useLoadingImage(source) {
  const [state, setState] = useState(
    source in loadedImages ?
      loadedImages[source].state :
      LoadingState.LOADING
  )

  useEffect(() => {
    if (!source)
      return
    loadImage(source).then(state => {
      setState(state)
    })
  }, [source])

  return state
}


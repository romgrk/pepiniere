/*
 * resize-image.js
 */

export default function resizeImage(file, maxSize){
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      return reject(new Error('Not an image'))
    }

    // Load the image
    const reader = new FileReader()
    reader.onload = function (readerEvent) {

      const image = new Image()
      image.onload = function (imageEvent) {

        // Resize the image
        const canvas = document.createElement('canvas')

        let x = 0
        let y = 0
        let width  = image.width
        let height = image.height

        if (width > height) {
          if (width > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
          const diff = width - height
          x = -diff / 2
        } else {
          if (height > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
          const diff = height - width
          y = -diff / 2
        }
        canvas.width  = maxSize
        canvas.height = maxSize
        canvas.getContext('2d').drawImage(image, x, y, width, height)

        const dataUrl = canvas.toDataURL('image/png')

        resolve(dataUrl)
      }
      image.src = readerEvent.target.result;
    }
    reader.readAsDataURL(file);
  })
};

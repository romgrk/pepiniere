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

        let width  = image.width
        let height = image.height

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/png')

        resolve(dataUrl)
      }
      image.src = readerEvent.target.result;
    }
    reader.readAsDataURL(file);
  })
};

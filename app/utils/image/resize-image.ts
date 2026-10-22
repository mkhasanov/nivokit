import type { AcceptedImageType } from '../image-validation'

interface ResizeOptions {
  file: File
  width: number
  height: number
  format: AcceptedImageType
  quality: number
}

interface DecodedImage {
  source: CanvasImageSource
  width: number
  height: number
  cleanup: () => void
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file)
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close(),
    }
  }

  const objectUrl = URL.createObjectURL(file)
  const image = new Image()
  image.decoding = 'async'
  image.src = objectUrl
  try {
    await image.decode()
  } catch {
    URL.revokeObjectURL(objectUrl)
    throw new Error('The browser could not decode this image. The file may be damaged or unsupported.')
  }
  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    cleanup: () => URL.revokeObjectURL(objectUrl),
  }
}

export async function readImageDimensions(file: File): Promise<{ width: number, height: number }> {
  const decoded = await decodeImage(file)
  const dimensions = { width: decoded.width, height: decoded.height }
  decoded.cleanup()
  return dimensions
}

export async function resizeImage(options: ResizeOptions): Promise<Blob> {
  const decoded = await decodeImage(options.file)
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const context = canvas.getContext('2d', { alpha: options.format !== 'image/jpeg' })

  if (!context) {
    decoded.cleanup()
    throw new Error('Canvas processing is not available in this browser.')
  }

  if (options.format === 'image/jpeg') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(decoded.source, 0, 0, options.width, options.height)
  decoded.cleanup()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('The browser could not export this image. Try another format.')),
      options.format,
      options.format === 'image/png' ? undefined : options.quality,
    )
  })
}

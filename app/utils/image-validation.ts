export const MAX_IMAGE_BYTES = 20 * 1024 * 1024
export const MAX_DIMENSION = 12_000
export const MAX_PIXELS = 40_000_000
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number]

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as AcceptedImageType)) {
    return 'Choose a JPG, PNG, or WebP image.'
  }
  if (file.size === 0) return 'This file is empty. Choose a valid image.'
  if (file.size > MAX_IMAGE_BYTES) return 'This image is larger than 20 MB. Choose a smaller file.'
  return null
}

export function validateDimensions(width: number, height: number): string | null {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    return 'Width and height must be positive whole numbers.'
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return `Width and height must be ${MAX_DIMENSION.toLocaleString()} pixels or less.`
  }
  if (width * height > MAX_PIXELS) {
    return 'The requested image is too large to process safely. Use fewer than 40 million pixels.'
  }
  return null
}

export function calculateLinkedDimension(value: number, ratio: number, changed: 'width' | 'height'): number {
  if (!Number.isFinite(value) || !Number.isFinite(ratio) || ratio <= 0) return 1
  return Math.max(1, Math.round(changed === 'width' ? value / ratio : value * ratio))
}

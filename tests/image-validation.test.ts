import { describe, expect, it } from 'vitest'
import { calculateLinkedDimension, MAX_IMAGE_BYTES, validateDimensions, validateImageFile } from '../app/utils/image-validation'

describe('image validation', () => {
  it('accepts a supported non-empty image', () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'photo.webp', { type: 'image/webp' })
    expect(validateImageFile(file)).toBeNull()
  })

  it('rejects unsupported and oversized files', () => {
    const textFile = new File(['hello'], 'notes.txt', { type: 'text/plain' })
    const largeFile = { type: 'image/png', size: MAX_IMAGE_BYTES + 1 } as File
    expect(validateImageFile(textFile)).toMatch(/JPG, PNG, or WebP/)
    expect(validateImageFile(largeFile)).toMatch(/larger than 20 MB/)
  })

  it('guards browser memory with dimension and pixel limits', () => {
    expect(validateDimensions(1600, 900)).toBeNull()
    expect(validateDimensions(0, 900)).toMatch(/positive whole numbers/)
    expect(validateDimensions(12_001, 100)).toMatch(/12,000 pixels/)
    expect(validateDimensions(10_000, 5_000)).toMatch(/40 million pixels/)
  })

  it('preserves the original aspect ratio', () => {
    expect(calculateLinkedDimension(960, 16 / 9, 'width')).toBe(540)
    expect(calculateLinkedDimension(540, 16 / 9, 'height')).toBe(960)
  })
})

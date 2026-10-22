<script setup lang="ts">
import { ACCEPTED_IMAGE_TYPES, calculateLinkedDimension, validateDimensions, validateImageFile, type AcceptedImageType } from '~/utils/image-validation'

type ProcessingState = 'idle' | 'reading' | 'ready' | 'processing' | 'complete'

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const outputUrl = ref('')
const outputBlob = ref<Blob | null>(null)
const outputName = ref('resized-image.jpg')
const originalWidth = ref(0)
const originalHeight = ref(0)
const width = ref(0)
const height = ref(0)
const lockAspectRatio = ref(true)
const outputFormat = ref<AcceptedImageType>('image/jpeg')
const quality = ref(0.86)
const state = ref<ProcessingState>('idle')
const errorMessage = ref('')
const isDragging = ref(false)

const aspectRatio = computed(() => originalHeight.value ? originalWidth.value / originalHeight.value : 1)
const acceptedFormats = ACCEPTED_IMAGE_TYPES.join(',')
const outputSize = computed(() => outputBlob.value ? formatBytes(outputBlob.value.size) : '')
const inputSize = computed(() => selectedFile.value ? formatBytes(selectedFile.value.size) : '')
const canProcess = computed(() => selectedFile.value && state.value !== 'processing' && !validateDimensions(width.value, height.value))

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function revokeUrl(url: string) {
  if (url) URL.revokeObjectURL(url)
}

function clearOutput() {
  revokeUrl(outputUrl.value)
  outputUrl.value = ''
  outputBlob.value = null
  if (selectedFile.value) state.value = 'ready'
}

async function chooseFile(file?: File) {
  if (!file) return
  errorMessage.value = ''
  const validationError = validateImageFile(file)
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  state.value = 'reading'
  clearOutput()
  revokeUrl(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)

  try {
    const { readImageDimensions } = await import('~/utils/image/resize-image')
    const dimensions = await readImageDimensions(file)
    selectedFile.value = file
    originalWidth.value = dimensions.width
    originalHeight.value = dimensions.height
    width.value = dimensions.width
    height.value = dimensions.height
    outputFormat.value = file.type === 'image/png' || file.type === 'image/webp' ? file.type : 'image/jpeg'
    state.value = 'ready'
  } catch (error) {
    selectedFile.value = null
    state.value = 'idle'
    errorMessage.value = error instanceof Error ? error.message : 'The image could not be read.'
    revokeUrl(previewUrl.value)
    previewUrl.value = ''
  }
}

function handleFileInput(event: Event) {
  chooseFile((event.target as HTMLInputElement).files?.[0])
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  chooseFile(event.dataTransfer?.files?.[0])
}

function updateWidth() {
  width.value = Math.round(Number(width.value))
  if (lockAspectRatio.value) height.value = calculateLinkedDimension(width.value, aspectRatio.value, 'width')
  clearOutput()
}

function updateHeight() {
  height.value = Math.round(Number(height.value))
  if (lockAspectRatio.value) width.value = calculateLinkedDimension(height.value, aspectRatio.value, 'height')
  clearOutput()
}

function formatExtension(format: AcceptedImageType): string {
  return format === 'image/jpeg' ? 'jpg' : format.split('/')[1]!
}

async function processImage() {
  if (!selectedFile.value) return
  errorMessage.value = ''
  const dimensionsError = validateDimensions(width.value, height.value)
  if (dimensionsError) {
    errorMessage.value = dimensionsError
    return
  }

  state.value = 'processing'
  clearOutput()
  state.value = 'processing'
  try {
    const { resizeImage } = await import('~/utils/image/resize-image')
    const blob = await resizeImage({
      file: selectedFile.value,
      width: width.value,
      height: height.value,
      format: outputFormat.value,
      quality: quality.value,
    })
    outputBlob.value = blob
    outputUrl.value = URL.createObjectURL(blob)
    const baseName = selectedFile.value.name.replace(/\.[^.]+$/, '') || 'image'
    outputName.value = `${baseName}-${width.value}x${height.value}.${formatExtension(outputFormat.value)}`
    state.value = 'complete'
  } catch (error) {
    state.value = 'ready'
    errorMessage.value = error instanceof Error ? error.message : 'The image could not be resized.'
  }
}

watch([outputFormat, quality], clearOutput)

onBeforeUnmount(() => {
  revokeUrl(previewUrl.value)
  revokeUrl(outputUrl.value)
})
</script>

<template>
  <section class="surface-card overflow-hidden" aria-labelledby="resizer-heading">
    <div class="border-b border-line px-5 py-4 sm:px-7">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="resizer-heading" class="text-lg font-bold">Image resizer</h2>
          <p class="mt-1 text-sm text-muted">Files stay in this browser tab.</p>
        </div>
        <span class="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
          Local processing
        </span>
      </div>
    </div>

    <div class="p-5 sm:p-7">
      <input ref="fileInput" class="sr-only" type="file" aria-label="Choose image file" :accept="acceptedFormats" @change="handleFileInput">
      <button
        v-if="!selectedFile"
        type="button"
        :class="['focus-ring flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition', isDragging ? 'border-brand bg-brand-soft' : 'border-line bg-canvas-soft/50 hover:border-brand hover:bg-brand-soft/45']"
        @click="fileInput?.click()"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <span class="grid size-14 place-items-center rounded-2xl bg-panel text-brand shadow-sm" aria-hidden="true">
          <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" /></svg>
        </span>
        <span class="mt-5 text-lg font-bold">Drop an image here</span>
        <span class="mt-2 text-sm text-muted">or choose a JPG, PNG, or WebP up to 20 MB</span>
        <span class="secondary-button mt-5" aria-hidden="true">Choose image</span>
      </button>

      <div v-else class="grid gap-7 lg:grid-cols-[0.86fr_1.14fr]">
        <div class="min-w-0">
          <div class="grid min-h-64 place-items-center overflow-hidden rounded-2xl border border-line bg-[linear-gradient(45deg,var(--canvas-soft)_25%,transparent_25%),linear-gradient(-45deg,var(--canvas-soft)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--canvas-soft)_75%),linear-gradient(-45deg,transparent_75%,var(--canvas-soft)_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px] p-4">
            <img :src="outputUrl || previewUrl" :alt="outputUrl ? 'Resized image preview' : 'Selected image preview'" class="max-h-80 max-w-full rounded-lg object-contain shadow-sm">
          </div>
          <div class="mt-3 flex min-w-0 items-center justify-between gap-3 text-xs text-muted">
            <span class="truncate">{{ selectedFile.name }}</span>
            <span class="shrink-0">{{ originalWidth }} × {{ originalHeight }} · {{ inputSize }}</span>
          </div>
          <button type="button" class="focus-ring mt-3 rounded-lg text-sm font-semibold text-brand hover:underline" @click="fileInput?.click()">Choose another image</button>
        </div>

        <form class="space-y-5" @submit.prevent="processImage">
          <fieldset>
            <legend class="field-label">Dimensions</legend>
            <div class="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <label><span class="mb-2 block text-xs font-medium text-muted">Width (px)</span><input v-model.number="width" class="text-field" type="number" inputmode="numeric" min="1" max="12000" required @change="updateWidth"></label>
              <button type="button" :class="['focus-ring mb-0.5 grid size-10 place-items-center rounded-xl border transition', lockAspectRatio ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted']" :aria-pressed="lockAspectRatio" :aria-label="lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'" @click="lockAspectRatio = !lockAspectRatio">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </button>
              <label><span class="mb-2 block text-xs font-medium text-muted">Height (px)</span><input v-model.number="height" class="text-field" type="number" inputmode="numeric" min="1" max="12000" required @change="updateHeight"></label>
            </div>
          </fieldset>

          <div class="grid gap-4 sm:grid-cols-2">
            <label><span class="field-label">Output format</span><select v-model="outputFormat" class="text-field"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
            <label v-if="outputFormat !== 'image/png'"><span class="field-label">Quality · {{ Math.round(quality * 100) }}%</span><input v-model.number="quality" class="h-11 w-full accent-brand" type="range" min="0.4" max="1" step="0.01"></label>
            <div v-else><span class="field-label">Quality</span><p class="flex h-11 items-center text-sm text-muted">PNG uses lossless export.</p></div>
          </div>

          <p v-if="errorMessage" class="rounded-xl border border-danger/30 bg-danger/8 px-4 py-3 text-sm text-danger" role="alert">{{ errorMessage }}</p>

          <button type="submit" class="primary-button w-full" :disabled="!canProcess">
            <svg v-if="state === 'processing'" class="mr-2 size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle class="opacity-30" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
            {{ state === 'processing' ? 'Resizing image…' : 'Resize image' }}
          </button>

          <div v-if="state === 'complete' && outputUrl" class="rounded-2xl border border-brand/30 bg-brand-soft p-4" role="status" aria-live="polite">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div><p class="font-bold text-ink">Your image is ready</p><p class="mt-1 text-sm text-muted">{{ width }} × {{ height }} · {{ outputSize }}</p></div>
              <a :href="outputUrl" :download="outputName" class="primary-button">Download</a>
            </div>
          </div>
          <p class="sr-only" aria-live="polite">{{ state === 'reading' ? 'Reading image.' : state === 'processing' ? 'Resizing image.' : state === 'complete' ? 'Resized image ready to download.' : '' }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

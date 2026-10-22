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
const dimensionsTouched = ref(false)

const aspectRatio = computed(() => originalHeight.value ? originalWidth.value / originalHeight.value : 1)
const acceptedFormats = ACCEPTED_IMAGE_TYPES.join(',')
const outputSize = computed(() => outputBlob.value ? formatBytes(outputBlob.value.size) : '')
const inputSize = computed(() => selectedFile.value ? formatBytes(selectedFile.value.size) : '')
const dimensionError = computed(() => selectedFile.value ? validateDimensions(width.value, height.value) : null)
const canProcess = computed(() => Boolean(selectedFile.value) && !['reading', 'processing'].includes(state.value) && !dimensionError.value)
const liveMessage = computed(() => {
  if (state.value === 'reading') return 'Reading image and checking its dimensions.'
  if (state.value === 'processing') return 'Resizing image in your browser.'
  if (state.value === 'complete') return `Resized image ready to download. ${width.value} by ${height.value} pixels, ${outputSize.value}.`
  return ''
})

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

function resetTool() {
  clearOutput()
  revokeUrl(previewUrl.value)
  selectedFile.value = null
  previewUrl.value = ''
  originalWidth.value = 0
  originalHeight.value = 0
  width.value = 0
  height.value = 0
  errorMessage.value = ''
  dimensionsTouched.value = false
  state.value = 'idle'
  if (fileInput.value) fileInput.value.value = ''
}

async function chooseFile(file?: File) {
  if (!file) return
  errorMessage.value = ''
  const validationError = validateImageFile(file)
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  clearOutput()
  state.value = 'reading'
  const nextPreviewUrl = URL.createObjectURL(file)

  try {
    const { readImageDimensions } = await import('~/utils/image/resize-image')
    const dimensions = await readImageDimensions(file)
    revokeUrl(previewUrl.value)
    previewUrl.value = nextPreviewUrl
    selectedFile.value = file
    originalWidth.value = dimensions.width
    originalHeight.value = dimensions.height
    width.value = dimensions.width
    height.value = dimensions.height
    outputFormat.value = file.type === 'image/png' || file.type === 'image/webp' ? file.type : 'image/jpeg'
    dimensionsTouched.value = false
    state.value = 'ready'
  } catch (error) {
    revokeUrl(nextPreviewUrl)
    state.value = selectedFile.value ? 'ready' : 'idle'
    errorMessage.value = error instanceof Error ? error.message : 'The image could not be read. Try a different JPG, PNG, or WebP file.'
  }
}

async function handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  await chooseFile(file)
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  chooseFile(event.dataTransfer?.files?.[0])
}

function updateWidth() {
  width.value = Math.round(Number(width.value))
  if (lockAspectRatio.value && width.value > 0) height.value = calculateLinkedDimension(width.value, aspectRatio.value, 'width')
  dimensionsTouched.value = true
  clearOutput()
}

function updateHeight() {
  height.value = Math.round(Number(height.value))
  if (lockAspectRatio.value && height.value > 0) width.value = calculateLinkedDimension(height.value, aspectRatio.value, 'height')
  dimensionsTouched.value = true
  clearOutput()
}

function formatExtension(format: AcceptedImageType): string {
  return format === 'image/jpeg' ? 'jpg' : format.split('/')[1]!
}

async function processImage() {
  if (!selectedFile.value) return
  errorMessage.value = ''
  dimensionsTouched.value = true
  if (dimensionError.value) {
    errorMessage.value = dimensionError.value
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
    errorMessage.value = error instanceof Error ? error.message : 'The image could not be resized. Try smaller dimensions or a different file.'
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
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-strong px-5 py-4 sm:px-7 sm:py-5">
      <div>
        <h2 id="resizer-heading" class="text-lg font-bold tracking-tight">Resize workspace</h2>
        <p class="mt-1 text-sm text-muted">Choose an image, set its size, then download the result.</p>
      </div>
      <span class="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand">
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
        Processed locally
      </span>
    </div>

    <div class="p-4 sm:p-7">
      <input ref="fileInput" class="sr-only" type="file" aria-label="Choose image file" :accept="acceptedFormats" @change="handleFileInput">
      <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>

      <div v-if="errorMessage" class="mb-4 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/8 px-4 py-3 text-sm text-danger" role="alert">
        <svg class="mt-0.5 size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></svg>
        <span>{{ errorMessage }}</span>
      </div>

      <button
        v-if="!selectedFile"
        type="button"
        :disabled="state === 'reading'"
        :class="['focus-ring flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition sm:min-h-72 sm:p-8', isDragging ? 'border-brand bg-brand-soft' : 'border-line bg-canvas-soft/55 hover:border-brand hover:bg-brand-soft/45']"
        aria-describedby="upload-constraints"
        @click="fileInput?.click()"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <span class="grid size-14 place-items-center rounded-2xl border border-line bg-panel text-brand shadow-sm" aria-hidden="true">
          <svg v-if="state === 'reading'" class="size-6 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-30" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
          <svg v-else class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" /></svg>
        </span>
        <span class="mt-5 text-lg font-bold">{{ state === 'reading' ? 'Reading your image…' : 'Drop an image here' }}</span>
        <span id="upload-constraints" class="mt-2 max-w-sm text-sm leading-6 text-muted">JPG, PNG, or WebP up to 20 MB. Your file is not uploaded.</span>
        <span v-if="state !== 'reading'" class="primary-button mt-5" aria-hidden="true">Choose image</span>
      </button>

      <div v-else class="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-9">
        <div class="min-w-0">
          <div class="grid min-h-64 place-items-center overflow-hidden rounded-2xl border border-line bg-[linear-gradient(45deg,var(--canvas-soft)_25%,transparent_25%),linear-gradient(-45deg,var(--canvas-soft)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--canvas-soft)_75%),linear-gradient(-45deg,transparent_75%,var(--canvas-soft)_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px] p-4 sm:min-h-80">
            <img :src="outputUrl || previewUrl" :alt="outputUrl ? 'Resized image preview' : 'Selected image preview'" class="max-h-80 max-w-full rounded-lg object-contain shadow-sm">
          </div>
          <div class="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted">
            <span class="max-w-full truncate font-medium text-muted-strong">{{ selectedFile.name }}</span>
            <span class="shrink-0">Original: {{ originalWidth }} × {{ originalHeight }} · {{ inputSize }}</span>
          </div>
          <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <button type="button" class="focus-ring min-h-11 rounded-lg px-1 text-sm font-semibold text-brand hover:underline" @click="fileInput?.click()">Replace image</button>
            <button type="button" class="focus-ring min-h-11 rounded-lg px-1 text-sm font-semibold text-muted hover:text-danger" @click="resetTool">Remove</button>
          </div>
        </div>

        <form class="space-y-5" @submit.prevent="processImage">
          <fieldset>
            <legend class="field-label">Output dimensions</legend>
            <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2.5 sm:gap-3">
              <label><span class="mb-2 block text-xs font-semibold text-muted">Width (px)</span><input v-model.number="width" class="text-field" type="number" inputmode="numeric" min="1" max="12000" required :aria-invalid="Boolean(dimensionsTouched && dimensionError)" aria-describedby="dimensions-help" @change="updateWidth"></label>
              <button type="button" :class="['focus-ring mb-0.5 grid size-10 place-items-center rounded-xl border transition', lockAspectRatio ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:border-muted hover:text-ink']" :aria-pressed="lockAspectRatio" :aria-label="lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'" @click="lockAspectRatio = !lockAspectRatio">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </button>
              <label><span class="mb-2 block text-xs font-semibold text-muted">Height (px)</span><input v-model.number="height" class="text-field" type="number" inputmode="numeric" min="1" max="12000" required :aria-invalid="Boolean(dimensionsTouched && dimensionError)" aria-describedby="dimensions-help" @change="updateHeight"></label>
            </div>
            <p id="dimensions-help" :class="['mt-2 text-xs leading-5', dimensionsTouched && dimensionError ? 'text-danger' : 'text-muted']">{{ dimensionsTouched && dimensionError ? dimensionError : lockAspectRatio ? 'Aspect ratio is locked. Changing one value updates the other.' : 'Aspect ratio is unlocked. Width and height can change independently.' }}</p>
          </fieldset>

          <fieldset>
            <legend class="field-label">Export settings</legend>
            <div class="grid gap-4 sm:grid-cols-2">
              <label><span class="mb-2 block text-xs font-semibold text-muted">Format</span><select v-model="outputFormat" class="text-field"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
              <label v-if="outputFormat !== 'image/png'"><span class="mb-2 block text-xs font-semibold text-muted">Quality · {{ Math.round(quality * 100) }}%</span><input v-model.number="quality" class="h-11 w-full accent-brand" type="range" min="0.4" max="1" step="0.01"></label>
              <div v-else><span class="mb-2 block text-xs font-semibold text-muted">Quality</span><p class="flex h-11 items-center text-sm text-muted">PNG uses lossless export.</p></div>
            </div>
          </fieldset>

          <button type="submit" class="primary-button w-full" :disabled="!canProcess">
            <svg v-if="state === 'processing'" class="mr-2 size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle class="opacity-30" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
            {{ state === 'processing' ? 'Resizing image…' : 'Resize image' }}
          </button>

          <div v-if="state === 'complete' && outputUrl" class="rounded-2xl border border-brand/35 bg-brand-soft p-4 sm:p-5" role="status" aria-live="polite">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="inline-flex items-center gap-2 font-bold text-ink"><svg class="size-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>Your image is ready</p>
                <p class="mt-1 text-sm text-muted">{{ width }} × {{ height }} · {{ outputSize }} · {{ outputName }}</p>
              </div>
              <a :href="outputUrl" :download="outputName" class="primary-button shrink-0 gap-2"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 4v11m-4-4 4 4 4-4" /><path d="M5 19h14" /></svg>Download</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

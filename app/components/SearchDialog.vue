<script setup lang="ts">
const { isSearchOpen, openSearch, closeSearch } = useCommandSearch()
const dialog = ref<HTMLDialogElement | null>(null)

watch(isSearchOpen, async (isOpen) => {
  await nextTick()
  if (isOpen && dialog.value && !dialog.value.open) dialog.value.showModal()
  if (!isOpen && dialog.value?.open) dialog.value.close()
})

function handleShortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
}

onMounted(() => window.addEventListener('keydown', handleShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', handleShortcut))
</script>

<template>
  <ClientOnly>
    <dialog ref="dialog" class="m-auto w-[min(42rem,calc(100%-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/55 backdrop:backdrop-blur-sm" aria-labelledby="search-dialog-title" @cancel.prevent="closeSearch" @close="closeSearch">
      <div class="surface-card p-4 sm:p-6">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <p class="eyebrow">Quick find</p>
            <h2 id="search-dialog-title" class="mt-1 text-xl font-bold tracking-tight">What do you need to do?</h2>
          </div>
          <button type="button" class="focus-ring grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas-soft hover:text-ink" aria-label="Close search" @click="closeSearch">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <ToolSearch autofocus @selected="closeSearch" />
        <p class="mt-4 text-xs text-muted">Use ↑ and ↓ to choose, Enter to open, and Esc to close.</p>
      </div>
    </dialog>
  </ClientOnly>
</template>

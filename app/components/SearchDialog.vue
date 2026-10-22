<script setup lang="ts">
const { isSearchOpen, openSearch, closeSearch } = useCommandSearch()
const dialog = ref<HTMLDialogElement | null>(null)
const searchSession = ref(0)

watch(isSearchOpen, async (isOpen) => {
  await nextTick()
  if (isOpen && dialog.value && !dialog.value.open) {
    dialog.value.showModal()
    searchSession.value += 1
  }
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
    <dialog ref="dialog" class="m-auto w-[min(42rem,calc(100%-1.5rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm" aria-labelledby="search-dialog-title" aria-describedby="search-dialog-description" @cancel.prevent="closeSearch" @close="closeSearch">
      <div class="surface-card max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-4 sm:p-6">
        <div class="mb-4 flex items-start justify-between gap-4 sm:mb-5">
          <div>
            <p class="eyebrow">Tool search</p>
            <h2 id="search-dialog-title" class="mt-1 text-xl font-bold tracking-tight sm:text-2xl">What do you need to do?</h2>
            <p id="search-dialog-description" class="mt-1 text-sm text-muted">Search by tool name, task, or format.</p>
          </div>
          <button type="button" class="focus-ring grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-canvas-soft hover:text-ink" aria-label="Close search" @click="closeSearch">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <ToolSearch :key="searchSession" autofocus inline-results @selected="closeSearch" @dismissed="closeSearch" />
        <p class="mt-4 text-xs leading-5 text-muted"><span class="font-semibold text-muted-strong">Keyboard:</span> ↑↓ to choose · Enter to open · Esc to close</p>
      </div>
    </dialog>
  </ClientOnly>
</template>

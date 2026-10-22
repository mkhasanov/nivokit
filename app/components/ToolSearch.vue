<script setup lang="ts">
import { getCategory, getToolPath, tools } from '#shared/tools'
import { searchTools } from '~/utils/search'

const props = withDefaults(defineProps<{
  autofocus?: boolean
  prominent?: boolean
  inlineResults?: boolean
}>(), {
  autofocus: false,
  prominent: false,
  inlineResults: false,
})

const emit = defineEmits<{ selected: [], dismissed: [] }>()
const { locale, t } = useLocale()
const query = ref('')
const activeIndex = ref(0)
const focused = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const listId = useId()
const statusId = useId()
const results = computed(() => searchTools(tools, query.value, locale).slice(0, 6))
const showResults = computed(() => focused.value && (query.value.length > 0 || props.autofocus))
const statusMessage = computed(() => {
  if (!showResults.value) return ''
  if (!query.value.trim()) return `${results.value.length} available ${results.value.length === 1 ? 'tool' : 'tools'}.`
  if (!results.value.length) return `No tools found for ${query.value}.`
  return `${results.value.length} ${results.value.length === 1 ? 'result' : 'results'} for ${query.value}.`
})

watch(query, () => {
  activeIndex.value = 0
})

onMounted(() => {
  if (props.autofocus) nextTick(() => searchInput.value?.focus())
})

async function selectResult(index: number) {
  const result = results.value[index]
  if (!result) return
  emit('selected')
  await navigateTo(getToolPath(result.tool, locale))
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && results.value.length > 0) {
    event.preventDefault()
    selectResult(activeIndex.value)
  } else if (event.key === 'Home' && results.value.length > 0) {
    event.preventDefault()
    activeIndex.value = 0
  } else if (event.key === 'End' && results.value.length > 0) {
    event.preventDefault()
    activeIndex.value = results.value.length - 1
  } else if (event.key === 'Escape') {
    event.preventDefault()
    focused.value = false
    searchInput.value?.blur()
    emit('dismissed')
  }
}

function handleBlur() {
  window.setTimeout(() => {
    focused.value = false
  }, 140)
}

function clearQuery() {
  query.value = ''
  activeIndex.value = 0
  searchInput.value?.focus()
}
</script>

<template>
  <div class="relative w-full">
    <div :class="['relative rounded-2xl border bg-panel shadow-card transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-soft', prominent ? 'border-line p-1.5 sm:p-2' : 'border-line p-1.5']">
      <svg class="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref="searchInput"
        v-model="query"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        autocomplete="off"
        :aria-label="t('searchLabel')"
        :aria-expanded="showResults"
        :aria-controls="listId"
        :aria-describedby="statusId"
        :aria-activedescendant="showResults && results[activeIndex] ? `${listId}-${activeIndex}` : undefined"
        :placeholder="t('searchPlaceholder')"
        :class="['w-full rounded-xl bg-transparent pl-11 text-ink outline-none placeholder:text-muted/70', query ? 'pr-12' : 'pr-16', prominent ? 'h-14 text-base sm:h-15 sm:text-lg' : 'h-12 text-base']"
        @focus="focused = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
      >
      <button v-if="query" type="button" class="focus-ring absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-canvas-soft hover:text-ink" aria-label="Clear search" @click="clearQuery">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
      <kbd v-else class="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-md border border-line bg-canvas-soft px-2 py-1 text-[10px] font-bold text-muted sm:block">Ctrl K</kbd>
    </div>

    <p :id="statusId" class="sr-only" role="status" aria-live="polite">{{ statusMessage }}</p>

    <div
      v-if="showResults"
      :id="listId"
      role="listbox"
      :aria-label="query ? 'Search results' : 'Available tools'"
      :class="['right-0 left-0 z-30 overflow-hidden rounded-2xl border border-line bg-panel p-2 shadow-soft', inlineResults ? 'relative mt-2' : 'absolute top-[calc(100%+0.6rem)]']"
    >
      <template v-if="results.length">
        <p class="px-3 pt-1 pb-2 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">{{ query ? 'Best match' : 'Available now' }}</p>
        <button
          v-for="(result, index) in results"
          :id="`${listId}-${index}`"
          :key="result.tool.id"
          type="button"
          role="option"
          :aria-selected="index === activeIndex"
          :class="['flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition', index === activeIndex ? 'bg-brand-soft' : 'hover:bg-canvas-soft']"
          @mouseenter="activeIndex = index"
          @mousedown.prevent
          @click="selectResult(index)"
        >
          <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-canvas-soft text-brand" aria-hidden="true">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <path d="m21 16-5-5L5 20" />
            </svg>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center justify-between gap-3">
              <span class="block font-semibold text-ink">{{ result.tool.locales[locale].name }}</span>
              <span class="shrink-0 text-xs font-semibold text-muted">{{ getCategory(result.tool.category)?.locales[locale].name }}</span>
            </span>
            <span class="mt-0.5 block truncate text-sm text-muted">{{ result.tool.locales[locale].shortDescription }}</span>
          </span>
        </button>
      </template>
      <div v-else class="px-4 py-7 text-center">
        <span class="mx-auto grid size-10 place-items-center rounded-xl bg-canvas-soft text-muted" aria-hidden="true">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M8.5 11h5" /></svg>
        </span>
        <p class="mt-3 text-sm font-semibold text-ink">No matching tool</p>
        <p class="mt-1 text-sm text-muted">{{ t('noSearchResults') }}</p>
      </div>
    </div>
  </div>
</template>

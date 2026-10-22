<script setup lang="ts">
import { getToolPath, tools } from '#shared/tools'
import { searchTools } from '~/utils/search'

const props = withDefaults(defineProps<{
  autofocus?: boolean
  prominent?: boolean
}>(), {
  autofocus: false,
  prominent: false,
})

const emit = defineEmits<{ selected: [] }>()
const { locale, t } = useLocale()
const query = ref('')
const activeIndex = ref(0)
const focused = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const listId = useId()
const results = computed(() => searchTools(tools, query.value, locale).slice(0, 6))
const showResults = computed(() => focused.value && (query.value.length > 0 || props.autofocus))

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
  } else if (event.key === 'Escape') {
    focused.value = false
    searchInput.value?.blur()
  }
}

function handleBlur() {
  window.setTimeout(() => {
    focused.value = false
  }, 140)
}
</script>

<template>
  <div class="relative w-full">
    <div :class="['relative rounded-2xl border bg-panel shadow-card transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-soft', prominent ? 'border-line p-2' : 'border-line p-1.5']">
      <svg class="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref="searchInput"
        v-model="query"
        type="search"
        role="combobox"
        autocomplete="off"
        :aria-label="t('searchLabel')"
        :aria-expanded="showResults"
        :aria-controls="listId"
        :aria-activedescendant="showResults && results[activeIndex] ? `${listId}-${activeIndex}` : undefined"
        :placeholder="t('searchPlaceholder')"
        :class="['w-full rounded-xl bg-transparent pr-16 pl-11 text-ink outline-none placeholder:text-muted/70', prominent ? 'h-14 text-base sm:text-lg' : 'h-12 text-base']"
        @focus="focused = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
      >
      <kbd class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rounded-md border border-line bg-canvas-soft px-2 py-1 text-[11px] font-semibold text-muted">⌘K</kbd>
    </div>

    <div v-if="showResults" :id="listId" role="listbox" class="absolute top-[calc(100%+0.6rem)] right-0 left-0 z-30 overflow-hidden rounded-2xl border border-line bg-panel p-2 shadow-soft">
      <template v-if="results.length">
        <button
          v-for="(result, index) in results"
          :id="`${listId}-${index}`"
          :key="result.tool.id"
          type="button"
          role="option"
          :aria-selected="index === activeIndex"
          :class="['flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition', index === activeIndex ? 'bg-brand-soft' : 'hover:bg-canvas-soft']"
          @mouseenter="activeIndex = index"
          @mousedown.prevent="selectResult(index)"
        >
          <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-canvas-soft text-brand" aria-hidden="true">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <path d="m21 16-5-5L5 20" />
            </svg>
          </span>
          <span class="min-w-0">
            <span class="block font-semibold text-ink">{{ result.tool.locales[locale].name }}</span>
            <span class="block truncate text-sm text-muted">{{ result.tool.locales[locale].shortDescription }}</span>
          </span>
        </button>
      </template>
      <p v-else class="px-4 py-6 text-center text-sm text-muted">{{ t('noSearchResults') }}</p>
    </div>
  </div>
</template>

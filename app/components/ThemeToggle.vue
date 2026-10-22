<script setup lang="ts">
const { resolvedTheme, toggleTheme } = useTheme()
const isMounted = ref(false)
const displayedTheme = computed(() => isMounted.value ? resolvedTheme.value : 'light')
const label = computed(() => displayedTheme.value === 'dark' ? 'Use light theme' : 'Use dark theme')

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <button type="button" class="focus-ring grid size-11 place-items-center rounded-xl border border-line bg-panel text-muted shadow-sm transition hover:border-brand/60 hover:text-ink" :aria-label="label" :title="label" @click="toggleTheme">
    <svg v-if="displayedTheme === 'dark'" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
    <svg v-else class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
      <path d="M20.5 14.5A8.2 8.2 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
    </svg>
  </button>
</template>

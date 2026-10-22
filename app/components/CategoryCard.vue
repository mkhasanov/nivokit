<script setup lang="ts">
import type { CategoryDefinition, SupportedLocale } from '#shared/tools'

const props = defineProps<{
  category: CategoryDefinition
  locale: SupportedLocale
  toolCount: number
}>()

const content = computed(() => props.category.locales[props.locale])
const countLabel = computed(() => `${props.toolCount} ${props.toolCount === 1 ? 'tool' : 'tools'}`)
</script>

<template>
  <NuxtLink :to="`/${locale}/${category.slug}/`" class="focus-ring surface-card group flex min-h-44 flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-soft">
    <div class="flex items-center justify-between gap-4">
      <span class="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand" aria-hidden="true">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="9" cy="10" r="2" />
          <path d="m21 16-5-5L5 20" />
        </svg>
      </span>
      <span class="rounded-full bg-canvas-soft px-2.5 py-1 text-xs font-semibold text-muted">{{ countLabel }}</span>
    </div>
    <h3 class="mt-5 text-lg font-bold tracking-tight">{{ content.name }}</h3>
    <p class="mt-2 flex-1 text-sm leading-6 text-muted">{{ content.description }}</p>
    <span class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
      Explore category
      <svg class="size-4 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  </NuxtLink>
</template>

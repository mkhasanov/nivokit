<script setup lang="ts">
import { getToolPath, type SupportedLocale, type ToolDefinition } from '#shared/tools'

const props = defineProps<{
  tool: ToolDefinition
  locale: SupportedLocale
  featured?: boolean
}>()

const content = computed(() => props.tool.locales[props.locale])
const path = computed(() => getToolPath(props.tool, props.locale))
</script>

<template>
  <NuxtLink
    :to="path"
    :class="[
      'focus-ring group surface-card transition duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-soft',
      featured ? 'grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-8' : 'flex min-h-52 flex-col p-6',
    ]"
  >
    <div :class="['grid shrink-0 place-items-center bg-brand-soft text-brand', featured ? 'size-14 rounded-2xl' : 'size-11 rounded-xl']" aria-hidden="true">
      <svg :class="featured ? 'size-7' : 'size-5'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5L5 20" />
      </svg>
    </div>
    <div :class="featured ? '' : 'mt-5 flex flex-1 flex-col'">
      <div v-if="featured" class="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
        <span class="rounded-full bg-canvas-soft px-2.5 py-1">JPG</span>
        <span class="rounded-full bg-canvas-soft px-2.5 py-1">PNG</span>
        <span class="rounded-full bg-canvas-soft px-2.5 py-1">WebP</span>
        <span class="inline-flex items-center gap-1.5 text-brand"><span class="size-1.5 rounded-full bg-brand" />Runs locally</span>
      </div>
      <h3 :class="featured ? 'text-xl font-bold tracking-tight sm:text-2xl' : 'text-lg font-bold tracking-tight'">{{ content.name }}</h3>
      <p :class="['mt-2 text-sm leading-6 text-muted', featured ? 'max-w-2xl sm:text-base sm:leading-7' : 'flex-1']">{{ content.shortDescription }}</p>
    </div>
    <span :class="['inline-flex shrink-0 items-center gap-2 font-semibold text-brand', featured ? 'text-sm sm:justify-self-end' : 'mt-5 text-sm']">
      {{ featured ? 'Resize an image' : 'Open tool' }}
      <svg class="size-4 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  </NuxtLink>
</template>

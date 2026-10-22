<script setup lang="ts">
import { getToolPath, type SupportedLocale, type ToolDefinition } from '#shared/tools'

const props = defineProps<{
  tool: ToolDefinition
  locale: SupportedLocale
}>()

const content = computed(() => props.tool.locales[props.locale])
const path = computed(() => getToolPath(props.tool, props.locale))
</script>

<template>
  <NuxtLink :to="path" class="focus-ring group surface-card flex min-h-48 flex-col p-6 transition duration-200 hover:-translate-y-1 hover:border-brand/45 hover:shadow-soft">
    <div class="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand" aria-hidden="true">
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5L5 20" />
      </svg>
    </div>
    <h3 class="mt-5 text-lg font-bold tracking-tight">{{ content.name }}</h3>
    <p class="mt-2 flex-1 text-sm leading-6 text-muted">{{ content.shortDescription }}</p>
    <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
      Open tool
      <svg class="size-4 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  </NuxtLink>
</template>

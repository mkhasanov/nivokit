<script setup lang="ts">
import { categories, getCategoryTools, tools } from '#shared/tools'

const { locale } = useLocale()
const featuredTools = tools.filter(tool => tool.featured)
const liveCategories = categories.filter(category => getCategoryTools(category.id).length > 0)
const { canonical } = usePageSeo({
  title: 'NivoKit — Useful Tools. Zero Friction.',
  description: 'Fast, focused browser tools with clear privacy and no required account. Resize images locally with a clean, accessible workflow.',
  path: `/${locale}/`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NivoKit',
        url: canonical,
        description: 'Useful browser tools with zero friction.',
        inLanguage: 'en',
      }),
    },
  ],
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-line bg-panel/25">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand/30" aria-hidden="true" />
      <div class="container-shell py-14 sm:py-18 lg:py-22">
        <div class="mx-auto max-w-4xl text-center">
          <p class="eyebrow">Fast tools · Clear privacy · No sign-up</p>
          <h1 class="mt-4 text-4xl font-bold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl">
            Useful browser tools,<br class="hidden sm:block"><span class="text-brand"> without the busywork.</span>
          </h1>
          <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Find a focused utility, finish the task, and move on. Start by resizing JPG, PNG, and WebP images privately in your browser.
          </p>
          <div class="mx-auto mt-8 max-w-2xl text-left sm:mt-9">
            <ToolSearch prominent />
          </div>
          <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <NuxtLink class="primary-button w-full gap-2 sm:w-auto" :to="`/${locale}/image/resize-image`">
              Resize an image
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </NuxtLink>
            <NuxtLink class="focus-ring inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-muted hover:text-ink" :to="`/${locale}/privacy`">How local processing works</NuxtLink>
          </div>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted sm:text-sm">
            <span class="inline-flex items-center gap-2"><svg class="size-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>No account required</span>
            <span class="inline-flex items-center gap-2"><svg class="size-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>The live image tool does not upload files</span>
          </div>
        </div>
      </div>
    </section>

    <section id="tools" class="container-shell py-12 sm:py-16" aria-labelledby="featured-heading">
      <div class="flex items-end justify-between gap-6">
        <div>
          <p class="eyebrow">Available now</p>
          <h2 id="featured-heading" class="section-title mt-2">Start with Image Resizer</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">Set exact dimensions, preserve proportions, and choose the output format—all without sending your image to a server.</p>
        </div>
      </div>
      <div class="mt-6">
        <ToolCard v-for="tool in featuredTools" :key="tool.id" :tool="tool" :locale="locale" featured />
      </div>
    </section>

    <section class="border-y border-line bg-canvas-soft/60">
      <div class="container-shell py-12 sm:py-16">
        <p class="eyebrow">Browse by category</p>
        <h2 class="section-title mt-2">Explore finished utilities</h2>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">Categories appear only when they contain a complete, tested tool.</p>
        <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard v-for="category in liveCategories" :key="category.id" :category="category" :locale="locale" :tool-count="getCategoryTools(category.id).length" />
        </div>
      </div>
    </section>

    <section class="container-shell py-12 sm:py-16" aria-labelledby="principles-heading">
      <div class="grid gap-6 rounded-2xl border border-line bg-panel px-6 py-7 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center sm:px-8 sm:py-8">
        <div>
          <p class="eyebrow">Built for focused work</p>
          <h2 id="principles-heading" class="section-title mt-2">Clear in, clear out.</h2>
        </div>
        <div class="grid gap-5 text-sm leading-6 text-muted sm:grid-cols-2">
          <p><strong class="block text-ink">Transparent processing</strong>Each tool explains where your data is handled and what its limits are.</p>
          <p><strong class="block text-ink">No manufactured catalogue</strong>Only working, tested utilities appear in search, navigation, and the sitemap.</p>
        </div>
      </div>
    </section>
  </div>
</template>

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
    <section class="relative overflow-hidden border-b border-line">
      <div class="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div class="absolute top-[-15rem] left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-brand-soft blur-3xl" />
      </div>
      <div class="container-shell relative py-20 sm:py-28 lg:py-32">
        <div class="mx-auto max-w-3xl text-center">
          <p class="eyebrow">Private by design · No account required</p>
          <h1 class="mt-5 text-4xl font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
            The tool you need.<br><span class="text-brand">Nothing in the way.</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Focused utilities that open quickly, explain themselves clearly, and keep supported file processing in your browser.
          </p>
          <div class="mx-auto mt-10 max-w-2xl text-left">
            <ToolSearch prominent />
          </div>
          <div class="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <span class="inline-flex items-center gap-2"><span class="size-1.5 rounded-full bg-brand" />No uploads for live file tools</span>
            <span class="inline-flex items-center gap-2"><span class="size-1.5 rounded-full bg-brand" />Keyboard friendly</span>
            <span class="inline-flex items-center gap-2"><span class="size-1.5 rounded-full bg-brand" />Free during MVP</span>
          </div>
        </div>
      </div>
    </section>

    <section class="container-shell py-16 sm:py-20" aria-labelledby="featured-heading">
      <div class="flex items-end justify-between gap-6">
        <div>
          <p class="eyebrow">Ready now</p>
          <h2 id="featured-heading" class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Featured tools</h2>
          <p class="mt-3 max-w-2xl text-muted">Only complete, tested tools are listed. No dead buttons or placeholder pages.</p>
        </div>
      </div>
      <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ToolCard v-for="tool in featuredTools" :key="tool.id" :tool="tool" :locale="locale" />
      </div>
    </section>

    <section class="border-y border-line bg-canvas-soft/65">
      <div class="container-shell py-16 sm:py-20">
        <p class="eyebrow">Browse by category</p>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">A growing, honest toolkit</h2>
        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="category in liveCategories" :key="category.id" :to="`/${locale}/${category.slug}/`" class="focus-ring surface-card group p-6 transition hover:-translate-y-1 hover:border-brand/45">
            <div class="flex items-center justify-between gap-4">
              <div class="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand" aria-hidden="true">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5L5 20" /></svg>
              </div>
              <span class="rounded-full bg-canvas-soft px-2.5 py-1 text-xs font-semibold text-muted">{{ getCategoryTools(category.id).length }} live</span>
            </div>
            <h3 class="mt-5 text-lg font-bold">{{ category.locales[locale].name }}</h3>
            <p class="mt-2 text-sm leading-6 text-muted">{{ category.locales[locale].description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="container-shell py-16 sm:py-24">
      <div class="surface-card grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p class="eyebrow">A calmer workflow</p>
          <h2 class="mt-2 text-3xl font-bold tracking-tight">Your file stays close.</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div><p class="text-sm font-bold">01 · Choose</p><p class="mt-2 text-sm leading-6 text-muted">Pick a supported file without creating an account.</p></div>
          <div><p class="text-sm font-bold">02 · Adjust</p><p class="mt-2 text-sm leading-6 text-muted">Use clear controls with useful validation and feedback.</p></div>
          <div><p class="text-sm font-bold">03 · Download</p><p class="mt-2 text-sm leading-6 text-muted">Export the result directly from your browser.</p></div>
        </div>
      </div>
    </section>
  </div>
</template>

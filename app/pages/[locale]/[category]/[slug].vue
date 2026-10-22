<script setup lang="ts">
import { getCategory, getTool, getToolPath } from '#shared/tools'
import { absoluteUrl } from '#shared/site'
import { toolComponents } from '~/data/tool-components'

const route = useRoute()
const { locale } = useLocale()
const categorySlug = String(route.params.category)
const toolSlug = String(route.params.slug)
const tool = getTool(categorySlug, toolSlug)
const category = getCategory(categorySlug)

if (!tool || !category) {
  throw createError({ statusCode: 404, statusMessage: 'Tool not found' })
}

const content = tool.locales[locale]
const path = getToolPath(tool, locale)
const { canonical } = usePageSeo({
  title: content.seoTitle,
  description: content.seoDescription,
  path,
})
const config = useRuntimeConfig()
const toolComponent = toolComponents[tool.id]

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: content.name,
            url: canonical,
            description: content.seoDescription,
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Any modern web browser',
            browserRequirements: 'Requires JavaScript and Canvas support',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(config.public.siteUrl, `/${locale}/`) },
              { '@type': 'ListItem', position: 2, name: category.locales[locale].name, item: absoluteUrl(config.public.siteUrl, `/${locale}/${category.slug}/`) },
              { '@type': 'ListItem', position: 3, name: content.name, item: canonical },
            ],
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="container-shell py-6 sm:py-10">
    <nav class="text-sm text-muted" aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-2">
        <li><NuxtLink class="focus-ring rounded-md px-1 py-1 hover:text-ink" :to="`/${locale}/`">Home</NuxtLink></li><li aria-hidden="true" class="text-line">/</li>
        <li><NuxtLink class="focus-ring rounded-md px-1 py-1 hover:text-ink" :to="`/${locale}/${category.slug}/`">{{ category.locales[locale].name }}</NuxtLink></li><li aria-hidden="true" class="text-line">/</li>
        <li aria-current="page">{{ content.name }}</li>
      </ol>
    </nav>

    <header class="mt-6 max-w-3xl sm:mt-8">
      <div class="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand">
        <span class="size-1.5 rounded-full bg-brand" /> Browser-side processing
      </div>
      <h1 class="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">{{ content.name }}</h1>
      <p class="mt-3 text-base leading-7 text-muted sm:text-lg sm:leading-8">{{ content.description }}</p>
    </header>

    <div class="mt-7 sm:mt-8">
      <component :is="toolComponent" />
    </div>

    <article class="mx-auto mt-14 max-w-3xl sm:mt-18">
      <section aria-labelledby="how-to-heading">
        <p class="eyebrow">Simple workflow</p>
        <h2 id="how-to-heading" class="section-title mt-2">How to resize an image</h2>
        <ol class="mt-6 grid gap-4 sm:grid-cols-3">
          <li v-for="(step, index) in content.steps" :key="step" class="rounded-2xl border border-line bg-panel p-5">
            <span class="grid size-8 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">{{ index + 1 }}</span>
            <p class="mt-4 text-sm leading-6 text-muted">{{ step }}</p>
          </li>
        </ol>
      </section>

      <section class="mt-14 sm:mt-16" aria-labelledby="faq-heading">
        <p class="eyebrow">Good to know</p>
        <h2 id="faq-heading" class="section-title mt-2">Frequently asked questions</h2>
        <div class="mt-6 divide-y divide-line border-y border-line">
          <details v-for="faq in content.faqs" :key="faq.question" class="group py-5">
            <summary class="focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold">
              {{ faq.question }}
              <span class="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-lg text-brand transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="mt-2 pr-10 text-sm leading-7 text-muted">{{ faq.answer }}</p>
          </details>
        </div>
      </section>
    </article>
  </div>
</template>

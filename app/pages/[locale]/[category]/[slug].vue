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
  <div class="container-shell py-8 sm:py-12">
    <nav class="text-sm text-muted" aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-2">
        <li><NuxtLink class="focus-ring rounded hover:text-ink" :to="`/${locale}/`">Home</NuxtLink></li><li aria-hidden="true">/</li>
        <li><NuxtLink class="focus-ring rounded hover:text-ink" :to="`/${locale}/${category.slug}/`">{{ category.locales[locale].name }}</NuxtLink></li><li aria-hidden="true">/</li>
        <li aria-current="page">{{ content.name }}</li>
      </ol>
    </nav>

    <header class="mt-8 max-w-3xl">
      <div class="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
        <span class="size-1.5 rounded-full bg-brand" /> Browser-side processing
      </div>
      <h1 class="mt-5 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">{{ content.name }}</h1>
      <p class="mt-4 text-lg leading-8 text-muted">{{ content.description }}</p>
    </header>

    <div class="mt-9">
      <component :is="toolComponent" />
    </div>

    <article class="mx-auto mt-16 max-w-3xl sm:mt-24">
      <section aria-labelledby="how-to-heading">
        <p class="eyebrow">Simple workflow</p>
        <h2 id="how-to-heading" class="mt-2 text-3xl font-bold tracking-tight">How to resize an image</h2>
        <ol class="mt-8 grid gap-5 sm:grid-cols-3">
          <li v-for="(step, index) in content.steps" :key="step" class="rounded-2xl border border-line bg-panel p-5">
            <span class="text-xs font-bold text-brand">STEP {{ index + 1 }}</span>
            <p class="mt-3 text-sm leading-6 text-muted">{{ step }}</p>
          </li>
        </ol>
      </section>

      <section class="mt-16" aria-labelledby="faq-heading">
        <p class="eyebrow">Good to know</p>
        <h2 id="faq-heading" class="mt-2 text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <div class="mt-6 divide-y divide-line border-y border-line">
          <details v-for="faq in content.faqs" :key="faq.question" class="group py-5">
            <summary class="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold">
              {{ faq.question }}
              <span class="text-xl text-brand transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="mt-3 pr-10 text-sm leading-7 text-muted">{{ faq.answer }}</p>
          </details>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { getCategory, getCategoryTools, staticPageSlugs, type StaticPageSlug } from '#shared/tools'
import { staticPages } from '~/data/static-pages'

const route = useRoute()
const { locale } = useLocale()
const section = String(route.params.section)
const category = getCategory(section)
const staticPage = staticPageSlugs.includes(section as StaticPageSlug) ? staticPages[section as StaticPageSlug] : undefined

if (!category && !staticPage) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const categoryTools = category ? getCategoryTools(category.id) : []
const seo = staticPage
  ? { title: `${staticPage.title} | NivoKit`, description: staticPage.description, path: `/${locale}/${section}` }
  : {
      title: `${category!.locales[locale].name} — Private Browser Tools | NivoKit`,
      description: category!.locales[locale].description,
      path: `/${locale}/${category!.slug}/`,
    }

usePageSeo(seo)
</script>

<template>
  <div v-if="staticPage" class="container-shell py-12 sm:py-20">
    <article class="mx-auto max-w-3xl">
      <p class="eyebrow">NivoKit information</p>
      <h1 class="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{{ staticPage.title }}</h1>
      <p class="mt-5 text-lg leading-8 text-muted">{{ staticPage.description }}</p>
      <p class="mt-4 text-xs text-muted">Last updated {{ staticPage.updated }}</p>
      <div class="mt-12 space-y-10">
        <section v-for="contentSection in staticPage.sections" :key="contentSection.heading">
          <h2 class="text-2xl font-bold tracking-tight">{{ contentSection.heading }}</h2>
          <p v-for="paragraph in contentSection.paragraphs" :key="paragraph" class="mt-4 leading-7 text-muted">{{ paragraph }}</p>
          <ul v-if="contentSection.bullets" class="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li v-for="bullet in contentSection.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </section>
      </div>
    </article>
  </div>

  <div v-else-if="category" class="container-shell py-12 sm:py-20">
    <nav class="text-sm text-muted" aria-label="Breadcrumb">
      <ol class="flex items-center gap-2"><li><NuxtLink class="focus-ring rounded hover:text-ink" :to="`/${locale}/`">Home</NuxtLink></li><li aria-hidden="true">/</li><li aria-current="page">{{ category.locales[locale].name }}</li></ol>
    </nav>
    <div class="mt-8 max-w-2xl">
      <p class="eyebrow">Browse tools</p>
      <h1 class="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{{ category.locales[locale].name }}</h1>
      <p class="mt-5 text-lg leading-8 text-muted">{{ category.locales[locale].description }}</p>
    </div>
    <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <ToolCard v-for="tool in categoryTools" :key="tool.id" :tool="tool" :locale="locale" />
    </div>
  </div>
</template>

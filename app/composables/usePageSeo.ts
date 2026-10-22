import { absoluteUrl } from '#shared/site'

interface PageSeoOptions {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
}

export function usePageSeo(options: PageSeoOptions) {
  const config = useRuntimeConfig()
  const canonical = absoluteUrl(config.public.siteUrl, options.path)

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: options.type ?? 'website',
    ogUrl: canonical,
    ogSiteName: 'NivoKit',
    twitterCard: 'summary',
    twitterTitle: options.title,
    twitterDescription: options.description,
  })

  useHead({
    htmlAttrs: { lang: 'en' },
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'alternate', hreflang: 'en', href: canonical },
      { rel: 'alternate', hreflang: 'x-default', href: canonical },
    ],
  })

  return { canonical }
}

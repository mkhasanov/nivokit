import tailwindcss from '@tailwindcss/vite'
import { getPublishedRoutes } from './shared/tools'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-22',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#f8faf8', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0e1310', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
  routeRules: {
    '/': { redirect: '/en/' },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [...getPublishedRoutes(), '/robots.txt', '/sitemap.xml'],
    },
  },
  typescript: {
    typeCheck: true,
  },
})

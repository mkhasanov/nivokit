import { isSupportedLocale, type SupportedLocale } from '#shared/tools'
import { message } from '~/data/messages'

export function useLocale() {
  const route = useRoute()
  const routeLocale = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  if (typeof routeLocale === 'string' && !isSupportedLocale(routeLocale)) {
    throw createError({ statusCode: 404, statusMessage: 'Locale not available' })
  }
  const locale: SupportedLocale = typeof routeLocale === 'string' && isSupportedLocale(routeLocale) ? routeLocale : 'en'
  const t = (key: string) => message(locale, key)
  return { locale, t }
}

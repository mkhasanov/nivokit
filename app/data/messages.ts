import type { SupportedLocale } from '#shared/tools'

export const messages: Record<SupportedLocale, Record<string, string>> = {
  en: {
    brandTagline: 'Useful tools. Zero friction.',
    searchPlaceholder: 'Search tools, tasks, or formats…',
    searchLabel: 'Search NivoKit tools',
    noSearchResults: 'No live tool matches that search yet.',
    privacyBadge: 'Runs in your browser',
  },
}

export function message(locale: SupportedLocale, key: string): string {
  return messages[locale][key] ?? messages.en[key] ?? key
}

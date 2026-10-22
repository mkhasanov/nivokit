export type ThemePreference = 'light' | 'dark' | 'system'

function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference !== 'system') return preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const preference = useState<ThemePreference>('theme-preference', () => 'system')
  const resolvedTheme = useState<'light' | 'dark'>('resolved-theme', () => 'light')

  function applyTheme(nextPreference: ThemePreference) {
    if (!import.meta.client) return
    preference.value = nextPreference
    resolvedTheme.value = resolveTheme(nextPreference)
    document.documentElement.classList.toggle('dark', resolvedTheme.value === 'dark')
    document.documentElement.dataset.theme = resolvedTheme.value
    localStorage.setItem('nivokit-theme', nextPreference)
  }

  function initializeTheme() {
    if (!import.meta.client) return
    const stored = localStorage.getItem('nivokit-theme')
    const nextPreference: ThemePreference = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
    applyTheme(nextPreference)
  }

  function toggleTheme() {
    applyTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark')
  }

  return { preference, resolvedTheme, applyTheme, initializeTheme, toggleTheme }
}

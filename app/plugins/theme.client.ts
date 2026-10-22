export default defineNuxtPlugin(() => {
  const { preference, initializeTheme, applyTheme } = useTheme()
  initializeTheme()

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (preference.value === 'system') applyTheme('system')
  }
  media.addEventListener('change', handleChange)
})

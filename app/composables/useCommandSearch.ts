export function useCommandSearch() {
  const isSearchOpen = useState('command-search-open', () => false)

  function openSearch() {
    isSearchOpen.value = true
  }

  function closeSearch() {
    isSearchOpen.value = false
  }

  return { isSearchOpen, openSearch, closeSearch }
}

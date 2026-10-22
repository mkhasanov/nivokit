<script setup lang="ts">
const { openSearch } = useCommandSearch()
</script>

<template>
  <a href="#main-content" class="focus-ring fixed top-2 left-2 z-50 -translate-y-20 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-canvas transition focus:translate-y-0">
    Skip to content
  </a>
  <header class="sticky top-0 z-40 border-b border-line/80 bg-canvas/88 backdrop-blur-xl">
      <div class="container-shell flex h-16 items-center gap-3">
        <NuxtLink to="/en/" class="focus-ring -ml-2 flex items-center gap-2.5 rounded-xl p-2" aria-label="NivoKit home">
          <span class="grid size-8 place-items-center rounded-xl bg-ink text-sm font-bold text-canvas" aria-hidden="true">N</span>
          <span class="text-base font-bold tracking-tight">NivoKit</span>
        </NuxtLink>

        <nav class="ml-3 hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <NuxtLink to="/en/" class="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:text-ink">
            Home
          </NuxtLink>
          <NuxtLink to="/en/image/" class="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:text-ink">
            Image tools
          </NuxtLink>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <button type="button" class="focus-ring hidden min-h-10 items-center gap-3 rounded-xl border border-line bg-panel px-3 text-sm text-muted shadow-sm transition hover:border-muted hover:text-ink sm:flex" aria-label="Open tool search" @click="openSearch">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Find a tool</span>
            <kbd class="rounded-md border border-line bg-canvas-soft px-1.5 py-0.5 text-[11px] font-semibold">⌘K</kbd>
          </button>
          <button type="button" class="focus-ring grid size-10 place-items-center rounded-xl border border-line bg-panel text-muted transition hover:border-muted hover:text-ink sm:hidden" aria-label="Open tool search" @click="openSearch">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <span class="hidden rounded-lg px-2 py-1 text-xs font-semibold text-muted lg:inline" aria-label="Current language: English">EN</span>
          <ThemeToggle />
        </div>
      </div>
  </header>
</template>

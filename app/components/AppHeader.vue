<script setup lang="ts">
const { openSearch } = useCommandSearch()
</script>

<template>
  <a href="#main-content" class="focus-ring fixed top-2 left-2 z-50 -translate-y-20 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-canvas shadow-soft transition focus:translate-y-0">
    Skip to content
  </a>
  <header class="sticky top-0 z-40 border-b border-line/85 bg-canvas/92 backdrop-blur-xl">
      <div class="container-shell flex h-[4.5rem] items-center gap-2 sm:gap-4">
        <NuxtLink to="/en/" class="focus-ring -ml-2 flex min-h-11 items-center gap-2.5 rounded-xl p-2" aria-label="NivoKit home">
          <span class="relative grid size-8 place-items-center rounded-[0.65rem] bg-ink text-sm font-bold text-canvas shadow-sm" aria-hidden="true">
            N
            <span class="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border-2 border-canvas bg-brand" />
          </span>
          <span class="text-[1.05rem] font-bold tracking-[-0.025em]">NivoKit</span>
        </NuxtLink>

        <nav class="ml-2 hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <NuxtLink to="/en/" class="focus-ring rounded-lg px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-canvas-soft hover:text-ink" active-class="text-ink">
            Home
          </NuxtLink>
          <NuxtLink to="/en/image/" class="focus-ring rounded-lg px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-canvas-soft hover:text-ink" active-class="text-ink">
            Image tools
          </NuxtLink>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <button type="button" class="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-panel px-3 text-sm font-semibold text-muted shadow-sm transition hover:border-brand/60 hover:text-ink sm:gap-3 sm:px-3.5" aria-label="Open tool search" @click="openSearch">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span class="sm:hidden">Search</span>
            <span class="hidden sm:inline">Find a tool</span>
            <kbd class="hidden rounded-md border border-line bg-canvas-soft px-1.5 py-0.5 text-[10px] font-bold text-muted lg:inline">Ctrl K</kbd>
          </button>
          <span class="hidden rounded-lg px-1 py-1 text-xs font-bold text-muted lg:inline" aria-label="Current language: English">EN</span>
          <ThemeToggle />
        </div>
      </div>
  </header>
</template>

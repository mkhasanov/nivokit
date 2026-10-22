<template>
  <footer class="mt-16 border-t border-line bg-panel/55 sm:mt-20">
    <div class="container-shell grid gap-8 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:py-12">
      <div>
        <NuxtLink to="/en/" class="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg pr-2 text-base font-bold">
          <span class="grid size-7 place-items-center rounded-lg bg-ink text-xs text-canvas" aria-hidden="true">N</span>
          NivoKit
        </NuxtLink>
        <p class="mt-2 max-w-md text-sm leading-6 text-muted">
          Focused browser utilities with clear controls and transparent data handling.
        </p>
      </div>
      <nav class="flex flex-wrap gap-x-1 gap-y-1 text-sm text-muted" aria-label="Footer navigation">
        <NuxtLink class="focus-ring rounded-lg px-2 py-2 hover:bg-canvas-soft hover:text-ink" to="/en/privacy">Privacy</NuxtLink>
        <NuxtLink class="focus-ring rounded-lg px-2 py-2 hover:bg-canvas-soft hover:text-ink" to="/en/terms">Terms</NuxtLink>
        <NuxtLink class="focus-ring rounded-lg px-2 py-2 hover:bg-canvas-soft hover:text-ink" to="/en/about">About</NuxtLink>
        <NuxtLink class="focus-ring rounded-lg px-2 py-2 hover:bg-canvas-soft hover:text-ink" to="/en/contact">Contact</NuxtLink>
        <NuxtLink class="focus-ring rounded-lg px-2 py-2 hover:bg-canvas-soft hover:text-ink" to="/en/accessibility">Accessibility</NuxtLink>
      </nav>
    </div>
    <div class="border-t border-line/70">
      <div class="container-shell py-4 text-xs leading-5 text-muted">
        NivoKit is a working product name. Production domain, trademark, operator, and contact details still require verification.
      </div>
    </div>
  </footer>
</template>

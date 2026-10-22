<template>
  <footer class="mt-20 border-t border-line bg-panel/55">
    <div class="container-shell grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <NuxtLink to="/en/" class="focus-ring inline-flex items-center gap-2 rounded-lg text-base font-bold">
          <span class="grid size-7 place-items-center rounded-lg bg-ink text-xs text-canvas" aria-hidden="true">N</span>
          NivoKit
        </NuxtLink>
        <p class="mt-3 max-w-md text-sm leading-6 text-muted">
          Useful tools. Zero friction. NivoKit is a working brand; domain and trademark clearance remain deployment requirements.
        </p>
      </div>
      <nav class="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted" aria-label="Footer navigation">
        <NuxtLink class="focus-ring rounded hover:text-ink" to="/en/privacy">Privacy</NuxtLink>
        <NuxtLink class="focus-ring rounded hover:text-ink" to="/en/terms">Terms</NuxtLink>
        <NuxtLink class="focus-ring rounded hover:text-ink" to="/en/about">About</NuxtLink>
        <NuxtLink class="focus-ring rounded hover:text-ink" to="/en/contact">Contact</NuxtLink>
        <NuxtLink class="focus-ring rounded hover:text-ink" to="/en/accessibility">Accessibility</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

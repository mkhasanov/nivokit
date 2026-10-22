<template>
  <div class="flex min-h-screen flex-col bg-canvas text-ink">
    <AppHeader />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <SearchDialog />
  </div>
</template>

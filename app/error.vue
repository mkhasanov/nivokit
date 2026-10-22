<script setup lang="ts">
defineProps<{ error: { statusCode?: number, statusMessage?: string, message?: string } }>()
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-canvas px-4 text-ink">
    <main class="surface-card w-full max-w-lg p-8 text-center sm:p-12">
      <p class="eyebrow">{{ error.statusCode || 500 }}</p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight">{{ error.statusCode === 404 ? 'This page is not here.' : 'Something went wrong.' }}</h1>
      <p class="mt-4 leading-7 text-muted">{{ error.statusMessage || error.message || 'Try returning to the homepage.' }}</p>
      <button type="button" class="primary-button mt-7" @click="clearError({ redirect: '/en/' })">Back to NivoKit</button>
    </main>
  </div>
</template>

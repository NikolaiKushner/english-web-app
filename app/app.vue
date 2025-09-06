<template>
  <UiErrorBoundary>
    <div class="min-h-screen bg-gray-50">
      <NuxtRouteAnnouncer />
      <UiHeader />
      <main>
        <NuxtPage />
      </main>
      <UiFooter />
      <UiToast />
    </div>
  </UiErrorBoundary>
</template>

<style>
@import url("~/assets/css/main.css");
</style>

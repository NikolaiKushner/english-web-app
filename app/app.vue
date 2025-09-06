<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50">
      <NuxtRouteAnnouncer />
      <AppHeader />
      <main>
        <NuxtPage />
      </main>
      <AppFooter />
      <Toast />
    </div>
  </ErrorBoundary>
</template>

<style>
@import url("~/assets/css/main.css");
</style>

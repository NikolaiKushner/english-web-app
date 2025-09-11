<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p class="mt-2 text-sm text-gray-600">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
      </div>
      <div class="space-y-4">
        <UiButton to="/" variant="primary" size="lg" class="w-full">
          ← Back to Home
        </UiButton>
        <UiButton 
          v-if="user"
          to="/lessons" 
          variant="secondary" 
          size="lg" 
          class="w-full"
        >
          Go to Lessons
        </UiButton>
        <UiButton 
          v-else
          to="/auth/login" 
          variant="secondary" 
          size="lg" 
          class="w-full"
        >
          Sign In
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
// Set page meta
useHead({
  title: '404 - Page Not Found',
  meta: [
    { name: 'description', content: 'The page you are looking for could not be found.' }
  ]
})
</script>

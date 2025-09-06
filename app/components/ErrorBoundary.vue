<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p class="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
        </p>
      </div>

      <div class="space-y-4">
        <button
          @click="retry"
          class="w-full btn-primary py-3"
        >
          Try Again
        </button>
        
        <button
          @click="goHome"
          class="w-full btn-secondary py-3"
        >
          Go to Homepage
        </button>
      </div>

      <!-- Error Details (only in development) -->
      <div v-if="isDevelopment && errorDetails" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
        <details>
          <summary class="cursor-pointer font-medium text-red-800 mb-2">Error Details (Development)</summary>
          <pre class="text-xs text-red-700 overflow-auto">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
interface Props {
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'Something went wrong'
})

const hasError = ref(false)
const errorDetails = ref<string>('')
const isDevelopment = process.dev

const handleError = (error: Error, errorInfo?: any) => {
  hasError.value = true
  errorDetails.value = `${error.message}\n${error.stack}`
  
  // Log error for monitoring
  console.error('Error Boundary caught an error:', error, errorInfo)
  
  // In production, you might want to send this to an error reporting service
  if (!isDevelopment) {
    // Example: Send to error reporting service
    // reportError(error, errorInfo)
  }
}

const retry = () => {
  hasError.value = false
  errorDetails.value = ''
  // Force a re-render
  nextTick(() => {
    window.location.reload()
  })
}

const goHome = () => {
  navigateTo('/')
}

// Expose error handler for parent components
defineExpose({
  handleError
})

// Global error handler
onMounted(() => {
  window.addEventListener('error', (event) => {
    handleError(new Error(event.message), { filename: event.filename, lineno: event.lineno })
  })

  window.addEventListener('unhandledrejection', (event) => {
    handleError(new Error(event.reason), { type: 'unhandled-promise-rejection' })
  })
})

// Handle Vue errors
onErrorCaptured((error, instance, info) => {
  handleError(error, { instance, info })
  return false // Prevent error from propagating
})
</script>

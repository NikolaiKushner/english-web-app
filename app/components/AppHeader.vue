<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="text-xl font-bold text-gray-900">English Learning</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
            Home
          </NuxtLink>
          <NuxtLink to="/lessons" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
            Lessons
          </NuxtLink>
          <NuxtLink to="/progress" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
            Progress
          </NuxtLink>
        </nav>

        <!-- User Menu -->
        <div
          class="flex items-center space-x-4"
        >
          <template v-if="authStore.user">
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-700">
                Welcome, {{ authStore.user.name || authStore.user.email }}
              </span>
              <button
                @click="handleSignOut"
                class="btn-secondary text-sm"
                :disabled="authStore.loading"
              >
                Sign Out
              </button>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Sign In
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary text-sm">
              Sign Up
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const handleSignOut = async () => {
  await authStore.signOut()
  await navigateTo('/')
}
</script>

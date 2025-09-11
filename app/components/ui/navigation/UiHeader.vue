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
          <template v-if="user">
            <NuxtLink to="/lessons" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Lessons
            </NuxtLink>
            <NuxtLink to="/vocabulary" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span>Dictionary</span>
            </NuxtLink>
            <NuxtLink to="/lessons/create" class="text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>AI Creator</span>
            </NuxtLink>
            <NuxtLink to="/progress" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Progress
            </NuxtLink>
          </template>
        </nav>

        <!-- User Menu -->
        <div
          class="flex items-center space-x-4"
        >
          <template v-if="user">
            <div class="flex items-center space-x-3">
              <NuxtLink 
                to="/admin" 
                class="text-gray-600 hover:text-gray-900 px-2 py-1 rounded text-sm font-medium flex items-center space-x-1"
                title="Admin Panel"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="hidden lg:inline">Admin</span>
              </NuxtLink>
              <span class="text-sm text-gray-700">
                Welcome, {{ user?.user_metadata?.name || user?.email }}
              </span>
              <button
                @click="handleSignOut"
                class="btn-secondary text-sm"
                :disabled="loading"
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
const user = useSupabaseUser()
const client = useSupabaseClient()

const loading = ref(false)

const handleSignOut = async () => {
  loading.value = true
  await client.auth.signOut()
  await navigateTo('/')
  loading.value = false
}
</script>

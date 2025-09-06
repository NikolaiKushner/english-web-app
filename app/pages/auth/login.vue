<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-2xl">E</span>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input-field mt-1"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="input-field mt-1"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn-primary py-3 text-base"
          >
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const error = ref('')

const handleLogin = async () => {
  error.value = ''
  
  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields'
    return
  }

  const { data, error: loginError } = await authStore.signIn(form.email, form.password)
  
  if (loginError) {
    error.value = loginError.message || 'An error occurred during login'
  } else {
    await router.push('/')
  }
}

// Redirect if already logged in
watch(() => authStore.user, (user) => {
  if (user) {
    router.push('/')
  }
}, { immediate: true })

// Set page meta
useHead({
  title: 'Sign In - English Learning Platform'
})
</script>

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
          <UiInput
            v-model="form.email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
            :error="error && error.includes('email') ? error : undefined"
          />
          
          <UiInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
            :error="error && error.includes('password') ? error : undefined"
          />
        </div>

        <UiAlert
          v-if="error"
          variant="error"
          :message="error"
          dismissible
          @dismiss="error = ''"
        />

        <UiButton
          type="submit"
          :loading="authStore.loading"
          loading-text="Signing in..."
          block
          size="lg"
          class="mt-6"
        >
          Sign in
        </UiButton>
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

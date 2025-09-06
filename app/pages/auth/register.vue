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
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <UiInput
            v-model="form.name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            autocomplete="name"
            required
          />
          
          <UiInput
            v-model="form.email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
          />
          
          <UiInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Create a password"
            autocomplete="new-password"
            hint="Must be at least 6 characters long"
            required
          />
          
          <UiInput
            v-model="form.confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            autocomplete="new-password"
            required
          />
        </div>

        <UiAlert
          v-if="error"
          variant="error"
          :message="error"
          dismissible
          @dismiss="error = ''"
        />

        <UiAlert
          v-if="success"
          variant="success"
          :message="success"
          dismissible
          @dismiss="success = ''"
        />

        <UiButton
          type="submit"
          :loading="authStore.loading"
          loading-text="Creating account..."
          block
          size="lg"
        >
          Create account
        </UiButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  
  if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    error.value = 'Please fill in all fields'
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  const { data, error: registerError } = await authStore.signUp(form.email, form.password, form.name)
  
  if (registerError) {
    error.value = registerError.message || 'An error occurred during registration'
  } else {
    success.value = 'Account created successfully! Please check your email to verify your account.'
    // Reset form
    Object.assign(form, {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
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
  title: 'Sign Up - English Learning Platform'
})
</script>

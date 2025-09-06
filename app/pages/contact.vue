<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p class="text-xl text-gray-600">
        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="input-field"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="input-field"
                placeholder="Your last name"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              id="subject"
              v-model="form.subject"
              required
              class="input-field"
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="technical">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              required
              class="input-field resize-none"
              placeholder="Tell us how we can help you..."
            ></textarea>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Send Message</span>
          </button>
        </form>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Contact Details -->
        <div class="card">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Email</h3>
                <p class="text-gray-600">support@englishlearning.com</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Response Time</h3>
                <p class="text-gray-600">We typically respond within 24 hours</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Support Hours</h3>
                <p class="text-gray-600">Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Link -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Help</h2>
          <p class="text-gray-600 mb-4">
            Looking for immediate answers? Check out our FAQ section for solutions to common questions.
          </p>
          <NuxtLink to="/help" class="btn-secondary">
            Browse FAQ
          </NuxtLink>
        </div>

        <!-- Alternative Contact -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h2>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span class="text-gray-600">Follow us on social media for updates</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span class="text-gray-600">Join our community forum</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span class="text-gray-600">Subscribe to our newsletter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, you would send this to your backend
    console.log('Contact form submitted:', form)
    
    success.value = 'Thank you for your message! We\'ll get back to you soon.'
    toast.success('Message sent successfully!', 'We\'ll respond within 24 hours.')
    
    // Reset form
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    })
    
  } catch (err) {
    error.value = 'Failed to send message. Please try again.'
    toast.error('Failed to send message', 'Please try again or contact us directly.')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Contact Us - English Learning Platform',
  meta: [
    { name: 'description', content: 'Get in touch with our support team. We\'re here to help with any questions about our English learning platform.' }
  ]
})
</script>

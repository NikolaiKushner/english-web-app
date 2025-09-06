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
      <UiCard title="Send us a Message" variant="elevated" padding="lg">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UiInput
              v-model="form.firstName"
              label="First Name"
              placeholder="Your first name"
              required
            />
            <UiInput
              v-model="form.lastName"
              label="Last Name"
              placeholder="Your last name"
              required
            />
          </div>

          <UiInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            required
          />

          <UiSelect
            v-model="form.subject"
            label="Subject"
            placeholder="Select a subject"
            :options="[
              { label: 'General Inquiry', value: 'general' },
              { label: 'Technical Support', value: 'technical' },
              { label: 'Billing Question', value: 'billing' },
              { label: 'Feature Request', value: 'feature' },
              { label: 'Bug Report', value: 'bug' },
              { label: 'Other', value: 'other' }
            ]"
            required
          />

          <UiTextarea
            v-model="form.message"
            label="Message"
            placeholder="Tell us how we can help you..."
            :rows="6"
            resize="none"
            required
          />

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
            :loading="loading"
            loading-text="Sending..."
            block
            size="lg"
          >
            Send Message
          </UiButton>
        </form>
      </UiCard>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Contact Details -->
        <UiCard title="Get in Touch" variant="default" padding="lg">
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
        </UiCard>

        <!-- FAQ Link -->
        <UiCard title="Quick Help" variant="default" padding="lg">
          <p class="text-gray-600 mb-4">
            Looking for immediate answers? Check out our FAQ section for solutions to common questions.
          </p>
          <UiButton to="/help" variant="secondary">
            Browse FAQ
          </UiButton>
        </UiCard>

        <!-- Alternative Contact -->
        <UiCard title="Other Ways to Reach Us" variant="default" padding="lg">
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
        </UiCard>
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

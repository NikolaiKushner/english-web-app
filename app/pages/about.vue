<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">About English Learning Platform</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        We're passionate about making English learning accessible, engaging, and effective for everyone.
      </p>
    </div>

    <div class="space-y-12">
      <!-- Mission Section -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p class="text-gray-600 leading-relaxed">
          Our mission is to break down language barriers by providing high-quality English education that's 
          accessible to learners worldwide. We believe that everyone deserves the opportunity to master English, 
          regardless of their background or location.
        </p>
      </div>

      <!-- Features Section -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">What Makes Us Different</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">Interactive Learning</h3>
              <p class="text-sm text-gray-600">Engage with dynamic exercises and real-time feedback.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">Progress Tracking</h3>
              <p class="text-sm text-gray-600">Monitor your improvement with detailed analytics.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">Structured Curriculum</h3>
              <p class="text-sm text-gray-600">Learn with carefully designed lessons that build on each other.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">Learn at Your Pace</h3>
              <p class="text-sm text-gray-600">Study anytime, anywhere, at your own speed.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Team</h2>
        <p class="text-gray-600 leading-relaxed">
          We're a diverse team of educators, developers, and language enthusiasts committed to creating 
          the best possible learning experience. Our combined expertise in education, technology, and 
          linguistics drives us to constantly improve and innovate.
        </p>
      </div>

      <!-- CTA Section -->
      <div class="text-center py-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
        <p class="text-gray-600 mb-6">Join thousands of learners who are improving their English with us.</p>
        <NuxtLink to="/auth/register" class="btn-primary text-lg py-3 px-8">
          Get Started Today
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'About Us - English Learning Platform',
  meta: [
    { name: 'description', content: 'Learn about our mission to make English learning accessible and effective for everyone.' }
  ]
})
</script>

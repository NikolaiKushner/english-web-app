<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Master English with
            <span class="text-yellow-300">Interactive Learning</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Learn English through engaging lessons, exercises, and personalized progress tracking. 
            Start your journey to fluency today.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UiButton 
              v-if="!authStore?.user" 
              to="/auth/register" 
              variant="warning"
              size="xl"
              class="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
            >
              Get Started Free
            </UiButton>
            <UiButton 
              v-if="!authStore?.user"
              to="/auth/login" 
              variant="ghost"
              size="xl"
              class="border-2 border-white hover:bg-white hover:text-blue-600 text-white"
            >
              Sign In
            </UiButton>
            <UiButton 
              v-if="authStore?.user"
              to="/lessons" 
              variant="primary"
              size="xl"
              class="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Learning
            </UiButton>
            <UiButton 
              v-if="authStore?.user"
              to="/vocabulary" 
              variant="ghost"
              size="xl"
              class="border-2 border-white hover:bg-white hover:text-blue-600 text-white"
            >
              Dictionary
            </UiButton>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Features Section -->
    <section class="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-purple-600 font-semibold text-sm uppercase tracking-wide">AI-Powered Learning</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn English with Artificial Intelligence
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience personalized learning with AI that adapts to your needs, creates custom exercises, and provides intelligent feedback
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Smart Exercise Generation</h3>
            <p class="text-gray-600 mb-4">
              AI creates unlimited personalized exercises based on your interests, level, and learning goals.
            </p>
            <div class="text-sm text-purple-600 font-medium">
              ✨ Unlimited custom content
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Intelligent Explanations</h3>
            <p class="text-gray-600 mb-4">
              Get detailed AI explanations for every answer with learning tips and related concepts.
            </p>
            <div class="text-sm text-blue-600 font-medium">
              🧠 Personalized feedback
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Adaptive Learning Path</h3>
            <p class="text-gray-600 mb-4">
              AI analyzes your progress and suggests the most effective next steps for your learning journey.
            </p>
            <div class="text-sm text-green-600 font-medium">
              📈 Smart recommendations
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <UiButton 
            to="/lessons/create" 
            variant="primary"
            size="xl"
            class="bg-purple-600 hover:bg-purple-700"
          >
            <template #icon-left>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </template>
            Try AI Exercise Creator
          </UiButton>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Learning Platform
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Traditional structured learning combined with cutting-edge AI technology
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Structured Lessons</h3>
            <p class="text-gray-600">
              Learn with carefully crafted lessons that build upon each other, from beginner to advanced levels.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Interactive Exercises</h3>
            <p class="text-gray-600">
              Practice with various exercise types including multiple choice, fill-in-the-blank, and listening exercises.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p class="text-gray-600">
              Monitor your learning journey with detailed progress reports and personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gray-900 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Learning?
        </h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already improving their English skills with our platform.
        </p>
        <UiButton 
          v-if="!authStore?.user"
          to="/auth/register" 
          variant="primary"
          size="xl"
        >
          Start Learning Now
        </UiButton>
        <UiButton 
          v-else
          to="/lessons" 
          variant="primary"
          size="xl"
        >
          Continue Learning
        </UiButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Set page meta
useHead({
  title: 'English Learning Platform - Master English with Interactive Lessons',
  meta: [
    { name: 'description', content: 'Learn English through engaging lessons, exercises, and personalized progress tracking. Start your journey to fluency today.' }
  ]
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">English Lessons</h1>
      <p class="text-lg text-gray-600">
        Choose your level and start learning with our structured lessons
      </p>
    </div>

    <!-- Level Filter -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="level in levels"
          :key="level.value"
          @click="selectedLevel = level.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
            selectedLevel === level.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ level.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner 
      v-if="learningStore.loading" 
      size="lg" 
      message="Loading lessons..." 
    />

    <!-- Lessons Grid -->
    <div v-else-if="filteredLessons.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="lesson in filteredLessons"
        :key="lesson.id"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-2">
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                levelColors[lesson.level]
              ]"
            >
              {{ lesson.level }}
            </span>
            <span class="text-sm text-gray-500">Lesson {{ lesson.order }}</span>
          </div>
          <div v-if="learningStore.isLessonCompleted(lesson.id)" class="text-green-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>

        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ lesson.title }}</h3>
        <p class="text-gray-600 mb-4 line-clamp-3">{{ lesson.description }}</p>

        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">{{ lesson.category }}</span>
          <NuxtLink
            :to="`/lessons/${lesson.id}`"
            class="btn-primary text-sm"
          >
            Start Lesson
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
      <p class="text-gray-600">Try selecting a different level or check back later for new content.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const learningStore = useLearningStore()
const authStore = useAuthStore()

const levels = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' }
]

const selectedLevel = ref('')

const levelColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
}

const filteredLessons = computed(() => {
  if (!selectedLevel.value) return learningStore.lessons
  return learningStore.lessons.filter(lesson => lesson.level === selectedLevel.value)
})

// Fetch lessons on component mount
onMounted(async () => {
  await learningStore.fetchLessons()
  
  // If user is logged in, fetch their progress
  if (authStore.user) {
    await learningStore.fetchUserProgress(authStore.user.id)
  }
})

// Set page meta
useHead({
  title: 'English Lessons - Learn English Online'
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

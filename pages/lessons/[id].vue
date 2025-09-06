<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="learningStore.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Lesson Content -->
    <div v-else-if="lesson" class="space-y-8">
      <!-- Lesson Header -->
      <div class="card">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <span
              :class="[
                'px-3 py-1 text-sm font-medium rounded-full',
                levelColors[lesson.level]
              ]"
            >
              {{ lesson.level }}
            </span>
            <span class="text-sm text-gray-500">Lesson {{ lesson.order }}</span>
          </div>
          <div v-if="learningStore.isLessonCompleted(lesson.id)" class="text-green-600">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ lesson.title }}</h1>
        <p class="text-lg text-gray-600 mb-6">{{ lesson.description }}</p>

        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">{{ lesson.category }}</span>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-gray-500">Estimated time: 15-20 minutes</span>
          </div>
        </div>
      </div>

      <!-- Lesson Content -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Lesson Content</h2>
        <div class="prose max-w-none" v-html="formattedContent"></div>
      </div>

      <!-- Exercises Section -->
      <div v-if="exercises.length > 0" class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Practice Exercises</h2>
        <div class="space-y-4">
          <div
            v-for="(exercise, index) in exercises"
            :key="exercise.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-medium text-gray-900">Exercise {{ index + 1 }}</h3>
              <span class="text-sm text-gray-500 capitalize">{{ exercise.type.replace('_', ' ') }}</span>
            </div>
            <p class="text-gray-700 mb-3">{{ exercise.question }}</p>
            
            <!-- Multiple Choice Options -->
            <div v-if="exercise.type === 'multiple_choice' && exercise.options" class="space-y-2">
              <label
                v-for="(option, optionIndex) in exercise.options"
                :key="optionIndex"
                class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="radio"
                  :name="`exercise-${exercise.id}`"
                  :value="option"
                  class="text-blue-600"
                />
                <span>{{ option }}</span>
              </label>
            </div>

            <!-- Fill in the Blank -->
            <div v-else-if="exercise.type === 'fill_blank'" class="space-y-2">
              <input
                type="text"
                :placeholder="'Enter your answer'"
                class="input-field"
              />
            </div>

            <!-- Translation -->
            <div v-else-if="exercise.type === 'translation'" class="space-y-2">
              <textarea
                :placeholder="'Enter your translation'"
                class="input-field h-20 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button class="btn-secondary">
            Check Answers
          </button>
          <button
            @click="completeLesson"
            :disabled="learningStore.loading"
            class="btn-primary"
          >
            Complete Lesson
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <NuxtLink
          to="/lessons"
          class="btn-secondary"
        >
          ← Back to Lessons
        </NuxtLink>
        <button
          v-if="!learningStore.isLessonCompleted(lesson.id)"
          @click="completeLesson"
          :disabled="learningStore.loading"
          class="btn-primary"
        >
          Mark as Complete
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Lesson not found</h3>
      <p class="text-gray-600 mb-4">The lesson you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/lessons" class="btn-primary">
        Browse All Lessons
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const learningStore = useLearningStore()
const authStore = useAuthStore()

const lessonId = route.params.id as string
const lesson = ref(null)
const exercises = ref([])

const levelColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
}

const formattedContent = computed(() => {
  if (!lesson.value?.content) return ''
  return lesson.value.content.replace(/\n/g, '<br>')
})

const completeLesson = async () => {
  if (!authStore.user || !lesson.value) return

  const progressData = {
    user_id: authStore.user.id,
    lesson_id: lesson.value.id,
    completed: true,
    completed_at: new Date().toISOString()
  }

  await learningStore.updateProgress(progressData)
  
  // Show success message or redirect
  // You could add a toast notification here
}

// Fetch lesson data
onMounted(async () => {
  const { data: lessonData } = await learningStore.fetchLesson(lessonId)
  lesson.value = lessonData

  if (lessonData) {
    const { data: exercisesData } = await learningStore.fetchExercises(lessonId)
    exercises.value = exercisesData || []

    // If user is logged in, fetch their progress
    if (authStore.user) {
      await learningStore.fetchUserProgress(authStore.user.id)
    }
  }
})

// Set page meta
useHead(() => ({
  title: lesson.value ? `${lesson.value.title} - English Learning` : 'Lesson - English Learning'
}))
</script>

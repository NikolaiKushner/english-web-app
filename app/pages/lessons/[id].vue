<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="learningStore.loading" 
      size="lg" 
      message="Loading lesson..." 
    />

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
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Practice Exercises</h2>
        <ExercisePlayer
          :exercises="exercises"
          :lesson-id="lesson.id"
          @complete="handleExerciseComplete"
        />
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
          @click="completeLesson()"
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

const completeLesson = async (score?: number) => {
  if (!authStore.user || !lesson.value) return

  const progressData = {
    user_id: authStore.user.id,
    lesson_id: lesson.value.id,
    completed: true,
    score: score || 100,
    completed_at: new Date().toISOString()
  }

  const toast = useToast()
  
  try {
    await learningStore.updateProgress(progressData)
    toast.success('Lesson Completed!', `Great job! ${score ? `Score: ${score}%` : ''}`)
    
    // Optionally redirect to lessons page after a delay
    setTimeout(() => {
      navigateTo('/lessons')
    }, 2000)
  } catch (error) {
    toast.error('Error', 'Failed to save progress. Please try again.')
  }
}

const handleExerciseComplete = async (score: number) => {
  // Generate AI feedback before completing the lesson
  await generateAIFeedback(score)
  completeLesson(score)
}

const generateAIFeedback = async (score: number) => {
  if (!authStore.user || !lesson.value) return
  
  try {
    const aiService = useAI()
    
    // Prepare user progress data
    const userProgress = {
      completedExercises: exercises.value.length,
      totalExercises: exercises.value.length,
      averageScore: score,
      weakAreas: score < 70 ? [lesson.value.category] : [],
      strongAreas: score >= 80 ? [lesson.value.category] : []
    }
    
    const feedback = await aiService.generateFeedback(
      lesson.value.title,
      userProgress,
      lesson.value.level as 'beginner' | 'intermediate' | 'advanced'
    )
    
    // Show AI feedback in a toast
    toast.success(feedback.motivationalMessage, feedback.specificFeedback)
    
    // You could also display this in a modal or dedicated feedback section
    console.log('AI Feedback:', feedback)
    
  } catch (error) {
    console.warn('AI feedback generation failed:', error)
    // Continue without AI feedback
  }
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

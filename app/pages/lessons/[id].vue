<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <UiLoadingSpinner 
      v-if="learningStore.loading" 
      size="lg" 
      message="Loading lesson..." 
    />

    <!-- Lesson Content -->
    <div v-else-if="lesson" class="space-y-8">
      <!-- Lesson Header -->
      <UiCard variant="elevated" padding="lg">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <UiBadge
              :variant="getBadgeVariant(lesson.level)"
              size="sm"
              rounded
            >
              {{ lesson.level }}
            </UiBadge>
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
          <UiBadge variant="info" size="sm">{{ lesson.category }}</UiBadge>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-gray-500">Estimated time: 15-20 minutes</span>
          </div>
        </div>
      </UiCard>

      <!-- Lesson Content -->
      <UiCard title="Lesson Content" variant="default" padding="lg">
        <div class="prose max-w-none" v-html="formattedContent"></div>
      </UiCard>

      <!-- Exercises Section -->
      <UiCard 
        v-if="exercises.length > 0" 
        title="Practice Exercises" 
        variant="default" 
        padding="lg"
      >
        <ExercisePlayer
          :exercises="exercises"
          :lesson-id="lesson.id"
          @complete="handleExerciseComplete"
        />
      </UiCard>

      <!-- Navigation -->
      <div class="flex justify-between">
        <UiButton
          to="/lessons"
          variant="secondary"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </template>
          Back to Lessons
        </UiButton>
        <UiButton
          v-if="!learningStore.isLessonCompleted(lesson.id)"
          @click="completeLesson()"
          :loading="learningStore.loading"
          loading-text="Completing..."
          variant="primary"
        >
          Mark as Complete
        </UiButton>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <UiAlert
        variant="error"
        title="Lesson not found"
        message="The lesson you're looking for doesn't exist or has been removed."
        class="max-w-md mx-auto mb-6"
      />
      <UiButton to="/lessons" variant="primary">
        Browse All Lessons
      </UiButton>
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

const getBadgeVariant = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'success'
    case 'intermediate':
      return 'warning'
    case 'advanced':
      return 'danger'
    default:
      return 'default'
  }
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

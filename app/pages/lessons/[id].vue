<template>
  <!-- Authentication Guard -->
  <div v-if="!authStore.user" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Access Required</h2>
        <p class="mt-2 text-sm text-gray-600">
          Please sign in to access this lesson and continue your learning journey.
        </p>
      </div>
      <div class="space-y-4">
        <UiButton to="/auth/login" variant="primary" size="lg" class="w-full">
          Sign In
        </UiButton>
        <UiButton to="/auth/register" variant="secondary" size="lg" class="w-full">
          Create Account
        </UiButton>
        <UiButton to="/lessons" variant="ghost" size="lg" class="w-full">
          ← Back to Lessons
        </UiButton>
      </div>
    </div>
  </div>

  <!-- Main Content (only for authenticated users) -->
  <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div v-if="lessonContent.length > 0" class="space-y-6">
        <div
          v-for="(content, index) in lessonContent"
          :key="content.id"
          class="lesson-content-block"
        >
          <!-- Text Content -->
          <UiCard v-if="content.type === 'text'" variant="default" padding="lg">
            <div class="prose max-w-none" v-html="formatMarkdown(content.content)"></div>
          </UiCard>

          <!-- Image Content -->
          <UiCard v-else-if="content.type === 'image'" variant="default" padding="lg">
            <div class="text-center">
              <img 
                :src="content.content" 
                :alt="content.metadata?.alt || 'Lesson image'"
                class="max-w-full h-auto rounded-lg mx-auto"
              />
              <p v-if="content.metadata?.caption" class="text-sm text-gray-600 mt-2">
                {{ content.metadata.caption }}
              </p>
            </div>
          </UiCard>

          <!-- Video Content -->
          <UiCard v-else-if="content.type === 'video'" variant="default" padding="lg">
            <div class="aspect-w-16 aspect-h-9">
              <video 
                :src="content.content"
                controls
                class="w-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p v-if="content.metadata?.caption" class="text-sm text-gray-600 mt-2">
              {{ content.metadata.caption }}
            </p>
          </UiCard>

          <!-- Audio Content -->
          <UiCard v-else-if="content.type === 'audio'" variant="default" padding="lg">
            <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6v-6z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <audio 
                  :src="content.content"
                  controls
                  class="w-full"
                >
                  Your browser does not support the audio tag.
                </audio>
                <p v-if="content.metadata?.caption" class="text-sm text-gray-600 mt-1">
                  {{ content.metadata.caption }}
                </p>
              </div>
            </div>
          </UiCard>

          <!-- Interactive Content -->
          <UiCard v-else-if="content.type === 'interactive'" variant="default" padding="lg">
            <InteractiveContent :content="content" />
          </UiCard>
        </div>
      </div>

      <!-- Fallback to legacy content -->
      <UiCard v-else title="Lesson Content" variant="default" padding="lg">
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
const lessonContent = ref([])

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

// Simple markdown formatter
const formatMarkdown = (content: string) => {
  if (!content) return ''
  
  return content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mb-3 mt-6">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside space-y-1 mb-4">$1</ul>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
    // Wrap in paragraph tags
    .replace(/^(?!<[h|u|l])/gm, '<p class="mb-4">')
    .replace(/(?<!>)$/gm, '</p>')
    // Clean up extra tags
    .replace(/<p class="mb-4"><\/p>/g, '')
}

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

// Fetch lesson content from database
const fetchLessonContent = async (lessonId: string) => {
  try {
    const { supabase } = useSupabase()
    const { data, error } = await supabase
      .from('lesson_content')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('"order"', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching lesson content:', error)
    return []
  }
}

// Fetch lesson data
onMounted(async () => {
  const { data: lessonData } = await learningStore.fetchLesson(lessonId)
  lesson.value = lessonData

  if (lessonData) {
    // Fetch structured lesson content
    const contentData = await fetchLessonContent(lessonId)
    lessonContent.value = contentData

    // Fetch exercises
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

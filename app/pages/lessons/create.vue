<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Create AI-Powered Lesson</h1>
          <p class="text-lg text-gray-600">
            Generate personalized exercises using artificial intelligence
          </p>
        </div>
        <NuxtLink to="/lessons" class="btn-secondary">
          ← Back to Lessons
        </NuxtLink>
      </div>
    </div>

    <!-- AI Service Status Notice -->
    <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <div class="w-5 h-5 text-blue-600 mt-0.5">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-blue-900 mb-1">AI Features Notice</h3>
          <p class="text-sm text-blue-700">
            AI exercise generation requires an OpenAI API key. If you encounter quota errors, please check your 
            <a href="https://platform.openai.com/account/billing" target="_blank" class="underline hover:no-underline">
              OpenAI billing settings
            </a>. 
            Don't worry - all basic learning features work without AI!
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- AI Exercise Generator -->
      <div class="space-y-6">
        <AIExerciseGenerator 
          @exercises-generated="handleExercisesGenerated"
          @exercises-added="handleExercisesAdded"
        />
        
        <!-- Quick Templates -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="template in quickTemplates"
              :key="template.name"
              @click="applyTemplate(template)"
              class="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
            >
              <div class="font-medium text-gray-900">{{ template.name }}</div>
              <div class="text-sm text-gray-500">{{ template.description }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Generated Exercises Preview & Management -->
      <div class="space-y-6">
        <!-- Current Session Exercises -->
        <div v-if="sessionExercises.length > 0" class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Generated Exercises ({{ sessionExercises.length }})
            </h3>
            <div class="flex space-x-2">
              <button
                @click="clearSession"
                class="btn-secondary text-sm"
              >
                Clear All
              </button>
              <button
                @click="saveAsLesson"
                :disabled="savingLesson"
                class="btn-primary text-sm"
              >
                {{ savingLesson ? 'Saving...' : 'Save as Lesson' }}
              </button>
            </div>
          </div>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div
              v-for="(exercise, index) in sessionExercises"
              :key="`${exercise.topic}-${index}`"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200 relative"
            >
              <button
                @click="removeExercise(index)"
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div class="pr-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {{ exercise.type.replace('_', ' ') }} • {{ exercise.difficulty_level }}
                  </span>
                </div>
                
                <h4 class="font-medium text-gray-900 mb-2">{{ exercise.question }}</h4>
                
                <div v-if="exercise.options" class="text-sm text-gray-600 mb-2">
                  <strong>Options:</strong> {{ exercise.options.join(', ') }}
                </div>
                
                <div class="text-sm">
                  <strong class="text-green-700">Answer:</strong> 
                  <span class="text-green-600">{{ exercise.correct_answer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exercise Statistics -->
        <div v-if="sessionExercises.length > 0" class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Session Statistics</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ sessionExercises.length }}</div>
              <div class="text-sm text-blue-700">Total Exercises</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ uniqueTypes.length }}</div>
              <div class="text-sm text-green-700">Exercise Types</div>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ uniqueLevels.length }}</div>
              <div class="text-sm text-purple-700">Difficulty Levels</div>
            </div>
            <div class="text-center p-3 bg-orange-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">{{ uniqueTopics.length }}</div>
              <div class="text-sm text-orange-700">Topics Covered</div>
            </div>
          </div>
        </div>

        <!-- Getting Started Guide -->
        <div v-else class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
          <div class="space-y-4 text-sm text-gray-600">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-blue-600 font-bold text-xs">1</span>
              </div>
              <div>
                <div class="font-medium text-gray-900">Choose Your Topic</div>
                <div>Enter any English topic you want to practice - grammar, vocabulary, or conversation themes.</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-blue-600 font-bold text-xs">2</span>
              </div>
              <div>
                <div class="font-medium text-gray-900">Select Difficulty & Type</div>
                <div>Choose your level and preferred exercise format for personalized learning.</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-blue-600 font-bold text-xs">3</span>
              </div>
              <div>
                <div class="font-medium text-gray-900">Generate & Practice</div>
                <div>AI creates custom exercises instantly. Practice and get detailed explanations.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

definePageMeta({
  middleware: 'auth'
})

// Session state
const sessionExercises = ref<any[]>([])
const savingLesson = ref(false)

// Quick templates for common exercise types
const quickTemplates = [
  {
    name: 'Past Tense Practice',
    description: 'Regular and irregular verbs',
    topic: 'Past tense verbs - regular and irregular forms',
    level: 'intermediate' as const,
    type: 'fill_blank' as const,
    count: 5
  },
  {
    name: 'Vocabulary Quiz',
    description: 'Multiple choice vocabulary',
    topic: 'Common English vocabulary for daily conversations',
    level: 'beginner' as const,
    type: 'multiple_choice' as const,
    count: 4
  },
  {
    name: 'Grammar Challenge',
    description: 'Advanced grammar concepts',
    topic: 'Advanced English grammar - conditionals and subjunctive mood',
    level: 'advanced' as const,
    type: 'multiple_choice' as const,
    count: 3
  },
  {
    name: 'Translation Practice',
    description: 'English translation exercises',
    topic: 'English translation practice with idiomatic expressions',
    level: 'intermediate' as const,
    type: 'translation' as const,
    count: 3
  }
]

// Computed statistics
const uniqueTypes = computed(() => {
  return [...new Set(sessionExercises.value.map(ex => ex.type))]
})

const uniqueLevels = computed(() => {
  return [...new Set(sessionExercises.value.map(ex => ex.difficulty_level))]
})

const uniqueTopics = computed(() => {
  return [...new Set(sessionExercises.value.map(ex => ex.topic || 'General'))]
})

// Event handlers
const handleExercisesGenerated = (exercises: any[]) => {
  sessionExercises.value.push(...exercises.map(ex => ({
    ...ex,
    topic: 'Generated Exercise', // You could enhance this with the actual topic
    generatedAt: new Date().toISOString()
  })))
  
  toast.success('Exercises Added!', `${exercises.length} new exercises added to your session`)
}

const handleExercisesAdded = (exercises: any[]) => {
  // Handle when exercises are added to a lesson
  toast.success('Success!', 'Exercises have been added to your lesson')
}

const applyTemplate = (template: any) => {
  // This would trigger the form in AIExerciseGenerator to populate with template values
  // For now, we'll just show a message
  toast.info('Template Applied', `Use the generator with: ${template.topic}`)
}

const removeExercise = (index: number) => {
  sessionExercises.value.splice(index, 1)
  toast.info('Exercise Removed', 'Exercise removed from session')
}

const clearSession = () => {
  sessionExercises.value = []
  toast.info('Session Cleared', 'All exercises removed from session')
}

const saveAsLesson = async () => {
  if (sessionExercises.value.length === 0) {
    toast.warning('No Exercises', 'Add some exercises before saving')
    return
  }

  savingLesson.value = true
  
  try {
    // Simulate saving to database
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Here you would integrate with your lesson creation API
    // const lessonData = {
    //   title: `AI Generated Lesson - ${new Date().toLocaleDateString()}`,
    //   exercises: sessionExercises.value,
    //   created_at: new Date().toISOString()
    // }
    
    toast.success('Lesson Saved!', 'Your AI-generated lesson has been created')
    sessionExercises.value = []
    
    // Optionally redirect to the new lesson
    // await navigateTo(`/lessons/${newLessonId}`)
    
  } catch (error) {
    toast.error('Save Failed', 'Failed to save lesson. Please try again.')
  } finally {
    savingLesson.value = false
  }
}

// Set page meta
useHead({
  title: 'Create AI Lesson - English Learning Platform',
  meta: [
    { name: 'description', content: 'Create personalized English lessons using AI-powered exercise generation.' }
  ]
})
</script>

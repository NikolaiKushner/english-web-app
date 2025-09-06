<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">
        AI Exercise Generator
      </h2>
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <span class="text-sm text-purple-600 font-medium">AI-Powered</span>
      </div>
    </div>

    <form @submit.prevent="generateExercises" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Topic Input -->
        <div>
          <label for="topic" class="block text-sm font-medium text-gray-700 mb-1">
            Topic or Theme
          </label>
          <input
            id="topic"
            v-model="form.topic"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Past Tense Verbs, Family Vocabulary, Travel Phrases"
          />
        </div>

        <!-- Level Selection -->
        <div>
          <label for="level" class="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            id="level"
            v-model="form.level"
            required
            class="input-field"
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <!-- Exercise Type -->
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
            Exercise Type
          </label>
          <select
            id="type"
            v-model="form.type"
            required
            class="input-field"
          >
            <option value="">Select Type</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="fill_blank">Fill in the Blank</option>
            <option value="translation">Translation</option>
            <option value="listening">Listening (Conceptual)</option>
          </select>
        </div>

        <!-- Count -->
        <div>
          <label for="count" class="block text-sm font-medium text-gray-700 mb-1">
            Number of Exercises
          </label>
          <select
            id="count"
            v-model="form.count"
            class="input-field"
          >
            <option value="1">1 Exercise</option>
            <option value="2">2 Exercises</option>
            <option value="3">3 Exercises</option>
            <option value="5">5 Exercises</option>
          </select>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Generate Button -->
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          <span class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>AI will create personalized exercises based on your input</span>
          </span>
        </div>
        
        <button
          type="submit"
          :disabled="aiService.loading.value"
          class="btn-primary px-6 py-2"
        >
          <span v-if="aiService.loading.value" class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Generating...</span>
          </span>
          <span v-else class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span>Generate with AI</span>
          </span>
        </button>
      </div>
    </form>

    <!-- Generated Exercises Preview -->
    <div v-if="generatedExercises.length > 0" class="mt-8 pt-6 border-t border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Generated Exercises Preview</h3>
        <button
          @click="addToLesson"
          :disabled="addingToLesson"
          class="btn-primary text-sm"
        >
          <span v-if="addingToLesson">Adding...</span>
          <span v-else>Add to Lesson</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="(exercise, index) in generatedExercises"
          :key="index"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="flex items-start justify-between mb-2">
            <h4 class="font-medium text-gray-900">Exercise {{ index + 1 }}</h4>
            <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {{ exercise.type.replace('_', ' ') }}
            </span>
          </div>
          
          <p class="text-gray-700 mb-3">{{ exercise.question }}</p>
          
          <!-- Show options for multiple choice -->
          <div v-if="exercise.options" class="mb-3">
            <div class="text-sm text-gray-600 mb-1">Options:</div>
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li 
                v-for="option in exercise.options" 
                :key="option"
                :class="{ 'font-medium text-green-700': option === exercise.correct_answer }"
              >
                {{ option }}
                <span v-if="option === exercise.correct_answer" class="text-green-600 ml-1">✓</span>
              </li>
            </ul>
          </div>
          
          <!-- Show correct answer for non-multiple choice -->
          <div v-else class="mb-3">
            <div class="text-sm text-gray-600">
              <strong>Answer:</strong> 
              <span class="text-green-700 font-medium">{{ exercise.correct_answer }}</span>
            </div>
          </div>
          
          <!-- Show explanation -->
          <div class="text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-200">
            <strong>AI Explanation:</strong> {{ exercise.explanation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const aiService = useAI()
const toast = useToast()

const form = reactive({
  topic: '',
  level: '' as 'beginner' | 'intermediate' | 'advanced' | '',
  type: '' as 'multiple_choice' | 'fill_blank' | 'translation' | 'listening' | '',
  count: 3
})

const error = ref('')
const generatedExercises = ref<any[]>([])
const addingToLesson = ref(false)

const generateExercises = async () => {
  error.value = ''
  
  if (!form.topic || !form.level || !form.type) {
    error.value = 'Please fill in all required fields'
    return
  }

  try {
    const exercises = await aiService.generateExercises(
      form.topic,
      form.level as 'beginner' | 'intermediate' | 'advanced',
      form.type as 'multiple_choice' | 'fill_blank' | 'translation' | 'listening',
      form.count
    )
    
    generatedExercises.value = exercises
  } catch (err: any) {
    // Provide helpful error messages based on error type
    if (err.statusCode === 429 || err.message?.includes('quota')) {
      error.value = '🚨 OpenAI quota exceeded. Please check your billing at https://platform.openai.com/account/billing or try again later.'
    } else if (err.statusCode === 401) {
      error.value = '🔑 OpenAI API key not configured or invalid. Please contact the administrator.'
    } else {
      error.value = '⚠️ AI service temporarily unavailable. Please try again later or use the existing lessons.'
    }
  }
}

const addToLesson = async () => {
  addingToLesson.value = true
  
  try {
    // Here you would integrate with your lesson/exercise management system
    // For now, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.success('Exercises Added!', 'AI-generated exercises have been added to your lesson')
    generatedExercises.value = []
    
    // Reset form
    Object.assign(form, {
      topic: '',
      level: '',
      type: '',
      count: 3
    })
    
  } catch (err) {
    toast.error('Failed to add exercises', 'Please try again')
  } finally {
    addingToLesson.value = false
  }
}

// Emit events for parent components to handle
const emit = defineEmits<{
  exercisesGenerated: [exercises: any[]]
  exercisesAdded: [exercises: any[]]
}>()

// Watch for generated exercises and emit event
watch(generatedExercises, (exercises) => {
  if (exercises.length > 0) {
    emit('exercisesGenerated', exercises)
  }
})
</script>

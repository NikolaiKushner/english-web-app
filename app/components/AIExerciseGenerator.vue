<template>
  <UiCard variant="elevated" padding="lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-900">
          AI Exercise Generator
        </h2>
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <UiBadge variant="primary" size="sm">AI-Powered</UiBadge>
        </div>
      </div>
    </template>

    <form @submit.prevent="generateExercises" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Topic Input -->
        <UiInput
          v-model="form.topic"
          label="Topic or Theme"
          placeholder="e.g., Past Tense Verbs, Family Vocabulary, Travel Phrases"
          required
        />

        <!-- Level Selection -->
        <UiSelect
          v-model="form.level"
          label="Difficulty Level"
          placeholder="Select Level"
          :options="[
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' }
          ]"
          required
        />

        <!-- Exercise Type -->
        <UiSelect
          v-model="form.type"
          label="Exercise Type"
          placeholder="Select Type"
          :options="[
            { label: 'Multiple Choice', value: 'multiple_choice' },
            { label: 'Fill in the Blank', value: 'fill_blank' },
            { label: 'Translation', value: 'translation' },
            { label: 'Listening (Conceptual)', value: 'listening' }
          ]"
          required
        />

        <!-- Count -->
        <UiSelect
          v-model="form.count"
          label="Number of Exercises"
          :options="[
            { label: '1 Exercise', value: 1 },
            { label: '2 Exercises', value: 2 },
            { label: '3 Exercises', value: 3 },
            { label: '5 Exercises', value: 5 }
          ]"
        />
      </div>

      <!-- Error Display -->
      <UiAlert
        v-if="error"
        variant="error"
        :message="error"
        dismissible
        @dismiss="error = ''"
      />

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
        
        <UiButton
          type="submit"
          :loading="aiService.loading.value"
          loading-text="Generating..."
          variant="primary"
          size="md"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </template>
          Generate with AI
        </UiButton>
      </div>
    </form>

  </UiCard>

  <!-- Generated Exercises Preview -->
  <UiCard 
    v-if="generatedExercises.length > 0" 
    variant="default" 
    padding="lg"
    class="mt-6"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Generated Exercises Preview</h3>
        <UiButton
          @click="addToLesson"
          :loading="addingToLesson"
          loading-text="Adding..."
          variant="primary"
          size="sm"
        >
          Add to Lesson
        </UiButton>
      </div>
    </template>

    <div class="space-y-4">
      <UiCard
        v-for="(exercise, index) in generatedExercises"
        :key="index"
        variant="flat"
        padding="md"
      >
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-medium text-gray-900">Exercise {{ index + 1 }}</h4>
          <UiBadge variant="primary" size="xs">
            {{ exercise.type.replace('_', ' ') }}
          </UiBadge>
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
              <UiBadge v-if="option === exercise.correct_answer" variant="success" size="xs" class="ml-2">
                Correct
              </UiBadge>
            </li>
          </ul>
        </div>
        
        <!-- Show correct answer for non-multiple choice -->
        <div v-else class="mb-3">
          <div class="text-sm text-gray-600">
            <strong>Answer:</strong> 
            <UiBadge variant="success" size="xs" class="ml-1">{{ exercise.correct_answer }}</UiBadge>
          </div>
        </div>
        
        <!-- Show explanation -->
        <UiAlert variant="info" class="mt-3">
          <strong>AI Explanation:</strong> {{ exercise.explanation }}
        </UiAlert>
      </UiCard>
    </div>
  </UiCard>
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

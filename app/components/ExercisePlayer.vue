<template>
  <div class="space-y-6">
    <div
      v-for="(exercise, index) in exercises"
      :key="exercise.id"
      class="border border-gray-200 rounded-lg p-6"
      :class="{
        'border-green-500 bg-green-50': exerciseResults[exercise.id]?.isCorrect === true,
        'border-red-500 bg-red-50': exerciseResults[exercise.id]?.isCorrect === false,
        'border-blue-500': currentExercise === exercise.id
      }"
    >
      <div class="flex items-start justify-between mb-4">
        <h3 class="font-medium text-gray-900">Exercise {{ index + 1 }}</h3>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 capitalize">
            {{ exercise.type.replace('_', ' ') }}
          </span>
          <div v-if="exerciseResults[exercise.id]" class="flex items-center space-x-1">
            <CheckCircleIcon v-if="exerciseResults[exercise.id]?.isCorrect" class="w-5 h-5 text-green-600" />
            <XCircleIcon v-else class="w-5 h-5 text-red-600" />
            <span class="text-sm font-medium" :class="{
              'text-green-600': exerciseResults[exercise.id]?.isCorrect,
              'text-red-600': !exerciseResults[exercise.id]?.isCorrect
            }">
              {{ exerciseResults[exercise.id]?.score }}%
            </span>
          </div>
        </div>
      </div>

      <p class="text-gray-700 mb-4">{{ exercise.question }}</p>
      
      <!-- Multiple Choice Options -->
      <div v-if="exercise.type === 'multiple_choice' && exercise.options" class="space-y-2 mb-4">
        <label
          v-for="(option, optionIndex) in exercise.options"
          :key="optionIndex"
          class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          :class="{
            'bg-green-100 border border-green-300': exerciseResults[exercise.id] && option === exercise.correct_answer,
            'bg-red-100 border border-red-300': exerciseResults[exercise.id] && option === userAnswers[exercise.id] && option !== exercise.correct_answer
          }"
        >
          <input
            type="radio"
            :name="`exercise-${exercise.id}`"
            :value="option"
            v-model="userAnswers[exercise.id]"
            :disabled="exerciseResults[exercise.id] !== undefined"
            class="text-blue-600"
            @change="currentExercise = exercise.id"
          />
          <span :class="{
            'font-medium': exerciseResults[exercise.id] && (option === exercise.correct_answer || option === userAnswers[exercise.id])
          }">{{ option }}</span>
        </label>
      </div>

      <!-- Fill in the Blank -->
      <div v-else-if="exercise.type === 'fill_blank'" class="space-y-2 mb-4">
        <input
          type="text"
          v-model="userAnswers[exercise.id]"
          :disabled="exerciseResults[exercise.id] !== undefined"
          :placeholder="exerciseResults[exercise.id] ? '' : 'Enter your answer'"
          class="input-field"
          :class="{
            'border-green-500 bg-green-50': exerciseResults[exercise.id]?.isCorrect === true,
            'border-red-500 bg-red-50': exerciseResults[exercise.id]?.isCorrect === false
          }"
          @focus="currentExercise = exercise.id"
        />
        <div v-if="exerciseResults[exercise.id] && !exerciseResults[exercise.id]?.isCorrect" class="text-sm text-gray-600">
          <strong>Correct answer:</strong> {{ exercise.correct_answer }}
        </div>
      </div>

      <!-- Translation -->
      <div v-else-if="exercise.type === 'translation'" class="space-y-2 mb-4">
        <textarea
          v-model="userAnswers[exercise.id]"
          :disabled="exerciseResults[exercise.id] !== undefined"
          :placeholder="exerciseResults[exercise.id] ? '' : 'Enter your translation'"
          class="input-field h-20 resize-none"
          :class="{
            'border-green-500 bg-green-50': exerciseResults[exercise.id]?.isCorrect === true,
            'border-red-500 bg-red-50': exerciseResults[exercise.id]?.isCorrect === false
          }"
          @focus="currentExercise = exercise.id"
        ></textarea>
        <div v-if="exerciseResults[exercise.id] && !exerciseResults[exercise.id]?.isCorrect" class="text-sm text-gray-600">
          <strong>Suggested answer:</strong> {{ exercise.correct_answer }}
        </div>
      </div>

      <!-- Listening (placeholder for now) -->
      <div v-else-if="exercise.type === 'listening'" class="space-y-2 mb-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6v-6z"></path>
            </svg>
          </div>
          <p class="text-sm text-blue-600 mb-2">Audio exercise (coming soon)</p>
          <button class="btn-secondary text-sm">Play Audio</button>
        </div>
        <input
          type="text"
          v-model="userAnswers[exercise.id]"
          :disabled="exerciseResults[exercise.id] !== undefined"
          placeholder="What did you hear?"
          class="input-field"
          @focus="currentExercise = exercise.id"
        />
      </div>

      <!-- Exercise Result and Explanation -->
      <div v-if="exerciseResults[exercise.id]" class="mt-4 p-4 rounded-lg" :class="{
        'bg-green-50 border border-green-200': exerciseResults[exercise.id]?.isCorrect,
        'bg-red-50 border border-red-200': !exerciseResults[exercise.id]?.isCorrect
      }">
        <div class="flex items-start space-x-2">
          <CheckCircleIcon v-if="exerciseResults[exercise.id]?.isCorrect" class="w-5 h-5 text-green-600 mt-0.5" />
          <XCircleIcon v-else class="w-5 h-5 text-red-600 mt-0.5" />
          <div class="flex-1">
            <p class="font-medium" :class="{
              'text-green-800': exerciseResults[exercise.id]?.isCorrect,
              'text-red-800': !exerciseResults[exercise.id]?.isCorrect
            }">
              {{ exerciseResults[exercise.id]?.isCorrect ? 'Correct!' : 'Incorrect' }}
            </p>
            
            <!-- AI Explanation (prioritized) -->
            <div v-if="exerciseResults[exercise.id]?.aiExplanation" class="mt-2 space-y-2">
              <p class="text-sm" :class="{
                'text-green-700': exerciseResults[exercise.id]?.isCorrect,
                'text-red-700': !exerciseResults[exercise.id]?.isCorrect
              }">
                <strong>AI Explanation:</strong> {{ exerciseResults[exercise.id]?.aiExplanation?.explanation }}
              </p>
              
              <!-- AI Tips -->
              <div v-if="exerciseResults[exercise.id]?.aiExplanation?.tips.length > 0" class="text-sm">
                <strong class="text-blue-700">💡 Tips:</strong>
                <ul class="list-disc list-inside mt-1 space-y-1 text-blue-600">
                  <li v-for="tip in exerciseResults[exercise.id]?.aiExplanation?.tips" :key="tip">
                    {{ tip }}
                  </li>
                </ul>
              </div>
              
              <!-- Related Concepts -->
              <div v-if="exerciseResults[exercise.id]?.aiExplanation?.relatedConcepts.length > 0" class="text-sm">
                <strong class="text-purple-700">📚 Related Concepts:</strong>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="concept in exerciseResults[exercise.id]?.aiExplanation?.relatedConcepts" 
                    :key="concept"
                    class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                  >
                    {{ concept }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Fallback to original explanation if no AI explanation -->
            <p v-else-if="exercise.explanation" class="text-sm mt-1" :class="{
              'text-green-700': exerciseResults[exercise.id]?.isCorrect,
              'text-red-700': !exerciseResults[exercise.id]?.isCorrect
            }">
              {{ exercise.explanation }}
            </p>
          </div>
        </div>
      </div>

      <!-- Individual Exercise Action -->
      <div v-if="!exerciseResults[exercise.id] && userAnswers[exercise.id]" class="mt-4">
        <UiButton
          @click="checkSingleExercise(exercise)"
          :loading="loading"
          loading-text="Checking..."
          variant="primary"
          size="sm"
        >
          Check Answer
        </UiButton>
      </div>
    </div>

    <!-- Overall Actions -->
    <div class="flex justify-between items-center pt-6 border-t border-gray-200">
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">
          Progress: {{ completedCount }}/{{ exercises.length }} exercises
        </span>
        <div v-if="overallScore !== null" class="text-sm font-medium text-blue-600">
          Overall Score: {{ overallScore }}%
        </div>
      </div>
      
      <div class="flex space-x-3">
        <UiButton
          @click="checkAllExercises"
          :disabled="loading || !hasAnswers"
          :loading="loading"
          loading-text="Checking..."
          variant="secondary"
        >
          Check All Answers
        </UiButton>
        <UiButton
          @click="resetExercises"
          v-if="hasResults"
          variant="secondary"
        >
          Try Again
        </UiButton>
        <UiButton
          @click="completeExercises"
          :disabled="loading || !allCompleted"
          variant="primary"
        >
          {{ allCompleted ? 'Complete Lesson' : 'Complete All First' }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import type { Exercise } from '@/types'

interface ExerciseResult {
  isCorrect: boolean
  score: number
  userAnswer: string
  aiExplanation?: {
    explanation: string
    tips: string[]
    relatedConcepts: string[]
  }
}

interface Props {
  exercises: Exercise[]
  lessonId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  complete: [score: number]
}>()

const toast = useToast()
const user = useSupabaseUser()
const learningStore = useLearningStore()
const aiService = useAI()

const userAnswers = ref<Record<string, string>>({})
const exerciseResults = ref<Record<string, ExerciseResult>>({})
const currentExercise = ref<string | null>(null)
const loading = ref(false)

const completedCount = computed(() => Object.keys(exerciseResults.value).length)
const hasAnswers = computed(() => Object.keys(userAnswers.value).some(key => userAnswers.value[key]?.trim()))
const hasResults = computed(() => Object.keys(exerciseResults.value).length > 0)
const allCompleted = computed(() => completedCount.value === props.exercises.length)

const overallScore = computed(() => {
  if (completedCount.value === 0) return null
  const totalScore = Object.values(exerciseResults.value).reduce((sum, result) => sum + result.score, 0)
  return Math.round(totalScore / completedCount.value)
})

const checkSingleExercise = async (exercise: Exercise) => {
  const userAnswer = userAnswers.value[exercise.id]?.trim()
  if (!userAnswer) return

  loading.value = true
  try {
    const result = evaluateAnswer(exercise, userAnswer)
    
    // Get AI explanation for the answer
    try {
      const aiExplanation = await aiService.explainAnswer(
        exercise.question,
        userAnswer,
        exercise.correct_answer,
        exercise.type,
        'intermediate', // You could get this from user profile
        exercise.options
      )
      
      result.aiExplanation = {
        explanation: aiExplanation.explanation,
        tips: aiExplanation.tips,
        relatedConcepts: aiExplanation.relatedConcepts
      }
    } catch (aiError) {
      console.warn('AI explanation failed, using fallback:', aiError)
      // Continue without AI explanation - the basic explanation will still work
    }
    
    exerciseResults.value[exercise.id] = result

    // Save progress to database
    if (user.value) {
      await learningStore.updateProgress({
        user_id: user.value?.id,
        lesson_id: props.lessonId,
        exercise_id: exercise.id,
        completed: true,
        score: result.score,
        completed_at: new Date().toISOString()
      })
    }

    // Show enhanced feedback
    if (result.isCorrect) {
      toast.success('Correct!', result.aiExplanation?.explanation || exercise.explanation || 'Well done!')
    } else {
      toast.error('Incorrect', 'Check the AI explanation below for detailed feedback.')
    }

  } catch (error) {
    toast.error('Error', 'Failed to check answer. Please try again.')
  } finally {
    loading.value = false
  }
}

const checkAllExercises = async () => {
  loading.value = true
  try {
    for (const exercise of props.exercises) {
      const userAnswer = userAnswers.value[exercise.id]?.trim()
      if (userAnswer && !exerciseResults.value[exercise.id]) {
        const result = evaluateAnswer(exercise, userAnswer)
        exerciseResults.value[exercise.id] = result

        // Save progress to database
        if (user.value) {
          await learningStore.updateProgress({
            user_id: user.value?.id,
            lesson_id: props.lessonId,
            exercise_id: exercise.id,
            completed: true,
            score: result.score,
            completed_at: new Date().toISOString()
          })
        }
      }
    }

    const score = overallScore.value || 0
    toast.success('Exercises Complete!', `Your score: ${score}%`)

  } catch (error) {
    toast.error('Error', 'Failed to check exercises. Please try again.')
  } finally {
    loading.value = false
  }
}

const evaluateAnswer = (exercise: Exercise, userAnswer: string): ExerciseResult => {
  const correctAnswer = exercise.correct_answer.toLowerCase().trim()
  const answer = userAnswer.toLowerCase().trim()

  let isCorrect = false
  let score = 0

  switch (exercise.type) {
    case 'multiple_choice':
      isCorrect = answer === correctAnswer
      score = isCorrect ? 100 : 0
      break

    case 'fill_blank':
      isCorrect = answer === correctAnswer
      score = isCorrect ? 100 : 0
      break

    case 'translation':
      // For translations, we use a more flexible matching system
      isCorrect = calculateTranslationScore(answer, correctAnswer) >= 70
      score = calculateTranslationScore(answer, correctAnswer)
      break

    case 'listening':
      isCorrect = answer === correctAnswer
      score = isCorrect ? 100 : 0
      break
  }

  return {
    isCorrect,
    score,
    userAnswer
  }
}

const calculateTranslationScore = (userAnswer: string, correctAnswer: string): number => {
  // Simple similarity calculation for translations
  const userWords = userAnswer.split(/\s+/).filter(word => word.length > 0)
  const correctWords = correctAnswer.split(/\s+/).filter(word => word.length > 0)
  
  if (userWords.length === 0) return 0
  
  let matchingWords = 0
  for (const word of userWords) {
    if (correctWords.includes(word)) {
      matchingWords++
    }
  }
  
  // Calculate score based on word overlap and length similarity
  const wordScore = (matchingWords / Math.max(userWords.length, correctWords.length)) * 100
  const lengthScore = Math.max(0, 100 - Math.abs(userWords.length - correctWords.length) * 10)
  
  return Math.round((wordScore + lengthScore) / 2)
}

const resetExercises = () => {
  userAnswers.value = {}
  exerciseResults.value = {}
  currentExercise.value = null
  toast.info('Reset Complete', 'Try the exercises again!')
}

const completeExercises = async () => {
  if (!allCompleted.value) return
  
  const finalScore = overallScore.value || 0
  emit('complete', finalScore)
  
  toast.success('Lesson Complete!', `Great job! Your final score: ${finalScore}%`)
}

// Initialize answers object
onMounted(() => {
  for (const exercise of props.exercises) {
    userAnswers.value[exercise.id] = ''
  }
})
</script>

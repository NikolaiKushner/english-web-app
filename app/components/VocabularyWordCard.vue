<template>
  <UiCard variant="default" padding="lg" class="h-full">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ word.word }}</h3>
        <div class="flex items-center space-x-2 mb-2">
          <UiBadge :variant="levelVariant" size="xs">
            {{ word.difficulty_level }}
          </UiBadge>
          <UiBadge variant="secondary" size="xs">
            {{ word.part_of_speech }}
          </UiBadge>
          <span class="text-sm text-gray-500">{{ word.category.replace('_', ' ') }}</span>
        </div>
        <div v-if="word.pronunciation" class="text-sm text-gray-600 mb-2">
          <span class="font-mono">{{ word.pronunciation }}</span>
          <button v-if="word.audio_url" @click="playAudio" class="ml-2 text-blue-600 hover:text-blue-700">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6v-6z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Favorite button for user's words -->
      <button
        v-if="userVocabulary"
        @click="toggleFavorite"
        class="text-gray-400 hover:text-yellow-500 transition-colors"
        :class="{ 'text-yellow-500': userVocabulary.is_favorite }"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </button>
    </div>

    <div class="mb-4">
      <p class="text-gray-700 mb-3">{{ word.definition }}</p>
      <div class="bg-gray-50 rounded-lg p-3">
        <p class="text-sm text-gray-600 italic">
          <span class="font-medium">Example:</span> {{ word.example_sentence }}
        </p>
      </div>
    </div>

    <!-- User progress indicator -->
    <div v-if="userVocabulary" class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-600">Mastery Level</span>
        <span class="text-sm font-medium" :class="masteryColor">
          {{ masteryText }}
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="masteryBarColor"
          :style="{ width: `${(userVocabulary.mastery_level / 5) * 100}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>Reviewed {{ userVocabulary.times_reviewed }} times</span>
        <span v-if="userVocabulary.next_review">
          Next: {{ formatDate(userVocabulary.next_review) }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex space-x-2">
      <UiButton
        v-if="!userVocabulary"
        @click="addToVocabulary"
        variant="primary"
        size="sm"
        class="flex-1"
      >
        <template #icon-left>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </template>
        Add to Vocabulary
      </UiButton>
      
      <UiButton
        v-else
        @click="reviewWord"
        variant="secondary"
        size="sm"
        class="flex-1"
      >
        <template #icon-left>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </template>
        Review
      </UiButton>

      <UiButton
        @click="showDetails"
        variant="ghost"
        size="sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </UiButton>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { VocabularyWord, UserVocabulary } from '@/types'

interface Props {
  word: VocabularyWord
  userVocabulary?: UserVocabulary
}

const props = defineProps<Props>()
const emit = defineEmits<{
  addToVocabulary: [wordId: string]
  toggleFavorite: [userVocabularyId: string, isFavorite: boolean]
  reviewWord: [word: VocabularyWord, userVocabulary: UserVocabulary]
  showDetails: [word: VocabularyWord]
}>()

// Computed properties
const levelVariant = computed(() => {
  switch (props.word.difficulty_level) {
    case 'beginner': return 'success'
    case 'intermediate': return 'warning'
    case 'advanced': return 'danger'
    default: return 'secondary'
  }
})

const masteryText = computed(() => {
  if (!props.userVocabulary) return ''
  
  const level = props.userVocabulary.mastery_level
  if (level === 0) return 'New'
  if (level === 1) return 'Learning'
  if (level === 2) return 'Familiar'
  if (level === 3) return 'Known'
  if (level === 4) return 'Well Known'
  if (level === 5) return 'Mastered'
  return 'Unknown'
})

const masteryColor = computed(() => {
  if (!props.userVocabulary) return 'text-gray-500'
  
  const level = props.userVocabulary.mastery_level
  if (level === 0) return 'text-gray-500'
  if (level <= 2) return 'text-yellow-600'
  if (level <= 4) return 'text-blue-600'
  return 'text-green-600'
})

const masteryBarColor = computed(() => {
  if (!props.userVocabulary) return 'bg-gray-300'
  
  const level = props.userVocabulary.mastery_level
  if (level === 0) return 'bg-gray-300'
  if (level <= 2) return 'bg-yellow-400'
  if (level <= 4) return 'bg-blue-400'
  return 'bg-green-400'
})

// Methods
const addToVocabulary = () => {
  emit('addToVocabulary', props.word.id)
}

const toggleFavorite = () => {
  if (props.userVocabulary) {
    emit('toggleFavorite', props.userVocabulary.id, !props.userVocabulary.is_favorite)
  }
}

const reviewWord = () => {
  if (props.userVocabulary) {
    emit('reviewWord', props.word, props.userVocabulary)
  }
}

const showDetails = () => {
  emit('showDetails', props.word)
}

const playAudio = () => {
  if (props.word.audio_url) {
    const audio = new Audio(props.word.audio_url)
    audio.play().catch(console.error)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1) return `in ${diffDays} days`
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`
  
  return date.toLocaleDateString()
}
</script>

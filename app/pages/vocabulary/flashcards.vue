<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Vocabulary Flashcards</h1>
          <p class="text-lg text-gray-600">
            Review your vocabulary using spaced repetition
          </p>
        </div>
        <UiButton to="/vocabulary" variant="secondary">
          ← Back to Dictionary
        </UiButton>
      </div>
    </div>

    <!-- Session Setup -->
    <div v-if="!sessionActive" class="space-y-6">
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-red-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-red-600">{{ reviewStats.dueForReview }}</div>
          <div class="text-sm text-red-700">Due for Review</div>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ reviewStats.learning }}</div>
          <div class="text-sm text-yellow-700">Learning</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ reviewStats.mastered }}</div>
          <div class="text-sm text-green-700">Mastered</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-purple-600">{{ reviewStats.favorites }}</div>
          <div class="text-sm text-purple-700">Favorites</div>
        </div>
      </div>

      <!-- Session Options -->
      <UiCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900">Start Review Session</h2>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiSelect
              v-model="sessionType"
              label="Session Type"
              :options="[
                { label: 'Due for Review', value: 'due' },
                { label: 'Learning Words', value: 'learning' },
                { label: 'Favorites', value: 'favorites' },
                { label: 'All My Words', value: 'all' },
                { label: 'Random Mix', value: 'random' }
              ]"
            />

            <UiSelect
              v-model="sessionSize"
              label="Number of Cards"
              :options="[
                { label: '10 cards', value: 10 },
                { label: '20 cards', value: 20 },
                { label: '30 cards', value: 30 },
                { label: '50 cards', value: 50 }
              ]"
            />
          </div>

          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              {{ getSessionDescription() }}
            </div>
            <UiButton 
              @click="startSession" 
              :disabled="!canStartSession"
              variant="primary"
            >
              Start Session
            </UiButton>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Active Session -->
    <div v-else class="space-y-6">
      <!-- Progress Bar -->
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Progress</span>
          <span class="text-sm font-medium text-gray-900">
            {{ currentCardIndex + 1 }} / {{ sessionCards.length }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentCardIndex + 1) / sessionCards.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Flashcard -->
      <div class="flex justify-center">
        <div 
          class="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-gray-200 cursor-pointer transform transition-transform hover:scale-105"
          :class="{ 'rotate-y-180': isFlipped }"
          @click="flipCard"
          style="height: 400px; perspective: 1000px;"
        >
          <!-- Front of card (Word) -->
          <div 
            v-show="!isFlipped"
            class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center backface-hidden"
          >
            <div class="mb-4">
              <UiBadge :variant="levelVariant" size="sm">
                {{ currentCard?.word?.difficulty_level }}
              </UiBadge>
            </div>
            
            <h2 class="text-4xl font-bold text-gray-900 mb-4">
              {{ currentCard?.word?.word }}
            </h2>
            
            <div v-if="currentCard?.word?.pronunciation" class="mb-6">
              <span class="text-lg text-gray-600 font-mono">
                {{ currentCard.word.pronunciation }}
              </span>
              <button 
                v-if="currentCard.word.audio_url" 
                @click.stop="playAudio"
                class="ml-2 text-blue-600 hover:text-blue-700"
              >
                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6v-6z"></path>
                </svg>
              </button>
            </div>

            <div class="text-sm text-gray-500">
              Tap to see definition
            </div>
          </div>

          <!-- Back of card (Definition) -->
          <div 
            v-show="isFlipped"
            class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center backface-hidden rotate-y-180"
          >
            <div class="mb-4">
              <UiBadge variant="secondary" size="sm">
                {{ currentCard?.word?.part_of_speech }}
              </UiBadge>
            </div>

            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              {{ currentCard?.word?.word }}
            </h3>
            
            <p class="text-lg text-gray-700 mb-6 leading-relaxed">
              {{ currentCard?.word?.definition }}
            </p>
            
            <div class="bg-gray-50 rounded-lg p-4 w-full">
              <p class="text-sm text-gray-600 italic">
                <span class="font-medium">Example:</span><br>
                {{ currentCard?.word?.example_sentence }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="isFlipped" class="flex justify-center space-x-4">
        <UiButton 
          @click="markAnswer(false)"
          variant="danger"
          size="lg"
          class="px-8"
        >
          <template #icon-left>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </template>
          Don't Know
        </UiButton>
        
        <UiButton 
          @click="markAnswer(true)"
          variant="success"
          size="lg"
          class="px-8"
        >
          <template #icon-left>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </template>
          Know It
        </UiButton>
      </div>

      <!-- Session Controls -->
      <div class="flex justify-between items-center">
        <UiButton @click="endSession" variant="secondary">
          End Session
        </UiButton>
        
        <div class="text-sm text-gray-600">
          {{ sessionStats.correct }} correct, {{ sessionStats.incorrect }} incorrect
        </div>
        
        <UiButton 
          v-if="!isFlipped"
          @click="skipCard"
          variant="ghost"
        >
          Skip Card
        </UiButton>
      </div>
    </div>

    <!-- Session Complete -->
    <UiModal v-model="showResults" title="Session Complete!" :closeable="false">
      <div class="text-center space-y-4">
        <div class="text-6xl">🎉</div>
        
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-gray-900">Great job!</h3>
          <p class="text-gray-600">You completed {{ sessionCards.length }} cards</p>
        </div>

        <div class="grid grid-cols-2 gap-4 my-6">
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600">{{ sessionStats.correct }}</div>
            <div class="text-sm text-green-700">Correct</div>
          </div>
          <div class="bg-red-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-red-600">{{ sessionStats.incorrect }}</div>
            <div class="text-sm text-red-700">Incorrect</div>
          </div>
        </div>

        <div class="flex space-x-3">
          <UiButton @click="startNewSession" variant="primary" class="flex-1">
            New Session
          </UiButton>
          <UiButton @click="goToDictionary" variant="secondary" class="flex-1">
            Dictionary
          </UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { UserVocabulary } from '@/types'

const vocabularyStore = useVocabularyStore()
const user = useSupabaseUser()
const toast = useToast()
const router = useRouter()

// Session state
const sessionActive = ref(false)
const sessionType = ref('due')
const sessionSize = ref(20)
const sessionCards = ref<UserVocabulary[]>([])
const currentCardIndex = ref(0)
const isFlipped = ref(false)
const showResults = ref(false)

// Session stats
const sessionStats = ref({
  correct: 0,
  incorrect: 0
})

// Computed properties
const userVocabulary = computed(() => vocabularyStore.userVocabulary)

const reviewStats = computed(() => {
  if (!user.value) return { dueForReview: 0, learning: 0, mastered: 0, favorites: 0 }
  return vocabularyStore.getVocabularyStats(user.value?.id)
})

const currentCard = computed(() => {
  return sessionCards.value[currentCardIndex.value]
})

const levelVariant = computed(() => {
  const level = currentCard.value?.word?.difficulty_level
  switch (level) {
    case 'beginner': return 'success'
    case 'intermediate': return 'warning'
    case 'advanced': return 'danger'
    default: return 'secondary'
  }
})

const canStartSession = computed(() => {
  return getAvailableCards().length > 0
})

// Methods
const getSessionDescription = () => {
  const available = getAvailableCards().length
  const requested = sessionSize.value
  
  if (available === 0) {
    return 'No cards available for this session type'
  }
  
  const actual = Math.min(available, requested)
  return `${actual} cards available (${available} total for this type)`
}

const getAvailableCards = () => {
  if (!user.value) return []
  
  const userId = user.value?.id
  
  switch (sessionType.value) {
    case 'due':
      return vocabularyStore.getWordsForReview(userId)
    case 'learning':
      return vocabularyStore.getWordsByMastery(userId, 1).concat(
        vocabularyStore.getWordsByMastery(userId, 2)
      )
    case 'favorites':
      return vocabularyStore.getFavoriteWords(userId)
    case 'all':
      return userVocabulary.value.filter(v => v.user_id === userId)
    case 'random':
      const allWords = userVocabulary.value.filter(v => v.user_id === userId)
      return allWords.sort(() => Math.random() - 0.5)
    default:
      return []
  }
}

const startSession = () => {
  const availableCards = getAvailableCards()
  const actualSize = Math.min(sessionSize.value, availableCards.length)
  
  sessionCards.value = availableCards.slice(0, actualSize)
  currentCardIndex.value = 0
  isFlipped.value = false
  sessionActive.value = true
  sessionStats.value = { correct: 0, incorrect: 0 }
  
  toast.success('Session Started!', `Reviewing ${sessionCards.value.length} cards`)
}

const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

const markAnswer = async (isCorrect: boolean) => {
  const card = currentCard.value
  if (!card) return

  // Update session stats
  if (isCorrect) {
    sessionStats.value.correct++
  } else {
    sessionStats.value.incorrect++
  }

  // Update word progress in database
  await vocabularyStore.updateWordProgress(
    card.id,
    isCorrect,
    card.mastery_level
  )

  // Move to next card
  nextCard()
}

const nextCard = () => {
  if (currentCardIndex.value < sessionCards.value.length - 1) {
    currentCardIndex.value++
    isFlipped.value = false
  } else {
    // Session complete
    endSession(true)
  }
}

const skipCard = () => {
  nextCard()
}

const endSession = (showResultsModal = false) => {
  sessionActive.value = false
  
  if (showResultsModal) {
    showResults.value = true
  } else {
    toast.info('Session Ended', `You reviewed ${currentCardIndex.value + 1} cards`)
  }
}

const startNewSession = () => {
  showResults.value = false
  // Reset to setup screen
}

const goToDictionary = () => {
  router.push('/vocabulary')
}

const playAudio = () => {
  const audioUrl = currentCard.value?.word?.audio_url
  if (audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play().catch(console.error)
  }
}

// Initialize
onMounted(async () => {
  if (!user.value) {
    toast.warning('Login Required', 'Please log in to use flashcards')
    router.push('/auth/login')
    return
  }

  await vocabularyStore.fetchUserVocabulary(user.value?.id)
})

// Set page meta
useHead({
  title: 'Vocabulary Flashcards - English Learning Platform',
  meta: [
    { name: 'description', content: 'Review your vocabulary using spaced repetition flashcards.' }
  ]
})
</script>

<style scoped>
.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>

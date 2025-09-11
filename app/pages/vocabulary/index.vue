<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Vocabulary Dictionary</h1>
          <p class="text-lg text-gray-600">
            Build your English vocabulary with spaced repetition learning
          </p>
        </div>
        <div class="flex space-x-3">
          <UiButton to="/vocabulary/flashcards" variant="secondary" v-if="user">
            Flashcards
          </UiButton>
        </div>
      </div>
    </div>

    <!-- User Stats (if logged in) -->
    <div v-if="user" class="mb-8">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ vocabularyStats.total }}</div>
          <div class="text-sm text-blue-700">Total Words</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ vocabularyStats.mastered }}</div>
          <div class="text-sm text-green-700">Mastered</div>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ vocabularyStats.learning }}</div>
          <div class="text-sm text-yellow-700">Learning</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-purple-600">{{ vocabularyStats.new }}</div>
          <div class="text-sm text-purple-700">New</div>
        </div>
        <div class="bg-red-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-red-600">{{ vocabularyStats.dueForReview }}</div>
          <div class="text-sm text-red-700">Due for Review</div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <UiCard class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UiInput
          v-model="searchQuery"
          placeholder="Search words..."
          @input="debouncedSearch"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </template>
        </UiInput>

        <UiSelect
          v-model="selectedLevel"
          placeholder="All Levels"
          :options="[
            { label: 'All Levels', value: '' },
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' }
          ]"
          @update:modelValue="fetchWords"
        />

        <UiSelect
          v-model="selectedCategory"
          placeholder="All Categories"
          :options="categoryOptions"
          @update:modelValue="fetchWords"
        />

        <div class="flex space-x-2">
          <UiButton @click="clearFilters" variant="secondary" size="sm" class="flex-1">
            Clear Filters
          </UiButton>
          <UiButton v-if="user" @click="showMyWordsOnly = !showMyWordsOnly" 
                   :variant="showMyWordsOnly ? 'primary' : 'secondary'" 
                   size="sm" class="flex-1">
            {{ showMyWordsOnly ? 'All Words' : 'My Words' }}
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- Words Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <UiSpinner size="lg" />
    </div>

    <div v-else-if="displayedWords.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No words found</h3>
      <p class="text-gray-600">Try adjusting your search or filters.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <VocabularyWordCard
        v-for="word in displayedWords"
        :key="word.id"
        :word="word"
        :user-vocabulary="getUserWordData(word.id)"
        @add-to-vocabulary="handleAddWord"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="displayedWords.length < filteredWords.length" class="text-center mt-8">
      <UiButton @click="loadMore" variant="secondary">
        Load More Words ({{ filteredWords.length - displayedWords.length }} remaining)
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const user = useSupabaseUser()
const vocabularyStore = useVocabularyStore()
const toast = useToast()

// Reactive state
const searchQuery = ref('')
const selectedLevel = ref('')
const selectedCategory = ref('')
const showMyWordsOnly = ref(false)
const wordsPerPage = 12
const currentPage = ref(1)

// Computed properties
const loading = computed(() => vocabularyStore.loading)
const words = computed(() => vocabularyStore.words)
const userVocabulary = computed(() => vocabularyStore.userVocabulary)

const vocabularyStats = computed(() => {
  if (!user.value) return { total: 0, mastered: 0, learning: 0, new: 0, favorites: 0, dueForReview: 0 }
  return vocabularyStore.getVocabularyStats(user.value?.id)
})

const categoryOptions = computed(() => {
  const categories = vocabularyStore.getCategories()
  return [
    { label: 'All Categories', value: '' },
    ...categories.map(cat => ({ 
      label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '), 
      value: cat 
    }))
  ]
})

const filteredWords = computed(() => {
  let filtered = words.value

  if (showMyWordsOnly.value && user.value) {
    const myWordIds = userVocabulary.value.map(uv => uv.word_id)
    filtered = filtered.filter(word => myWordIds.includes(word.id))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(word => 
      word.word.toLowerCase().includes(query) ||
      word.definition.toLowerCase().includes(query)
    )
  }

  return filtered
})

const displayedWords = computed(() => {
  const endIndex = currentPage.value * wordsPerPage
  return filteredWords.value.slice(0, endIndex)
})

// Methods
const fetchWords = async () => {
  await vocabularyStore.fetchVocabularyWords({
    level: selectedLevel.value || undefined,
    category: selectedCategory.value || undefined,
    limit: 100
  })
}

const fetchUserVocabulary = async () => {
  if (user.value) {
    await vocabularyStore.fetchUserVocabulary(user.value?.id)
  }
}

const getUserWordData = (wordId: string) => {
  return userVocabulary.value.find(uv => uv.word_id === wordId)
}

const handleAddWord = async (wordId: string) => {
  if (!user.value) {
    toast.warning('Login Required', 'Please log in to add words to your vocabulary')
    return
  }

  const result = await vocabularyStore.addWordToUserVocabulary(user.value?.id, wordId)
  if (result.error) {
    toast.error('Error', 'Failed to add word to your vocabulary')
  } else {
    toast.success('Word Added!', 'Word added to your personal vocabulary')
  }
}

const handleToggleFavorite = async (userVocabularyId: string, isFavorite: boolean) => {
  const result = await vocabularyStore.toggleFavorite(userVocabularyId, isFavorite)
  if (result.error) {
    toast.error('Error', 'Failed to update favorite status')
  } else {
    toast.success('Updated!', isFavorite ? 'Added to favorites' : 'Removed from favorites')
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedLevel.value = ''
  selectedCategory.value = ''
  showMyWordsOnly.value = false
  currentPage.value = 1
  fetchWords()
}

const loadMore = () => {
  currentPage.value++
}

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
}, 300)

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchWords(),
    fetchUserVocabulary()
  ])
})

// Watch for auth changes
watch(() => user.value, async (newUser) => {
  if (newUser) {
    await fetchUserVocabulary()
  }
})

// Set page meta
useHead({
  title: 'Vocabulary Dictionary - English Learning Platform',
  meta: [
    { name: 'description', content: 'Build your English vocabulary with our comprehensive dictionary and spaced repetition system.' }
  ]
})
</script>

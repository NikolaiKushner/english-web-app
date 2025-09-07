import { defineStore } from 'pinia'
import type { VocabularyWord, UserVocabulary } from '@/types'

export const useVocabularyStore = defineStore('vocabulary', () => {
  const words = ref<VocabularyWord[]>([])
  const userVocabulary = ref<UserVocabulary[]>([])
  const loading = ref(false)
  const { supabase } = useSupabase()

  const fetchVocabularyWords = async (filters?: {
    level?: string
    category?: string
    search?: string
    limit?: number
  }) => {
    loading.value = true
    try {
      let query = supabase
        .from('vocabulary_words')
        .select('*')
        .order('word', { ascending: true })

      if (filters?.level) {
        query = query.eq('difficulty_level', filters.level)
      }

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.search) {
        query = query.or(`word.ilike.%${filters.search}%,definition.ilike.%${filters.search}%`)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error
      words.value = data || []
      return { data: words.value, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const fetchUserVocabulary = async (userId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('user_vocabulary')
        .select(`
          *,
          word:vocabulary_words(*)
        `)
        .eq('user_id', userId)
        .order('last_reviewed', { ascending: false })

      if (error) throw error
      userVocabulary.value = data || []
      return { data: userVocabulary.value, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const addWordToUserVocabulary = async (userId: string, wordId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('user_vocabulary')
        .upsert({
          user_id: userId,
          word_id: wordId,
          mastery_level: 0,
          times_reviewed: 0,
          next_review: new Date().toISOString()
        })
        .select(`
          *,
          word:vocabulary_words(*)
        `)
        .single()

      if (error) throw error

      // Update local state
      const existingIndex = userVocabulary.value.findIndex(v => v.word_id === wordId)
      if (existingIndex !== -1) {
        userVocabulary.value[existingIndex] = data
      } else {
        userVocabulary.value.unshift(data)
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const updateWordProgress = async (
    userVocabularyId: string,
    isCorrect: boolean,
    currentMastery: number
  ) => {
    loading.value = true
    try {
      // Calculate new mastery level (0-5 scale)
      let newMastery = currentMastery
      if (isCorrect) {
        newMastery = Math.min(5, currentMastery + 1)
      } else {
        newMastery = Math.max(0, currentMastery - 1)
      }

      // Calculate next review date using spaced repetition
      const intervals = [1, 3, 7, 14, 30, 90] // days
      const nextReviewDays = intervals[newMastery] || 1
      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + nextReviewDays)

      const { data, error } = await supabase
        .from('user_vocabulary')
        .update({
          mastery_level: newMastery,
          times_reviewed: supabase.sql`times_reviewed + 1`,
          last_reviewed: new Date().toISOString(),
          next_review: nextReview.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userVocabularyId)
        .select(`
          *,
          word:vocabulary_words(*)
        `)
        .single()

      if (error) throw error

      // Update local state
      const index = userVocabulary.value.findIndex(v => v.id === userVocabularyId)
      if (index !== -1) {
        userVocabulary.value[index] = data
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async (userVocabularyId: string, isFavorite: boolean) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('user_vocabulary')
        .update({ is_favorite: isFavorite })
        .eq('id', userVocabularyId)
        .select(`
          *,
          word:vocabulary_words(*)
        `)
        .single()

      if (error) throw error

      // Update local state
      const index = userVocabulary.value.findIndex(v => v.id === userVocabularyId)
      if (index !== -1) {
        userVocabulary.value[index] = data
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const getWordsForReview = (userId: string) => {
    const now = new Date()
    return userVocabulary.value.filter(v => 
      v.user_id === userId && 
      new Date(v.next_review) <= now
    ).sort((a, b) => new Date(a.next_review).getTime() - new Date(b.next_review).getTime())
  }

  const getFavoriteWords = (userId: string) => {
    return userVocabulary.value.filter(v => 
      v.user_id === userId && v.is_favorite
    )
  }

  const getWordsByMastery = (userId: string, masteryLevel: number) => {
    return userVocabulary.value.filter(v => 
      v.user_id === userId && v.mastery_level === masteryLevel
    )
  }

  const getVocabularyStats = (userId: string) => {
    const userWords = userVocabulary.value.filter(v => v.user_id === userId)
    
    return {
      total: userWords.length,
      mastered: userWords.filter(v => v.mastery_level >= 4).length,
      learning: userWords.filter(v => v.mastery_level >= 1 && v.mastery_level < 4).length,
      new: userWords.filter(v => v.mastery_level === 0).length,
      favorites: userWords.filter(v => v.is_favorite).length,
      dueForReview: getWordsForReview(userId).length
    }
  }

  const searchWords = async (query: string, filters?: {
    level?: string
    category?: string
    limit?: number
  }) => {
    return fetchVocabularyWords({
      search: query,
      ...filters
    })
  }

  const getCategories = () => {
    const categories = [...new Set(words.value.map(w => w.category))]
    return categories.sort()
  }

  return {
    words: readonly(words),
    userVocabulary: readonly(userVocabulary),
    loading: readonly(loading),
    fetchVocabularyWords,
    fetchUserVocabulary,
    addWordToUserVocabulary,
    updateWordProgress,
    toggleFavorite,
    getWordsForReview,
    getFavoriteWords,
    getWordsByMastery,
    getVocabularyStats,
    searchWords,
    getCategories
  }
})

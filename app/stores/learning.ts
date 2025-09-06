import { defineStore } from 'pinia'
import type { Lesson, Exercise, UserProgress, UserProfile } from '~/types'

export const useLearningStore = defineStore('learning', () => {
  const lessons = ref<Lesson[]>([])
  const exercises = ref<Exercise[]>([])
  const userProgress = ref<UserProgress[]>([])
  const userProfile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const { supabase } = useSupabase()

  const fetchLessons = async (level?: string) => {
    loading.value = true
    try {
      let query = supabase
        .from('lessons')
        .select('*')
        .order('order', { ascending: true })
      
      if (level) {
        query = query.eq('level', level)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      lessons.value = data || []
      return { data: lessons.value, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const fetchLesson = async (id: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const fetchExercises = async (lessonId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order', { ascending: true })
      
      if (error) throw error
      exercises.value = data || []
      return { data: exercises.value, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const fetchUserProgress = async (userId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
      
      if (error) throw error
      userProgress.value = data || []
      return { data: userProgress.value, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const fetchUserProfile = async (userId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      userProfile.value = data
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const updateProgress = async (progressData: Partial<UserProgress>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(progressData)
        .select()
        .single()
      
      if (error) throw error
      
      // Update local state
      const index = userProgress.value.findIndex(p => p.id === data.id)
      if (index !== -1) {
        userProgress.value[index] = data
      } else {
        userProgress.value.push(data)
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const getLessonProgress = (lessonId: string) => {
    return userProgress.value.filter(p => p.lesson_id === lessonId)
  }

  const isLessonCompleted = (lessonId: string) => {
    const lessonProgress = getLessonProgress(lessonId)
    return lessonProgress.some(p => p.completed && !p.exercise_id)
  }

  const getExerciseProgress = (exerciseId: string) => {
    return userProgress.value.find(p => p.exercise_id === exerciseId)
  }

  return {
    lessons: readonly(lessons),
    exercises: readonly(exercises),
    userProgress: readonly(userProgress),
    userProfile: readonly(userProfile),
    loading: readonly(loading),
    fetchLessons,
    fetchLesson,
    fetchExercises,
    fetchUserProgress,
    fetchUserProfile,
    updateProgress,
    getLessonProgress,
    isLessonCompleted,
    getExerciseProgress
  }
})

import { defineStore } from 'pinia'
import type { Lesson, Exercise, UserProgress, UserProfile } from '@/types'

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

  const getLessonScore = (lessonId: string) => {
    const lessonProgress = getLessonProgress(lessonId)
    const exerciseProgress = lessonProgress.filter(p => p.exercise_id && p.completed)
    
    if (exerciseProgress.length === 0) return null
    
    const totalScore = exerciseProgress.reduce((sum, p) => sum + (p.score || 0), 0)
    return Math.round(totalScore / exerciseProgress.length)
  }

  const getOverallProgress = () => {
    const completedLessons = userProgress.value.filter(p => p.completed && !p.exercise_id).length
    const totalLessons = lessons.value.length
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  const getStreakDays = () => {
    if (!userProfile.value) return 0
    
    const lastActivity = userProfile.value.last_activity
    if (!lastActivity) return 0
    
    const lastActivityDate = new Date(lastActivity)
    const today = new Date()
    const diffTime = today.getTime() - lastActivityDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // If last activity was today or yesterday, maintain streak
    if (diffDays <= 1) {
      return userProfile.value.streak_days
    } else {
      return 0 // Streak broken
    }
  }

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData)
        .select()
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

  const getRecentActivity = (limit: number = 10) => {
    return userProgress.value
      .filter(p => p.completed && p.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
      .slice(0, limit)
  }

  const getLessonsByLevel = (level: string) => {
    return lessons.value.filter(lesson => lesson.level === level)
  }

  const getCompletedLessonsByLevel = (level: string) => {
    const levelLessons = getLessonsByLevel(level)
    return levelLessons.filter(lesson => isLessonCompleted(lesson.id))
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
    updateUserProfile,
    getLessonProgress,
    isLessonCompleted,
    getExerciseProgress,
    getLessonScore,
    getOverallProgress,
    getStreakDays,
    getRecentActivity,
    getLessonsByLevel,
    getCompletedLessonsByLevel
  }
})

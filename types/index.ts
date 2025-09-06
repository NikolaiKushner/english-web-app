export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  order: number
  created_at: string
  updated_at: string
}

export interface Exercise {
  id: string
  lesson_id: string
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening'
  question: string
  options?: string[]
  correct_answer: string
  explanation?: string
  order: number
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  exercise_id?: string
  completed: boolean
  score?: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  current_level: 'beginner' | 'intermediate' | 'advanced'
  total_lessons_completed: number
  total_exercises_completed: number
  streak_days: number
  last_activity: string
  created_at: string
  updated_at: string
}

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

export interface VocabularyWord {
  id: string
  word: string
  definition: string
  pronunciation?: string
  part_of_speech: string
  example_sentence: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  audio_url?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface UserVocabulary {
  id: string
  user_id: string
  word_id: string
  mastery_level: number // 0-5 scale
  times_reviewed: number
  last_reviewed: string
  next_review: string
  is_favorite: boolean
  created_at: string
  updated_at: string
  word?: VocabularyWord
}

export interface LessonContent {
  id: string
  lesson_id: string
  type: 'text' | 'image' | 'video' | 'audio' | 'interactive'
  content: string
  order: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

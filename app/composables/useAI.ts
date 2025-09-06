export interface GeneratedExercise {
  question: string
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening'
  options?: string[]
  correct_answer: string
  explanation: string
  difficulty_level: string
}

export interface AIExplanation {
  explanation: string
  isCorrect: boolean
  tips: string[]
  relatedConcepts: string[]
}

export interface AIFeedback {
  motivationalMessage: string
  specificFeedback: string
  nextSteps: string[]
  recommendedTopics: string[]
  studyTips: string[]
}

export const useAI = () => {
  const toast = useToast()
  const loading = ref(false)

  const generateExercises = async (
    topic: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening',
    count: number = 1
  ): Promise<GeneratedExercise[]> => {
    loading.value = true
    try {
      const { data } = await $fetch('/api/ai/generate-exercise', {
        method: 'POST',
        body: {
          topic,
          level,
          type,
          count
        }
      })

      if (!data.success) {
        throw new Error('Failed to generate exercises')
      }

      toast.success('Exercises Generated!', `Created ${data.exercises.length} AI-powered exercise${data.exercises.length > 1 ? 's' : ''}`)
      return data.exercises
    } catch (error: any) {
      console.error('Exercise generation error:', error)
      
      // Handle quota errors specifically
      if (error.statusCode === 429 || error.message?.includes('quota')) {
        toast.error('AI Quota Exceeded', 'Please check your OpenAI billing or try again later. Basic features still work!')
      } else if (error.statusCode === 401) {
        toast.error('AI Configuration Error', 'OpenAI API key needs to be configured. Contact administrator.')
      } else {
        toast.error('AI Service Unavailable', 'AI features are temporarily down. Basic learning features still work!')
      }
      
      throw error
    } finally {
      loading.value = false
    }
  }

  const explainAnswer = async (
    question: string,
    userAnswer: string,
    correctAnswer: string,
    exerciseType: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening',
    level: 'beginner' | 'intermediate' | 'advanced',
    options?: string[]
  ): Promise<AIExplanation> => {
    loading.value = true
    try {
      const response = await $fetch('/api/ai/explain-answer', {
        method: 'POST',
        body: {
          question,
          userAnswer,
          correctAnswer,
          exerciseType,
          level,
          options
        }
      })

      if (!response.success) {
        throw new Error('Failed to generate explanation')
      }

      return {
        explanation: response.explanation,
        isCorrect: response.isCorrect,
        tips: response.tips || [],
        relatedConcepts: response.relatedConcepts || []
      }
    } catch (error: any) {
      console.error('Answer explanation error:', error)
      
      // Fallback explanation
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
      return {
        explanation: isCorrect 
          ? 'Correct! Well done.' 
          : `The correct answer is "${correctAnswer}". Keep practicing!`,
        isCorrect,
        tips: [],
        relatedConcepts: []
      }
    } finally {
      loading.value = false
    }
  }

  const generateFeedback = async (
    lessonTopic: string,
    userProgress: {
      completedExercises: number
      totalExercises: number
      averageScore: number
      weakAreas: string[]
      strongAreas: string[]
    },
    userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<AIFeedback> => {
    loading.value = true
    try {
      const response = await $fetch('/api/ai/generate-feedback', {
        method: 'POST',
        body: {
          lessonTopic,
          userProgress,
          userLevel
        }
      })

      if (!response.success) {
        throw new Error('Failed to generate feedback')
      }

      return {
        motivationalMessage: response.motivationalMessage,
        specificFeedback: response.specificFeedback,
        nextSteps: response.nextSteps || [],
        recommendedTopics: response.recommendedTopics || [],
        studyTips: response.studyTips || []
      }
    } catch (error: any) {
      console.error('Feedback generation error:', error)
      
      // Fallback feedback
      const completionRate = Math.round((userProgress.completedExercises / userProgress.totalExercises) * 100)
      return {
        motivationalMessage: `Great work! You've completed ${completionRate}% of this lesson.`,
        specificFeedback: `You're making good progress on ${lessonTopic}. Keep practicing to improve your skills.`,
        nextSteps: ['Continue with the next lesson', 'Review challenging concepts', 'Practice regularly'],
        recommendedTopics: ['Grammar fundamentals', 'Vocabulary building'],
        studyTips: ['Set aside time for daily practice', 'Review your mistakes to learn from them']
      }
    } finally {
      loading.value = false
    }
  }

  const generateVariations = async (
    originalQuestion: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    count: number = 3
  ): Promise<GeneratedExercise[]> => {
    // For now, we'll use the general exercise generator with the original question as context
    // In a more advanced implementation, you could create a specific endpoint for variations
    const topic = `Similar to: ${originalQuestion}`
    return generateExercises(topic, level, 'multiple_choice', count)
  }

  return {
    loading: readonly(loading),
    generateExercises,
    explainAnswer,
    generateFeedback,
    generateVariations
  }
}

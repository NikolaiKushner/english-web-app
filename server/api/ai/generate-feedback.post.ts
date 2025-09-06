import OpenAI from 'openai'

interface GenerateFeedbackRequest {
  lessonTopic: string
  userProgress: {
    completedExercises: number
    totalExercises: number
    averageScore: number
    weakAreas: string[]
    strongAreas: string[]
  }
  userLevel: 'beginner' | 'intermediate' | 'advanced'
}

interface FeedbackResponse {
  motivationalMessage: string
  specificFeedback: string
  nextSteps: string[]
  recommendedTopics: string[]
  studyTips: string[]
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<GenerateFeedbackRequest>(event)
    const { lessonTopic, userProgress, userLevel } = body

    if (!lessonTopic || !userProgress || !userLevel) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters'
      })
    }

    const config = useRuntimeConfig()
    const openai = new OpenAI({
      apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY
    })

    if (!openai.apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'OpenAI API key not configured'
      })
    }

    const prompt = createFeedbackPrompt(lessonTopic, userProgress, userLevel)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an encouraging and insightful English language teacher. Provide personalized, constructive feedback that motivates students and gives them clear direction for improvement. Always be positive while being honest about areas for growth."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No response from OpenAI'
      })
    }

    try {
      const feedback = JSON.parse(response)
      
      // Validate the response format
      if (!feedback.motivationalMessage || !feedback.specificFeedback) {
        throw new Error('Invalid feedback format')
      }

      return {
        success: true,
        ...feedback
      }
    } catch (parseError) {
      console.error('Failed to parse feedback response:', parseError)
      
      // Fallback response
      return {
        success: true,
        motivationalMessage: "Great work on completing this lesson! Keep practicing to improve your English skills.",
        specificFeedback: response,
        nextSteps: ["Continue practicing with similar exercises", "Review any challenging concepts"],
        recommendedTopics: ["Grammar fundamentals", "Vocabulary building"],
        studyTips: ["Practice regularly", "Review mistakes to learn from them"]
      }
    }

  } catch (error: any) {
    console.error('Feedback generation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to generate feedback'
    })
  }
})

function createFeedbackPrompt(lessonTopic: string, userProgress: any, userLevel: string): string {
  const { completedExercises, totalExercises, averageScore, weakAreas, strongAreas } = userProgress
  const completionRate = Math.round((completedExercises / totalExercises) * 100)

  return `Generate personalized feedback for an English language student:

Student Level: ${userLevel}
Lesson Topic: "${lessonTopic}"
Progress Statistics:
- Completed: ${completedExercises}/${totalExercises} exercises (${completionRate}%)
- Average Score: ${averageScore}%
- Strong Areas: ${strongAreas.length > 0 ? strongAreas.join(', ') : 'None identified yet'}
- Weak Areas: ${weakAreas.length > 0 ? weakAreas.join(', ') : 'None identified yet'}

Please provide personalized feedback that:
1. Acknowledges their progress and effort
2. Highlights their strengths
3. Addresses areas for improvement constructively
4. Provides specific next steps
5. Recommends related topics to study
6. Gives practical study tips

Return your response as a JSON object with this structure:
{
  "motivationalMessage": "Encouraging message about their progress (1-2 sentences)",
  "specificFeedback": "Detailed feedback about their performance on this lesson (2-3 sentences)",
  "nextSteps": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "recommendedTopics": ["Related topic 1", "Related topic 2", "Related topic 3"],
  "studyTips": ["Study tip 1", "Study tip 2", "Study tip 3"]
}

Keep the tone encouraging and constructive. Focus on growth and improvement rather than just pointing out mistakes.`
}

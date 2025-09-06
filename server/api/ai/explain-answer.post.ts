import OpenAI from 'openai'

interface ExplainAnswerRequest {
  question: string
  userAnswer: string
  correctAnswer: string
  exerciseType: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening'
  level: 'beginner' | 'intermediate' | 'advanced'
  options?: string[]
}

interface ExplanationResponse {
  explanation: string
  isCorrect: boolean
  tips: string[]
  relatedConcepts: string[]
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ExplainAnswerRequest>(event)
    const { question, userAnswer, correctAnswer, exerciseType, level, options } = body

    if (!question || !userAnswer || !correctAnswer || !exerciseType || !level) {
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

    const prompt = createExplanationPrompt(question, userAnswer, correctAnswer, exerciseType, level, options)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a patient and encouraging English teacher. Provide clear, helpful explanations that help students understand their mistakes and learn from them. Always be positive and constructive."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No response from OpenAI'
      })
    }

    try {
      const explanation = JSON.parse(response)
      
      // Validate the response format
      if (!explanation.explanation || typeof explanation.isCorrect !== 'boolean') {
        throw new Error('Invalid explanation format')
      }

      return {
        success: true,
        ...explanation
      }
    } catch (parseError) {
      console.error('Failed to parse explanation response:', parseError)
      
      // Fallback to plain text explanation if JSON parsing fails
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
      
      return {
        success: true,
        explanation: response,
        isCorrect,
        tips: [],
        relatedConcepts: []
      }
    }

  } catch (error: any) {
    console.error('Answer explanation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    // Handle OpenAI specific errors with user-friendly messages
    if (error.status === 429) {
      throw createError({
        statusCode: 429,
        statusMessage: 'AI explanations temporarily unavailable due to quota limits. Basic explanations will be used instead.'
      })
    }

    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'AI service configuration error. Using basic explanations instead.'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'AI explanation service temporarily unavailable. Basic explanations will be provided.'
    })
  }
})

function createExplanationPrompt(
  question: string, 
  userAnswer: string, 
  correctAnswer: string, 
  exerciseType: string, 
  level: string,
  options?: string[]
): string {
  const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
  
  let optionsText = ''
  if (options && exerciseType === 'multiple_choice') {
    optionsText = `\nAvailable options were: ${options.join(', ')}`
  }

  return `Analyze this English exercise answer and provide a helpful explanation:

Exercise Type: ${exerciseType.replace('_', ' ')}
Student Level: ${level}
Question: "${question}"${optionsText}
Student's Answer: "${userAnswer}"
Correct Answer: "${correctAnswer}"
Is Correct: ${isCorrect}

Please provide a detailed explanation that:
1. Explains why the answer is correct or incorrect
2. Teaches the underlying grammar/vocabulary concept
3. Gives practical tips for similar questions
4. Is encouraging and constructive
5. Is appropriate for a ${level} level student

${exerciseType === 'translation' ? 'For translation exercises, be flexible with variations that convey the same meaning.' : ''}

Return your response as a JSON object with this structure:
{
  "explanation": "Main explanation of the answer (2-3 sentences)",
  "isCorrect": ${isCorrect},
  "tips": ["Tip 1 for similar questions", "Tip 2 for improvement"],
  "relatedConcepts": ["Grammar concept 1", "Grammar concept 2"]
}

Keep the explanation clear, encouraging, and educational. Focus on helping the student learn and improve.`
}

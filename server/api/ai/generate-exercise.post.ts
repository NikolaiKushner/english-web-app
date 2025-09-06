import OpenAI from 'openai'

interface GenerateExerciseRequest {
  topic: string
  level: 'beginner' | 'intermediate' | 'advanced'
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening'
  count?: number
}

interface GeneratedExercise {
  question: string
  type: string
  options?: string[]
  correct_answer: string
  explanation: string
  difficulty_level: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<GenerateExerciseRequest>(event)
    const { topic, level, type, count = 1 } = body

    if (!topic || !level || !type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters: topic, level, and type are required'
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

    const prompt = createExercisePrompt(topic, level, type, count)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert English language teacher. Generate high-quality, educational exercises that are appropriate for the specified level. Always respond with valid JSON format."
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
      const exercises = JSON.parse(response)
      
      // Validate the response format
      if (!Array.isArray(exercises)) {
        throw new Error('Response is not an array')
      }

      // Validate each exercise
      exercises.forEach((exercise, index) => {
        if (!exercise.question || !exercise.correct_answer || !exercise.explanation) {
          throw new Error(`Exercise ${index} is missing required fields`)
        }
      })

      return {
        success: true,
        exercises: exercises as GeneratedExercise[]
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to parse AI response. Please try again.'
      })
    }

  } catch (error: any) {
    console.error('Exercise generation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    // Handle OpenAI specific errors
    if (error.status === 429) {
      throw createError({
        statusCode: 429,
        statusMessage: 'AI service temporarily unavailable. Please check your OpenAI quota or try again later.'
      })
    }

    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'AI service authentication failed. Please check your OpenAI API key configuration.'
      })
    }

    if (error.code === 'insufficient_quota') {
      throw createError({
        statusCode: 429,
        statusMessage: 'AI quota exceeded. Please upgrade your OpenAI plan or try again later.'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'AI service temporarily unavailable. Please try again later.'
    })
  }
})

function createExercisePrompt(topic: string, level: string, type: string, count: number): string {
  const levelDescriptions = {
    beginner: 'simple vocabulary, basic grammar, common everyday situations',
    intermediate: 'moderate vocabulary, intermediate grammar structures, workplace and social situations',
    advanced: 'complex vocabulary, advanced grammar, academic and professional contexts'
  }

  const typeInstructions = {
    multiple_choice: `Generate multiple choice questions with 4 options each. Include the "options" field as an array of 4 strings.`,
    fill_blank: `Generate fill-in-the-blank exercises with a single word or short phrase missing. The question should contain "___" where the answer goes.`,
    translation: `Generate translation exercises from simple English to more complex English or vice versa, appropriate for the level.`,
    listening: `Generate listening comprehension questions (note: actual audio not provided, but create questions as if audio exists).`
  }

  return `Create ${count} high-quality English ${type.replace('_', ' ')} exercise(s) about "${topic}" for ${level} level students.

Level requirements: ${levelDescriptions[level as keyof typeof levelDescriptions]}
Exercise type: ${typeInstructions[type as keyof typeof typeInstructions]}

Requirements:
- Questions should be clear and unambiguous
- Appropriate difficulty for ${level} level
- Include detailed explanations that help students learn
- Focus on practical, useful English skills
- Avoid cultural references that might be confusing

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "The exercise question text",
    "type": "${type}",
    ${type === 'multiple_choice' ? '"options": ["Option 1", "Option 2", "Option 3", "Option 4"],' : ''}
    "correct_answer": "The correct answer",
    "explanation": "Clear explanation of why this is correct and what concept it teaches",
    "difficulty_level": "${level}"
  }
]

Make sure the JSON is valid and properly formatted.`
}

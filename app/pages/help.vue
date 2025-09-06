<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
      <p class="text-xl text-gray-600">
        Find answers to common questions and get the help you need.
      </p>
    </div>

    <!-- Search Bar -->
    <div class="mb-12">
      <div class="max-w-xl mx-auto">
        <UiInput
          v-model="searchQuery"
          placeholder="Search for help topics..."
          size="lg"
        >
          <template #icon-left>
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </template>
        </UiInput>
      </div>
    </div>

    <!-- FAQ Categories -->
    <div class="space-y-8">
      <UiCard
        v-for="category in filteredCategories"
        :key="category.title"
        :title="category.title"
        variant="default"
        padding="lg"
      >
        <div class="space-y-4">
          <div
            v-for="faq in category.faqs"
            :key="faq.question"
            class="border border-gray-200 rounded-lg"
          >
            <button
              @click="toggleFaq(faq.id)"
              class="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <span class="font-medium text-gray-900">{{ faq.question }}</span>
              <svg
                :class="[
                  'h-5 w-5 text-gray-500 transition-transform duration-200',
                  openFaqs.includes(faq.id) ? 'transform rotate-180' : ''
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              v-show="openFaqs.includes(faq.id)"
              class="px-4 pb-4 text-gray-600 leading-relaxed"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Contact Support -->
    <UiCard title="Still Need Help?" variant="elevated" padding="lg" class="mt-12 text-center">
      <p class="text-gray-600 mb-6">
        Can't find the answer you're looking for? Our support team is here to help.
      </p>
      <UiButton to="/contact" variant="primary">
        Contact Support
      </UiButton>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const openFaqs = ref<string[]>([])

const categories = [
  {
    title: 'Getting Started',
    faqs: [
      {
        id: 'getting-started-1',
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address to get started.'
      },
      {
        id: 'getting-started-2',
        question: 'Is the platform free to use?',
        answer: 'Yes! Our basic features are completely free. We also offer premium features for users who want additional content and personalized learning paths.'
      },
      {
        id: 'getting-started-3',
        question: 'What level should I start with?',
        answer: 'We recommend taking our placement assessment to determine your current level. You can also browse lessons by level and start where you feel comfortable.'
      }
    ]
  },
  {
    title: 'Lessons & Learning',
    faqs: [
      {
        id: 'lessons-1',
        question: 'How are lessons structured?',
        answer: 'Each lesson includes content explanation, examples, and practice exercises. Lessons are organized by level and topic, building upon previous knowledge.'
      },
      {
        id: 'lessons-2',
        question: 'Can I repeat lessons?',
        answer: 'Absolutely! You can repeat any lesson as many times as you want. Repetition is key to language learning.'
      },
      {
        id: 'lessons-3',
        question: 'How do I track my progress?',
        answer: 'Visit your Progress page to see completed lessons, scores, streaks, and achievements. Your progress is automatically saved as you learn.'
      }
    ]
  },
  {
    title: 'Exercises & Assessment',
    faqs: [
      {
        id: 'exercises-1',
        question: 'What types of exercises are available?',
        answer: 'We offer multiple choice questions, fill-in-the-blank exercises, translation tasks, and listening comprehension activities.'
      },
      {
        id: 'exercises-2',
        question: 'How is my performance scored?',
        answer: 'Exercises are scored based on correct answers. You receive immediate feedback and explanations for incorrect responses.'
      },
      {
        id: 'exercises-3',
        question: 'Can I see the correct answers?',
        answer: 'Yes, after completing an exercise, you can review the correct answers along with detailed explanations.'
      }
    ]
  },
  {
    title: 'Technical Support',
    faqs: [
      {
        id: 'tech-1',
        question: 'What browsers are supported?',
        answer: 'Our platform works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is up to date.'
      },
      {
        id: 'tech-2',
        question: 'I\'m having trouble logging in',
        answer: 'Try resetting your password or clearing your browser cache. If issues persist, contact our support team.'
      },
      {
        id: 'tech-3',
        question: 'Is there a mobile app?',
        answer: 'Currently, our platform is web-based and works great on mobile browsers. A dedicated mobile app is in development.'
      }
    ]
  }
]

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories
  
  return categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)
})

const toggleFaq = (faqId: string) => {
  const index = openFaqs.value.indexOf(faqId)
  if (index === -1) {
    openFaqs.value.push(faqId)
  } else {
    openFaqs.value.splice(index, 1)
  }
}

useHead({
  title: 'Help Center - English Learning Platform',
  meta: [
    { name: 'description', content: 'Find answers to common questions about our English learning platform.' }
  ]
})
</script>

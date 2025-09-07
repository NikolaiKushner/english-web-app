<template>
  <!-- Authentication Guard -->
  <div v-if="!authStore.user" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Progress Tracking Access Required</h2>
        <p class="mt-2 text-sm text-gray-600">
          Please sign in to view your learning progress and track your achievements.
        </p>
      </div>
      <div class="space-y-4">
        <UiButton to="/auth/login" variant="primary" size="lg" class="w-full">
          Sign In
        </UiButton>
        <UiButton to="/auth/register" variant="secondary" size="lg" class="w-full">
          Create Account
        </UiButton>
        <UiButton to="/" variant="ghost" size="lg" class="w-full">
          ← Back to Home
        </UiButton>
      </div>
    </div>
  </div>

  <!-- Main Content (only for authenticated users) -->
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Your Learning Progress</h1>
      <p class="text-lg text-gray-600">
        Track your English learning journey and see how far you've come
      </p>
    </div>

    <!-- Loading State -->
    <UiLoadingSpinner 
      v-if="learningStore.loading" 
      size="lg" 
      message="Loading your progress..." 
    />

    <!-- Progress Content -->
    <div v-else-if="authStore.user" class="space-y-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <UiCard variant="default" padding="md" class="text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">
            {{ completedLessonsCount }}
          </div>
          <div class="text-sm text-gray-600">Lessons Completed</div>
        </UiCard>
        
        <UiCard variant="default" padding="md" class="text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">
            {{ completedExercisesCount }}
          </div>
          <div class="text-sm text-gray-600">Exercises Completed</div>
        </UiCard>
        
        <UiCard variant="default" padding="md" class="text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">
            {{ currentStreak }}
          </div>
          <div class="text-sm text-gray-600">Day Streak</div>
        </UiCard>
        
        <UiCard variant="default" padding="md" class="text-center">
          <div class="text-3xl font-bold text-orange-600 mb-2">
            {{ overallProgress }}%
          </div>
          <div class="text-sm text-gray-600">Overall Progress</div>
          <UiProgress 
            :value="overallProgress" 
            variant="info" 
            size="sm" 
            class="mt-2" 
            :show-label="false"
          />
        </UiCard>
      </div>

      <!-- Progress Chart -->
      <UiCard title="Learning Progress" variant="default" padding="lg">
        <div class="space-y-4">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <span>Overall Course Completion</span>
            <span>{{ overallProgress }}%</span>
          </div>
          <UiProgress 
            :value="overallProgress" 
            variant="success" 
            size="lg" 
            animated
            striped
          />
          
          <div class="grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
              <div class="text-lg font-semibold text-green-600">{{ getCompletedLessonsByLevel('beginner') }}</div>
              <div class="text-xs text-gray-500">Beginner</div>
            </div>
            <div>
              <div class="text-lg font-semibold text-yellow-600">{{ getCompletedLessonsByLevel('intermediate') }}</div>
              <div class="text-xs text-gray-500">Intermediate</div>
            </div>
            <div>
              <div class="text-lg font-semibold text-red-600">{{ getCompletedLessonsByLevel('advanced') }}</div>
              <div class="text-xs text-gray-500">Advanced</div>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- Recent Activity -->
      <UiCard title="Recent Activity" variant="default" padding="lg">
        <div v-if="recentActivityWithDetails.length > 0" class="space-y-3">
          <div
            v-for="activity in recentActivityWithDetails"
            :key="activity.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">
                  {{ activity.isExercise ? 'Completed exercise in' : 'Completed lesson:' }}
                  <span class="text-blue-600">{{ activity.lessonTitle }}</span>
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(activity.completed_at) }}
                </p>
              </div>
            </div>
            <div v-if="activity.score" class="text-sm font-medium" :class="{
              'text-green-600': activity.score >= 80,
              'text-yellow-600': activity.score >= 60 && activity.score < 80,
              'text-red-600': activity.score < 60
            }">
              {{ activity.score }}%
            </div>
          </div>
        </div>
        <UiAlert v-else variant="info" message="No recent activity. Start learning to see your progress here!" />
      </UiCard>

      <!-- Achievements -->
      <UiCard title="Achievements" variant="default" padding="lg">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UiCard
            v-for="achievement in achievements"
            :key="achievement.id"
            :variant="achievement.unlocked ? 'outlined' : 'flat'"
            padding="md"
            class="text-center"
            :class="{
              'border-yellow-300 bg-yellow-50': achievement.unlocked,
              'opacity-60': !achievement.unlocked
            }"
          >
            <div class="text-2xl mb-2">{{ achievement.icon }}</div>
            <div class="text-sm font-medium text-gray-900">{{ achievement.name }}</div>
            <div class="text-xs text-gray-500">{{ achievement.description }}</div>
            <UiBadge 
              v-if="achievement.unlocked" 
              variant="warning" 
              size="xs" 
              class="mt-2"
            >
              Unlocked
            </UiBadge>
          </UiCard>
        </div>
      </UiCard>
    </div>

    <!-- Not Logged In -->
    <div v-else class="text-center py-12">
      <UiAlert
        variant="info"
        title="Sign in to track your progress"
        message="Create an account or sign in to start tracking your learning journey."
        class="max-w-md mx-auto mb-6"
      />
      <div class="flex justify-center space-x-4">
        <UiButton to="/auth/login" variant="secondary">
          Sign In
        </UiButton>
        <UiButton to="/auth/register" variant="primary">
          Sign Up
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const learningStore = useLearningStore()
const authStore = useAuthStore()

const userProfile = computed(() => learningStore.userProfile)

// Enhanced computed properties using the new store functions
const completedLessonsCount = computed(() => {
  return learningStore.userProgress.filter(p => p.completed && !p.exercise_id).length
})

const completedExercisesCount = computed(() => {
  return learningStore.userProgress.filter(p => p.completed && p.exercise_id).length
})

const currentStreak = computed(() => {
  return learningStore.getStreakDays()
})

const overallProgress = computed(() => {
  return learningStore.getOverallProgress()
})

const recentProgress = computed(() => {
  return learningStore.getRecentActivity(10)
})

// Enhanced recent activity with lesson titles
const recentActivityWithDetails = computed(() => {
  return recentProgress.value.map(progress => {
    const lesson = learningStore.lessons.find(l => l.id === progress.lesson_id)
    return {
      ...progress,
      lessonTitle: lesson?.title || 'Unknown Lesson',
      isExercise: !!progress.exercise_id
    }
  })
})

const getCompletedLessonsByLevel = (level: string) => {
  return learningStore.getCompletedLessonsByLevel(level).length
}

const achievements = ref([
  {
    id: 1,
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 2,
    name: 'Week Warrior',
    description: 'Learn for 7 days straight',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 3,
    name: 'Grammar Master',
    description: 'Complete 10 grammar lessons',
    icon: '📚',
    unlocked: false
  },
  {
    id: 4,
    name: 'Perfect Score',
    description: 'Get 100% on an exercise',
    icon: '⭐',
    unlocked: false
  }
])

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch user data on component mount
onMounted(async () => {
  if (authStore.user) {
    await Promise.all([
      learningStore.fetchLessons(), // Need lessons for displaying titles
      learningStore.fetchUserProfile(authStore.user.id),
      learningStore.fetchUserProgress(authStore.user.id)
    ])
  }
})

// Set page meta
useHead({
  title: 'Learning Progress - English Learning Platform'
})
</script>

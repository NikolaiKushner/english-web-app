<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Your Learning Progress</h1>
      <p class="text-lg text-gray-600">
        Track your English learning journey and see how far you've come
      </p>
    </div>

    <!-- Loading State -->
    <LoadingSpinner 
      v-if="learningStore.loading" 
      size="lg" 
      message="Loading your progress..." 
    />

    <!-- Progress Content -->
    <div v-else-if="authStore.user" class="space-y-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">
            {{ completedLessonsCount }}
          </div>
          <div class="text-sm text-gray-600">Lessons Completed</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">
            {{ completedExercisesCount }}
          </div>
          <div class="text-sm text-gray-600">Exercises Completed</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">
            {{ currentStreak }}
          </div>
          <div class="text-sm text-gray-600">Day Streak</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-orange-600 mb-2">
            {{ overallProgress }}%
          </div>
          <div class="text-sm text-gray-600">Overall Progress</div>
        </div>
      </div>

      <!-- Progress Chart Placeholder -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Learning Progress</h2>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="text-gray-500">Progress chart will be displayed here</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
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
        <div v-else class="text-center py-8 text-gray-500">
          No recent activity. Start learning to see your progress here!
        </div>
      </div>

      <!-- Achievements Placeholder -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            :class="[
              'p-4 rounded-lg text-center',
              achievement.unlocked ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50 border-2 border-gray-200'
            ]"
          >
            <div class="text-2xl mb-2">{{ achievement.icon }}</div>
            <div class="text-sm font-medium text-gray-900">{{ achievement.name }}</div>
            <div class="text-xs text-gray-500">{{ achievement.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Logged In -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Sign in to track your progress</h3>
      <p class="text-gray-600 mb-4">Create an account or sign in to start tracking your learning journey.</p>
      <div class="flex justify-center space-x-4">
        <NuxtLink to="/auth/login" class="btn-secondary">
          Sign In
        </NuxtLink>
        <NuxtLink to="/auth/register" class="btn-primary">
          Sign Up
        </NuxtLink>
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

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <UiBadge variant="primary" size="sm">Administrator</UiBadge>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ user?.email }}</span>
            <UiButton to="/" variant="secondary" size="sm">
              ← Back to Site
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Users</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-green-600">+{{ stats.newUsersThisWeek }} this week</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Lessons</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalLessons }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-blue-600">{{ stats.totalExercises }} exercises</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Vocabulary Words</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalWords }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-purple-600">{{ stats.categoriesCount }} categories</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Active Sessions</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.activeSessions }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-yellow-600">{{ stats.completionsToday }} completions today</span>
          </div>
        </div>
      </div>

      <!-- Management Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Content Management -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900">Content Management</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/lessons')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Lessons</h3>
                  <p class="text-sm text-gray-600">Manage lessons and exercises</p>
                </div>
              </div>
            </UiCard>

            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/vocabulary')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Vocabulary</h3>
                  <p class="text-sm text-gray-600">Manage dictionary words</p>
                </div>
              </div>
            </UiCard>

            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/exercises')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Exercises</h3>
                  <p class="text-sm text-gray-600">Manage exercise content</p>
                </div>
              </div>
            </UiCard>

            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/ai')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">AI Settings</h3>
                  <p class="text-sm text-gray-600">Configure AI features</p>
                </div>
              </div>
            </UiCard>
          </div>
        </div>

        <!-- User Management -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900">User Management</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/users')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Users</h3>
                  <p class="text-sm text-gray-600">Manage user accounts</p>
                </div>
              </div>
            </UiCard>

            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/progress')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Progress</h3>
                  <p class="text-sm text-gray-600">View learning analytics</p>
                </div>
              </div>
            </UiCard>

            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/reports')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Reports</h3>
                  <p class="text-sm text-gray-600">Generate reports</p>
                </div>
              </div>
            </UiCard>

            <UiCard class="cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/admin/settings')">
              <div class="flex items-center space-x-3 p-4">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Settings</h3>
                  <p class="text-sm text-gray-600">System configuration</p>
                </div>
              </div>
            </UiCard>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <UiCard>
          <div class="divide-y divide-gray-200">
            <div v-for="activity in recentActivity" :key="activity.id" class="p-4 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-600">{{ formatDate(activity.created_at) }}</p>
                </div>
              </div>
              <UiBadge :variant="activity.type === 'user' ? 'primary' : 'secondary'" size="xs">
                {{ activity.type }}
              </UiBadge>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { supabase } = useSupabase()

// Mock admin check - in a real app, you'd have proper role management
const isAdmin = computed(() => {
  // For demo purposes, any logged-in user can access admin
  // In production, you'd check user roles/permissions
  return !!user.value
})

if (!isAdmin.value) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Admin access required'
  })
}

// Stats data
const stats = ref({
  totalUsers: 0,
  newUsersThisWeek: 0,
  totalLessons: 0,
  totalExercises: 0,
  totalWords: 0,
  categoriesCount: 0,
  activeSessions: 0,
  completionsToday: 0
})

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    description: 'New user registered: john@example.com',
    type: 'user',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    description: 'Lesson "Present Simple Tense" completed by 5 users',
    type: 'lesson',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    description: 'New vocabulary word added: "serendipity"',
    type: 'vocabulary',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
])

// Fetch admin stats
const fetchStats = async () => {
  try {
    // Get user count
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    // Get lesson count
    const { count: lessonCount } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
    
    // Get exercise count
    const { count: exerciseCount } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true })
    
    // Get vocabulary count
    const { count: wordCount } = await supabase
      .from('vocabulary_words')
      .select('*', { count: 'exact', head: true })

    stats.value = {
      totalUsers: userCount || 0,
      newUsersThisWeek: Math.floor((userCount || 0) * 0.1), // Mock calculation
      totalLessons: lessonCount || 0,
      totalExercises: exerciseCount || 0,
      totalWords: wordCount || 0,
      categoriesCount: 8, // Mock value
      activeSessions: Math.floor(Math.random() * 20) + 5, // Mock value
      completionsToday: Math.floor(Math.random() * 50) + 10 // Mock value
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
  }
}

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hours ago`
  return date.toLocaleDateString()
}

// Initialize
onMounted(() => {
  fetchStats()
})

// Set page meta
useHead({
  title: 'Admin Panel - English Learning Platform',
  meta: [
    { name: 'description', content: 'Administrative dashboard for managing the English learning platform.' }
  ]
})
</script>

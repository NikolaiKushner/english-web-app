<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <UiButton to="/admin" variant="ghost" size="sm">
              ← Admin Panel
            </UiButton>
            <h1 class="text-2xl font-bold text-gray-900">Lesson Management</h1>
          </div>
          <UiButton @click="showCreateModal = true" variant="primary">
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </template>
            Create Lesson
          </UiButton>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters and Search -->
      <UiCard class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UiInput
            v-model="searchQuery"
            placeholder="Search lessons..."
            @input="debouncedSearch"
          >
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </template>
          </UiInput>

          <UiSelect
            v-model="levelFilter"
            placeholder="All Levels"
            :options="[
              { label: 'All Levels', value: '' },
              { label: 'Beginner', value: 'beginner' },
              { label: 'Intermediate', value: 'intermediate' },
              { label: 'Advanced', value: 'advanced' }
            ]"
            @update:modelValue="fetchLessons"
          />

          <UiSelect
            v-model="categoryFilter"
            placeholder="All Categories"
            :options="categoryOptions"
            @update:modelValue="fetchLessons"
          />

          <UiButton @click="clearFilters" variant="secondary">
            Clear Filters
          </UiButton>
        </div>
      </UiCard>

      <!-- Lessons Table -->
      <UiCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">
              Lessons ({{ filteredLessons.length }})
            </h2>
            <div class="text-sm text-gray-600">
              Total exercises: {{ totalExercises }}
            </div>
          </div>
        </template>

        <div v-if="loading" class="flex justify-center py-12">
          <UiSpinner size="lg" />
        </div>

        <div v-else-if="filteredLessons.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
          <p class="text-gray-600 mb-4">Create your first lesson to get started.</p>
          <UiButton @click="showCreateModal = true" variant="primary">
            Create Lesson
          </UiButton>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lesson
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercises
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="lesson in filteredLessons" :key="lesson.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ lesson.title }}</div>
                    <div class="text-sm text-gray-500">{{ truncateText(lesson.description, 60) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <UiBadge :variant="getLevelVariant(lesson.level)" size="sm">
                    {{ lesson.level }}
                  </UiBadge>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ lesson.category }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ getExerciseCount(lesson.id) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ lesson.order }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatDate(lesson.created_at) }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <UiButton @click="viewLesson(lesson)" variant="ghost" size="sm">
                    View
                  </UiButton>
                  <UiButton @click="editLesson(lesson)" variant="secondary" size="sm">
                    Edit
                  </UiButton>
                  <UiButton @click="deleteLesson(lesson)" variant="danger" size="sm">
                    Delete
                  </UiButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiCard>
    </div>

    <!-- Create/Edit Lesson Modal -->
    <UiModal v-model="showCreateModal" :title="editingLesson ? 'Edit Lesson' : 'Create Lesson'" size="lg">
      <form @submit.prevent="saveLesson" class="space-y-4">
        <UiInput
          v-model="lessonForm.title"
          label="Title"
          placeholder="Enter lesson title"
          required
        />

        <UiTextarea
          v-model="lessonForm.description"
          label="Description"
          placeholder="Enter lesson description"
          rows="3"
          required
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiSelect
            v-model="lessonForm.level"
            label="Level"
            placeholder="Select level"
            :options="[
              { label: 'Beginner', value: 'beginner' },
              { label: 'Intermediate', value: 'intermediate' },
              { label: 'Advanced', value: 'advanced' }
            ]"
            required
          />

          <UiInput
            v-model="lessonForm.category"
            label="Category"
            placeholder="e.g., Grammar, Vocabulary"
            required
          />

          <UiInput
            v-model.number="lessonForm.order"
            label="Order"
            type="number"
            placeholder="1"
            required
          />
        </div>

        <UiTextarea
          v-model="lessonForm.content"
          label="Content (Markdown supported)"
          placeholder="Enter lesson content using Markdown..."
          rows="8"
          required
        />

        <div class="flex justify-end space-x-3">
          <UiButton @click="showCreateModal = false" variant="secondary">
            Cancel
          </UiButton>
          <UiButton 
            type="submit" 
            :loading="saving" 
            loading-text="Saving..."
            variant="primary"
          >
            {{ editingLesson ? 'Update' : 'Create' }} Lesson
          </UiButton>
        </div>
      </form>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal v-model="showDeleteModal" title="Delete Lesson" size="sm">
      <div class="space-y-4">
        <p class="text-gray-600">
          Are you sure you want to delete "{{ lessonToDelete?.title }}"? 
          This action cannot be undone and will also delete all associated exercises.
        </p>
        
        <div class="flex justify-end space-x-3">
          <UiButton @click="showDeleteModal = false" variant="secondary">
            Cancel
          </UiButton>
          <UiButton 
            @click="confirmDelete" 
            :loading="deleting"
            loading-text="Deleting..."
            variant="danger"
          >
            Delete
          </UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Lesson } from '@/types'

const { supabase } = useSupabase()
const toast = useToast()

// State
const lessons = ref<Lesson[]>([])
const exercises = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

// Filters
const searchQuery = ref('')
const levelFilter = ref('')
const categoryFilter = ref('')

// Modals
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingLesson = ref<Lesson | null>(null)
const lessonToDelete = ref<Lesson | null>(null)

// Form
const lessonForm = ref({
  title: '',
  description: '',
  content: '',
  level: '',
  category: '',
  order: 1
})

// Computed
const filteredLessons = computed(() => {
  let filtered = lessons.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(lesson => 
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query)
    )
  }

  if (levelFilter.value) {
    filtered = filtered.filter(lesson => lesson.level === levelFilter.value)
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(lesson => lesson.category === categoryFilter.value)
  }

  return filtered.sort((a, b) => a.order - b.order)
})

const categoryOptions = computed(() => {
  const categories = [...new Set(lessons.value.map(l => l.category))]
  return [
    { label: 'All Categories', value: '' },
    ...categories.map(cat => ({ label: cat, value: cat }))
  ]
})

const totalExercises = computed(() => exercises.value.length)

// Methods
const fetchLessons = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('"order"', { ascending: true })

    if (error) throw error
    lessons.value = data || []
  } catch (error) {
    console.error('Error fetching lessons:', error)
    toast.error('Error', 'Failed to fetch lessons')
  } finally {
    loading.value = false
  }
}

const fetchExercises = async () => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')

    if (error) throw error
    exercises.value = data || []
  } catch (error) {
    console.error('Error fetching exercises:', error)
  }
}

const saveLesson = async () => {
  saving.value = true
  try {
    const lessonData = {
      title: lessonForm.value.title,
      description: lessonForm.value.description,
      content: lessonForm.value.content,
      level: lessonForm.value.level,
      category: lessonForm.value.category,
      order: lessonForm.value.order,
      updated_at: new Date().toISOString()
    }

    if (editingLesson.value) {
      // Update existing lesson
      const { error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', editingLesson.value.id)

      if (error) throw error
      toast.success('Success', 'Lesson updated successfully')
    } else {
      // Create new lesson
      const { error } = await supabase
        .from('lessons')
        .insert([{
          ...lessonData,
          created_at: new Date().toISOString()
        }])

      if (error) throw error
      toast.success('Success', 'Lesson created successfully')
    }

    showCreateModal.value = false
    resetForm()
    await fetchLessons()
  } catch (error) {
    console.error('Error saving lesson:', error)
    toast.error('Error', 'Failed to save lesson')
  } finally {
    saving.value = false
  }
}

const editLesson = (lesson: Lesson) => {
  editingLesson.value = lesson
  lessonForm.value = {
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    level: lesson.level,
    category: lesson.category,
    order: lesson.order
  }
  showCreateModal.value = true
}

const deleteLesson = (lesson: Lesson) => {
  lessonToDelete.value = lesson
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!lessonToDelete.value) return

  deleting.value = true
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonToDelete.value.id)

    if (error) throw error

    toast.success('Success', 'Lesson deleted successfully')
    showDeleteModal.value = false
    lessonToDelete.value = null
    await fetchLessons()
    await fetchExercises()
  } catch (error) {
    console.error('Error deleting lesson:', error)
    toast.error('Error', 'Failed to delete lesson')
  } finally {
    deleting.value = false
  }
}

const viewLesson = (lesson: Lesson) => {
  navigateTo(`/lessons/${lesson.id}`)
}

const resetForm = () => {
  editingLesson.value = null
  lessonForm.value = {
    title: '',
    description: '',
    content: '',
    level: '',
    category: '',
    order: 1
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  levelFilter.value = ''
  categoryFilter.value = ''
}

const getExerciseCount = (lessonId: string) => {
  return exercises.value.filter(ex => ex.lesson_id === lessonId).length
}

const getLevelVariant = (level: string) => {
  switch (level) {
    case 'beginner': return 'success'
    case 'intermediate': return 'warning'
    case 'advanced': return 'danger'
    default: return 'secondary'
  }
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  // Search is handled by computed property
}, 300)

// Watch for modal close to reset form
watch(showCreateModal, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchLessons(),
    fetchExercises()
  ])
})

// Set page meta
useHead({
  title: 'Lesson Management - Admin Panel',
  meta: [
    { name: 'description', content: 'Manage lessons and educational content.' }
  ]
})
</script>

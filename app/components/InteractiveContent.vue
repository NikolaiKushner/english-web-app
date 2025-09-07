<template>
  <div class="interactive-content">
    <!-- Drag and Drop Exercise -->
    <div v-if="parsedContent.type === 'drag_drop'" class="space-y-4">
      <h4 class="text-lg font-medium text-gray-900 mb-4">{{ parsedContent.instruction }}</h4>
      
      <!-- Items to drag -->
      <div class="mb-6">
        <h5 class="text-sm font-medium text-gray-700 mb-2">Drag these items:</h5>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(item, index) in availableItems"
            :key="index"
            class="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
            draggable="true"
            @dragstart="handleDragStart($event, item)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- Drop zones -->
      <div class="space-y-3">
        <div
          v-for="(category, index) in parsedContent.categories"
          :key="index"
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[60px] transition-colors"
          :class="{
            'border-green-400 bg-green-50': dropZones[category].length > 0,
            'border-blue-400 bg-blue-50': dragOverZone === category
          }"
          @dragover.prevent
          @dragenter="dragOverZone = category"
          @dragleave="dragOverZone = null"
          @drop="handleDrop($event, category)"
        >
          <div class="flex items-center justify-between mb-2">
            <h6 class="font-medium text-gray-700">{{ category }}</h6>
            <span class="text-xs text-gray-500">{{ dropZones[category].length }} items</span>
          </div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(item, itemIndex) in dropZones[category]"
              :key="itemIndex"
              class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>

      <!-- Check Answer Button -->
      <div class="flex justify-between items-center pt-4">
        <div v-if="showResult" class="text-sm">
          <span :class="isCorrect ? 'text-green-600' : 'text-red-600'">
            {{ isCorrect ? '✓ Correct!' : '✗ Try again' }}
          </span>
        </div>
        <UiButton @click="checkAnswer" variant="primary" size="sm">
          Check Answer
        </UiButton>
      </div>
    </div>

    <!-- Fallback for unsupported interactive content -->
    <div v-else class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-yellow-800">
        <strong>Interactive Exercise:</strong> {{ content.content }}
      </p>
      <p class="text-sm text-yellow-600 mt-1">
        This interactive content type is not yet supported in the player.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LessonContent } from '@/types'

interface Props {
  content: LessonContent
}

const props = defineProps<Props>()

// Parse the JSON content
const parsedContent = computed(() => {
  try {
    return JSON.parse(props.content.content)
  } catch (error) {
    console.error('Error parsing interactive content:', error)
    return { type: 'unknown' }
  }
})

// State for drag and drop
const availableItems = ref<string[]>([])
const dropZones = ref<Record<string, string[]>>({})
const dragOverZone = ref<string | null>(null)
const showResult = ref(false)
const isCorrect = ref(false)

// Initialize drag and drop exercise
const initializeDragDrop = () => {
  if (parsedContent.value.type === 'drag_drop') {
    availableItems.value = [...parsedContent.value.items]
    
    // Initialize empty drop zones
    parsedContent.value.categories.forEach((category: string) => {
      dropZones.value[category] = []
    })
    
    showResult.value = false
    isCorrect.value = false
  }
}

// Drag and drop handlers
const handleDragStart = (event: DragEvent, item: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', item)
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDrop = (event: DragEvent, category: string) => {
  event.preventDefault()
  dragOverZone.value = null
  
  if (event.dataTransfer) {
    const item = event.dataTransfer.getData('text/plain')
    
    // Remove item from available items
    const itemIndex = availableItems.value.indexOf(item)
    if (itemIndex > -1) {
      availableItems.value.splice(itemIndex, 1)
    }
    
    // Remove item from other drop zones
    Object.keys(dropZones.value).forEach(zone => {
      const zoneItemIndex = dropZones.value[zone].indexOf(item)
      if (zoneItemIndex > -1) {
        dropZones.value[zone].splice(zoneItemIndex, 1)
      }
    })
    
    // Add item to the target drop zone
    dropZones.value[category].push(item)
  }
}

const checkAnswer = () => {
  // For the sample exercise, check if items are in correct categories
  // This is a simplified check - in a real implementation, you'd have correct answers defined
  const correctAnswers = {
    'Person': ['teacher'],
    'Emotion': ['happiness'],
    'Place': ['London'],
    'Thing': ['book']
  }
  
  let correct = true
  
  Object.keys(correctAnswers).forEach(category => {
    const expectedItems = correctAnswers[category as keyof typeof correctAnswers]
    const actualItems = dropZones.value[category] || []
    
    if (expectedItems.length !== actualItems.length) {
      correct = false
      return
    }
    
    expectedItems.forEach(item => {
      if (!actualItems.includes(item)) {
        correct = false
      }
    })
  })
  
  isCorrect.value = correct
  showResult.value = true
  
  // Show feedback
  const toast = useToast()
  if (correct) {
    toast.success('Correct!', 'Well done! You categorized all items correctly.')
  } else {
    toast.error('Try Again', 'Some items are in the wrong category. Try moving them around.')
  }
}

// Initialize when component mounts or content changes
watch(() => parsedContent.value, initializeDragDrop, { immediate: true })
</script>

<style scoped>
.interactive-content {
  user-select: none;
}
</style>

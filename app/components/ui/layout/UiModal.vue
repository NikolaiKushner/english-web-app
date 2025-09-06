<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleBackdropClick"
        ></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            :class="modalClasses"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b border-gray-200">
              <div class="flex items-center space-x-3">
                <slot name="header">
                  <h2 :id="titleId" class="text-xl font-semibold text-gray-900">{{ title }}</h2>
                </slot>
              </div>
              <button
                v-if="closable"
                @click="close"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <!-- Body -->
            <div :class="bodyClasses">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg', 
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl mx-4'
}

const modalClasses = computed(() => {
  return [
    'bg-white rounded-lg shadow-xl transform transition-all w-full',
    sizeClasses[props.size]
  ].join(' ')
})

const bodyClasses = computed(() => {
  const classes = ['p-6']
  
  // Adjust padding if no header
  if (!props.title && !useSlots().header) {
    classes.push('pt-6')
  }
  
  return classes.join(' ')
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Handle ESC key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue && props.closable) {
      close()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95) translateY(-10px);
}
</style>

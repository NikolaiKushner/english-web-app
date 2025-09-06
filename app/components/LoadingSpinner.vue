<template>
  <div :class="containerClass">
    <div class="flex flex-col items-center justify-center">
      <div :class="spinnerClass">
        <div class="animate-spin rounded-full border-b-2" :class="borderClass"></div>
      </div>
      <p v-if="message" :class="messageClass">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  fullScreen?: boolean
  overlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  message: '',
  fullScreen: false,
  overlay: false
})

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const containerClass = computed(() => {
  const base = 'flex items-center justify-center'
  
  if (props.fullScreen) {
    return `${base} min-h-screen`
  }
  
  if (props.overlay) {
    return `${base} fixed inset-0 bg-black bg-opacity-50 z-50`
  }
  
  return `${base} py-12`
})

const spinnerClass = computed(() => {
  return `${sizeClasses[props.size]} mb-4`
})

const borderClass = computed(() => {
  const sizeMap = {
    sm: 'border-2',
    md: 'border-2', 
    lg: 'border-4',
    xl: 'border-4'
  }
  
  return `${sizeMap[props.size]} border-blue-600`
})

const messageClass = computed(() => {
  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  return `${sizeMap[props.size]} text-gray-600 text-center`
})
</script>

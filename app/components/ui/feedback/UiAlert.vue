<template>
  <div v-if="show" :class="alertClasses" role="alert">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <!-- Info Icon -->
        <svg v-if="variant === 'info'" :class="iconClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <!-- Success Icon -->
        <svg v-else-if="variant === 'success'" :class="iconClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <!-- Warning Icon -->
        <svg v-else-if="variant === 'warning'" :class="iconClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <!-- Error Icon -->
        <svg v-else-if="variant === 'error'" :class="iconClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      
      <div class="flex-1">
        <h4 v-if="title" :class="titleClasses">{{ title }}</h4>
        <div :class="contentClasses">
          <slot>{{ message }}</slot>
        </div>
      </div>
      
      <div v-if="dismissible" class="flex-shrink-0">
        <button
          @click="dismiss"
          :class="dismissButtonClasses"
          aria-label="Dismiss alert"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string
  dismissible?: boolean
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: false,
  modelValue: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  dismiss: []
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const variantConfig = {
  info: {
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClasses: 'text-blue-600',
    titleClasses: 'text-blue-900'
  },
  success: {
    classes: 'bg-green-50 border-green-200 text-green-800',
    iconClasses: 'text-green-600',
    titleClasses: 'text-green-900'
  },
  warning: {
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconClasses: 'text-yellow-600',
    titleClasses: 'text-yellow-900'
  },
  error: {
    classes: 'bg-red-50 border-red-200 text-red-800',
    iconClasses: 'text-red-600',
    titleClasses: 'text-red-900'
  }
}

const config = computed(() => variantConfig[props.variant])

const alertClasses = computed(() => {
  return [
    'border rounded-lg p-4',
    config.value.classes
  ].join(' ')
})

const iconClasses = computed(() => {
  return [
    'w-5 h-5',
    config.value.iconClasses
  ].join(' ')
})

const titleClasses = computed(() => {
  return [
    'font-medium text-sm mb-1',
    config.value.titleClasses
  ].join(' ')
})

const contentClasses = computed(() => {
  return props.title ? 'text-sm' : 'text-sm font-medium'
})

const dismissButtonClasses = computed(() => {
  return [
    'rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    config.value.iconClasses,
    'hover:bg-black hover:bg-opacity-10 focus:ring-current'
  ].join(' ')
})

const dismiss = () => {
  show.value = false
  emit('dismiss')
}
</script>

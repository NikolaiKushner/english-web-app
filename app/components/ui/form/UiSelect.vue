<template>
  <div class="space-y-1">
    <label v-if="label" :for="selectId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        v-model="selectValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Custom dropdown arrow -->
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
    
    <div v-if="hint || error" class="text-sm">
      <p v-if="error" class="text-red-600 flex items-center space-x-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ error }}</span>
      </p>
      <p v-else-if="hint" class="text-gray-500">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  options?: (Option | string | number)[]
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  options: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Normalize options to consistent format
const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'string' || typeof option === 'number') {
      return { label: String(option), value: option }
    }
    return option
  })
})

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
}

const labelClasses = 'block text-sm font-medium text-gray-700'

const selectClasses = computed(() => {
  const baseClasses = 'w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200 appearance-none bg-white pr-10'
  
  const classes = [
    baseClasses,
    sizeClasses[props.size]
  ]

  // State-based styling
  if (props.error) {
    classes.push('border-red-300 focus:ring-red-500 focus:border-red-500')
  } else if (props.disabled) {
    classes.push('border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed')
  } else {
    classes.push('border-gray-300 focus:ring-blue-500 focus:border-blue-500')
  }

  return classes.join(' ')
})

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

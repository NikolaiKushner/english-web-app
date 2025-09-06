<template>
  <div class="space-y-1">
    <label v-if="label" :for="textareaId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <textarea
        :id="textareaId"
        v-model="textareaValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :class="textareaClasses"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="maxLength" class="absolute bottom-2 right-2 text-xs text-gray-400">
        {{ currentLength }}/{{ maxLength }}
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
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  maxLength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  resize: 'vertical',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const textareaId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)

const textareaValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})

const currentLength = computed(() => textareaValue.value.length)

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
}

const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x', 
  both: 'resize'
}

const labelClasses = 'block text-sm font-medium text-gray-700'

const textareaClasses = computed(() => {
  const baseClasses = 'w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200'
  
  const classes = [
    baseClasses,
    sizeClasses[props.size],
    resizeClasses[props.resize]
  ]

  // Add padding for character count
  if (props.maxLength) {
    classes.push('pb-6')
  }

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

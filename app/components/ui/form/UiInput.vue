<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <div v-if="$slots['icon-left']" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <slot name="icon-left" />
      </div>
      
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="$slots['icon-right']" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <slot name="icon-right" />
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
  modelValue?: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm', 
  lg: 'px-4 py-3 text-base'
}

const labelClasses = 'block text-sm font-medium text-gray-700'

const inputClasses = computed(() => {
  const baseClasses = 'w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200'
  
  const classes = [
    baseClasses,
    sizeClasses[props.size]
  ]

  // Icon padding adjustments
  if (slots['icon-left']) {
    classes.push('pl-10')
  }
  if (slots['icon-right']) {
    classes.push('pr-10')
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

const slots = useSlots()

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

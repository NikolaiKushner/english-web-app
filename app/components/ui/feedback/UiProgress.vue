<template>
  <div class="space-y-2">
    <div v-if="showLabel" class="flex items-center justify-between text-sm">
      <span class="font-medium text-gray-700">{{ label || 'Progress' }}</span>
      <span class="text-gray-500">{{ displayValue }}</span>
    </div>
    
    <div :class="trackClasses">
      <div 
        :class="barClasses"
        :style="barStyle"
        role="progressbar"
        :aria-valuenow="value"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-label="label"
      >
        <div v-if="animated" class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number
  max?: number
  min?: number
  label?: string
  showLabel?: boolean
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  min: 0,
  showLabel: true,
  showValue: true,
  variant: 'default',
  size: 'md',
  animated: false,
  striped: false
})

const percentage = computed(() => {
  const range = props.max - props.min
  const adjustedValue = Math.max(props.min, Math.min(props.max, props.value))
  return ((adjustedValue - props.min) / range) * 100
})

const displayValue = computed(() => {
  if (!props.showValue) return ''
  return `${Math.round(percentage.value)}%`
})

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
}

const variantClasses = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500', 
  danger: 'bg-red-500',
  info: 'bg-blue-500'
}

const trackClasses = computed(() => {
  return [
    'w-full bg-gray-200 rounded-full overflow-hidden',
    sizeClasses[props.size]
  ].join(' ')
})

const barClasses = computed(() => {
  const classes = [
    'h-full transition-all duration-300 ease-out relative',
    variantClasses[props.variant]
  ]

  if (props.striped) {
    classes.push('bg-stripes')
  }

  return classes.join(' ')
})

const barStyle = computed(() => ({
  width: `${percentage.value}%`
}))
</script>

<style scoped>
.bg-stripes {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.animate-pulse .bg-stripes {
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 1rem 0;
  }
}
</style>

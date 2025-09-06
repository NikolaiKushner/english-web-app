<template>
  <div :class="spinnerClasses">
    <div :class="innerClasses"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'gray' | 'green' | 'red' | 'yellow' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'blue'
})

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4', 
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  blue: 'border-blue-600',
  white: 'border-white',
  gray: 'border-gray-600',
  green: 'border-green-600',
  red: 'border-red-600',
  yellow: 'border-yellow-600',
  purple: 'border-purple-600'
}

const spinnerClasses = computed(() => {
  return [
    'animate-spin',
    sizeClasses[props.size]
  ].join(' ')
})

const innerClasses = computed(() => {
  return [
    'rounded-full border-2 border-transparent border-t-current',
    'w-full h-full',
    colorClasses[props.color]
  ].join(' ')
})
</script>

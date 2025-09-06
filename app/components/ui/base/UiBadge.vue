<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: boolean
  outline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  rounded: false,
  outline: false
})

const sizeClasses = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base'
}

const variantClasses = {
  default: props.outline 
    ? 'text-gray-600 border border-gray-300' 
    : 'text-gray-800 bg-gray-100',
  primary: props.outline 
    ? 'text-blue-600 border border-blue-300' 
    : 'text-blue-800 bg-blue-100',
  success: props.outline 
    ? 'text-green-600 border border-green-300' 
    : 'text-green-800 bg-green-100',
  warning: props.outline 
    ? 'text-yellow-600 border border-yellow-300' 
    : 'text-yellow-800 bg-yellow-100',
  danger: props.outline 
    ? 'text-red-600 border border-red-300' 
    : 'text-red-800 bg-red-100',
  info: props.outline 
    ? 'text-blue-600 border border-blue-300' 
    : 'text-blue-800 bg-blue-100'
}

const badgeClasses = computed(() => {
  const classes = [
    'inline-flex items-center font-medium',
    sizeClasses[props.size],
    variantClasses[props.variant]
  ]

  if (props.rounded) {
    classes.push('rounded-full')
  } else {
    classes.push('rounded')
  }

  return classes.join(' ')
})
</script>

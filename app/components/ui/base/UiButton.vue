<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="linkProps"
  >
    <span v-if="loading" class="flex items-center space-x-2">
      <UiSpinner :size="spinnerSize" />
      <span v-if="loadingText">{{ loadingText }}</span>
      <span v-else><slot /></span>
    </span>
    <span v-else class="flex items-center justify-center space-x-2">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </span>
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  type?: 'button' | 'submit' | 'reset'
  to?: string
  href?: string
  target?: string
  block?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  rounded: false
})

// Determine the component tag
const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

// Link props for NuxtLink or anchor
const linkProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href, target: props.target }
  return {}
})

// Size configurations
const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
}

const spinnerSizes = {
  xs: 'xs',
  sm: 'sm', 
  md: 'sm',
  lg: 'md',
  xl: 'md'
}

const spinnerSize = computed(() => spinnerSizes[props.size])

// Variant configurations
const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent focus:ring-gray-500',
  success: 'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent focus:ring-yellow-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300 focus:ring-gray-500',
  link: 'bg-transparent hover:underline text-blue-600 border-transparent focus:ring-blue-500 p-0'
}

// Compute final classes
const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const classes = [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant]
  ]

  // Add conditional classes
  if (props.variant !== 'link') {
    classes.push('border')
    classes.push(props.rounded ? 'rounded-full' : 'rounded-lg')
  }

  if (props.block) {
    classes.push('w-full')
  }

  if (props.disabled || props.loading) {
    classes.push('opacity-50 cursor-not-allowed')
  }

  return classes.join(' ')
})
</script>

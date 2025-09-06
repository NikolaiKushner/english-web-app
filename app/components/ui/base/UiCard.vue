<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" :class="headerClasses">
      <slot name="header">
        <h3 v-if="title" :class="titleClasses">{{ title }}</h3>
      </slot>
    </div>
    
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  rounded: true,
  hover: false
})

const variantClasses = {
  default: 'bg-white border border-gray-200',
  outlined: 'bg-transparent border-2 border-gray-300',
  elevated: 'bg-white shadow-lg border border-gray-100',
  flat: 'bg-gray-50'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

const cardClasses = computed(() => {
  const classes = [
    variantClasses[props.variant]
  ]

  if (props.rounded) {
    classes.push('rounded-lg')
  }

  if (props.hover) {
    classes.push('transition-shadow duration-200 hover:shadow-lg')
  }

  return classes.join(' ')
})

const headerClasses = computed(() => {
  const classes = ['border-b border-gray-200']
  
  if (props.padding !== 'none') {
    classes.push('px-6 py-4')
  }
  
  return classes.join(' ')
})

const titleClasses = 'text-lg font-semibold text-gray-900'

const bodyClasses = computed(() => {
  return props.padding !== 'none' ? paddingClasses[props.padding] : ''
})

const footerClasses = computed(() => {
  const classes = ['border-t border-gray-200 bg-gray-50']
  
  if (props.padding !== 'none') {
    classes.push('px-6 py-4')
  }
  
  return classes.join(' ')
})
</script>

// Base Components
export { default as UiButton } from './base/UiButton.vue'
export { default as UiCard } from './base/UiCard.vue'
export { default as UiSpinner } from './base/UiSpinner.vue'
export { default as UiBadge } from './base/UiBadge.vue'

// Form Components
export { default as UiInput } from './form/UiInput.vue'
export { default as UiSelect } from './form/UiSelect.vue'
export { default as UiTextarea } from './form/UiTextarea.vue'

// Feedback Components
export { default as UiAlert } from './feedback/UiAlert.vue'
export { default as UiToast } from './feedback/UiToast.vue'
export { default as UiLoadingSpinner } from './feedback/UiLoadingSpinner.vue'
export { default as UiProgress } from './feedback/UiProgress.vue'

// Layout Components
export { default as UiModal } from './layout/UiModal.vue'
export { default as UiErrorBoundary } from './layout/UiErrorBoundary.vue'

// Navigation Components
export { default as UiHeader } from './navigation/UiHeader.vue'
export { default as UiFooter } from './navigation/UiFooter.vue'

// Types
export interface UIComponentProps {
  // Common props that many components share
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: string
  disabled?: boolean
  loading?: boolean
}

export interface FormComponentProps extends UIComponentProps {
  modelValue?: any
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
}

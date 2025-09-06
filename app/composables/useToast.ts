export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useToast = () => {
  const toast = inject('toast', null) as { addToast: (toast: ToastOptions) => string, removeToast: (id: string) => void } | null

  const showToast = (options: ToastOptions) => {
    if (toast) {
      return toast.addToast(options)
    } else {
      // Fallback to console if toast system not available
      console.log(`[${options.type.toUpperCase()}] ${options.title}`, options.message)
      return null
    }
  }

  const success = (title: string, message?: string, duration?: number) => {
    return showToast({ type: 'success', title, message, duration })
  }

  const error = (title: string, message?: string, duration?: number) => {
    return showToast({ type: 'error', title, message, duration })
  }

  const warning = (title: string, message?: string, duration?: number) => {
    return showToast({ type: 'warning', title, message, duration })
  }

  const info = (title: string, message?: string, duration?: number) => {
    return showToast({ type: 'info', title, message, duration })
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    removeToast: toast?.removeToast || (() => {})
  }
}

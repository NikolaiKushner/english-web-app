import { defineStore } from 'pinia'
import type { User } from '@/types'

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: any): string => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please check your credentials and try again.'
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link before signing in.'
    case 'User already registered':
      return 'An account with this email already exists. Try signing in instead.'
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.'
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.'
    case 'signup is disabled':
      return 'New account registration is currently disabled.'
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const { supabase } = useSupabase()

  const signUp = async (email: string, password: string, name?: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        throw new Error(getAuthErrorMessage(error))
      }

      // Create user profile in our public.users table
      if (data.user) {
        try {
          await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              name: name || '',
              avatar_url: data.user.user_metadata?.avatar_url || ''
            })

          // Create user profile
          await supabase
            .from('user_profiles')
            .insert({
              user_id: data.user.id
            })
        } catch (profileError) {
          console.warn('Failed to create user profile:', profileError)
          // Don't fail the signup if profile creation fails
        }
      }
      
      return { data, error: null }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during sign up'
      return { data: null, error: { message: errorMessage } }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        throw new Error(getAuthErrorMessage(error))
      }
      
      return { data, error: null }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during sign in'
      return { data: null, error: { message: errorMessage } }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw new Error('Failed to sign out. Please try again.')
      }
      user.value = null
      return { error: null }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during sign out'
      return { error: { message: errorMessage } }
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    loading.value = true
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error getting current user:', error)
        throw error
      }
      
      user.value = currentUser as User | null
      return currentUser
    } catch (error) {
      console.error('Error getting current user:', error)
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // Listen to auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user as User | null
  })

  return {
    user: readonly(user),
    loading: readonly(loading),
    signUp,
    signIn,
    signOut,
    getCurrentUser
  }
})

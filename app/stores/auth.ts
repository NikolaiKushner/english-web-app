import { defineStore } from 'pinia'
import type { User } from '~/types'

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
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
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
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    loading.value = true
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser as User | null
      return currentUser
    } catch (error) {
      console.error('Error getting current user:', error)
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

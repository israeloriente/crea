import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (err) throw err
      user.value = data.user
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao fazer login'
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      loading.value = true
      error.value = null
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      user.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao fazer logout'
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password
      })
      if (err) throw err
      user.value = data.user
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar conta'
    } finally {
      loading.value = false
    }
  }

  // Initialize user on store creation
  async function init() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    init
  }
})
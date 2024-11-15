import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { login } from '@/services/api'
import { signup } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  async function loginUser(email: string, password: string) {
    try {
      const data = await login(email, password)
      user.value = {
        id: data.user_id,
        email: data.email,
        name: data.name,
        role: data.role,
      }
      token.value = data.jwt
      localStorage.setItem('token', data.jwt)
      return true
    } catch {
      return false
    }
  }

  async function signupUser(userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: string
  }) {
    try {
      const data = await signup(userData)
      user.value = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }
      token.value = data.token
      localStorage.setItem('token', data.token)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, loginUser, logout, signupUser }
})

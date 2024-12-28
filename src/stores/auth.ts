// auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { login, signup } from '@/services/api'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  async function initializeAuth() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken)
        if (decoded.exp * 1000 < Date.now()) {
          logout()
          return
        }
        token.value = storedToken
        user.value = {
          id: decoded.user_id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        }
      } catch (error) {
        console.error('Token validation error:', error)
        logout()
      }
    }
  }

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
    } catch (error) {
      console.error('Login error:', error)
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
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  async function setToken(newToken: string) {
    try {
      const decoded: any = jwtDecode(newToken)
      token.value = newToken
      localStorage.setItem('token', newToken)

      user.value = {
        id: decoded.user_id,
        email: decoded.email,
        name: decoded.name,
        role: 'user',
      }
      return true
    } catch (error) {
      console.error('Error setting token:', error)
      logout()
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    loginUser,
    logout,
    signupUser,
    initializeAuth,
    setToken,
  }
})

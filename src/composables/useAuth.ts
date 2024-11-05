import { ref, readonly } from 'vue'
import type { User } from '@/types'

const user = ref<User | null>(null)
const token = ref<string | null>(localStorage.getItem('token'))
const isLoggedIn = ref<boolean>(!!token.value)

export function useAuth() {
  const setUser = (newUser: User | null) => {
    user.value = newUser
    isLoggedIn.value = !!newUser
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return {
    user: readonly(user),
    isLoggedIn: readonly(isLoggedIn),
    token: readonly(token),
    setUser,
    setToken,
    logout
  }
}
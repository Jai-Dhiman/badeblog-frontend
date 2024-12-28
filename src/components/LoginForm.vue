<template>
  <form @submit.prevent="handleSubmit" class="card max-w-md mx-auto">
    <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <button
      type="button"
      @click="signInWithGoogle"
      class="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        class="w-5 h-5"
      />
      <span class="text-gray-700 font-medium">Continue with Google</span>
    </button>

    <div class="relative mb-4">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Or continue with email</span>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Email:</label>
      <input v-model="email" type="email" required class="input" placeholder="Enter your email" />
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 mb-2">Password:</label>
      <input
        v-model="password"
        type="password"
        required
        class="input"
        placeholder="Enter your password"
      />
    </div>

    <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
      {{ isLoading ? 'Logging in...' : 'Login' }}
    </button>

    <div class="mt-4 text-center text-sm">
      Don't have an account?
      <router-link to="/signup" class="text-accent hover:text-secondary ml-1">
        Sign Up
      </router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import type { ApiError } from '@/types'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const signInWithGoogle = () => {
  console.log('API URL:', apiUrl)

  if (!apiUrl) {
    error.value = 'API URL is not configured'
    return
  }
  try {
    window.location.href = `${apiUrl}/auth/google_oauth2`
  } catch (err) {
    console.error('Redirect error:', err)
    error.value = 'Failed to redirect to Google login'
  }
}

async function handleSubmit() {
  error.value = ''
  isLoading.value = true

  try {
    const success = await authStore.loginUser(email.value, password.value)
    if (success) {
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    } else {
      error.value = 'Invalid email or password'
    }
  } catch (err) {
    const apiError = err as ApiError
    error.value = apiError.message || apiError.error || 'An error occurred while logging in'
  } finally {
    isLoading.value = false
  }
}
</script>

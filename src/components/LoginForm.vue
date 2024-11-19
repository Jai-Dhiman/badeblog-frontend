<template>
  <form @submit.prevent="handleSubmit" class="card max-w-md mx-auto">
    <!-- Add error alert if there's an error -->
    <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
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
    <div class="mt-4 text-center">
      Don't have an account?
      <router-link to="/signup" class="text-accent hover:text-secondary">Sign Up</router-link>
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

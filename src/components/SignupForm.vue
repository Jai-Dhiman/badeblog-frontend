<template>
  <form @submit.prevent="handleSubmit" class="card max-w-md mx-auto">
    <!-- Add error alert if there's an error -->
    <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Name:</label>
      <input v-model="name" type="text" required class="input" placeholder="Enter your name" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Email:</label>
      <input v-model="email" type="email" required class="input" placeholder="Enter your email" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Password:</label>
      <input
        v-model="password"
        type="password"
        required
        class="input"
        placeholder="Enter your password"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 mb-2">Confirm Password:</label>
      <input
        v-model="passwordConfirmation"
        type="password"
        required
        class="input"
        placeholder="Confirm your password"
      />
    </div>
    <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
      {{ isLoading ? 'Signing up...' : 'Sign Up' }}
    </button>
    <div class="mt-4 text-center">
      Already have an account?
      <router-link to="/login" class="text-accent hover:text-secondary">Login</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { ApiError } from '@/types'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  error.value = ''

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    const success = await authStore.signupUser({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      role: 'user',
    })
    if (success) {
      router.push('/')
    } else {
      error.value = 'Email is already taken or there was an error creating your account'
    }
  } catch (err) {
    const apiError = err as ApiError
    error.value =
      apiError.message || apiError.error || 'An error occurred while creating your account'
  } finally {
    isLoading.value = false
  }
}
</script>

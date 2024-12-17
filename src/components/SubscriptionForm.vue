<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm">
    <h3 class="text-xl font-semibold mb-4">Subscribe to New Stories</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          required
        />
      </div>
      <button type="submit" :disabled="loading" class="btn btn-primary w-full">
        {{ loading ? 'Subscribing...' : 'Subscribe' }}
      </button>
      <p v-if="message" :class="[status === 'error' ? 'text-red-500' : 'text-green-500']">
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ApiError } from '@/types'
import * as apiService from '@/services/api'

const email = ref('')
const loading = ref(false)
const message = ref('')
const status = ref('')

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  try {
    await apiService.subscribeToNewStories(email.value)
    message.value = 'Successfully subscribed!'
    status.value = 'success'
    email.value = ''
  } catch (err) {
    const error = err as { response?: { data: ApiError } }
    message.value = error.response?.data?.message || 'Failed to subscribe. Please try again.'
    status.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

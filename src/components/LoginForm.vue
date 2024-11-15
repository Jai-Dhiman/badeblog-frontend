<template>
  <form @submit.prevent="handleSubmit" class="card max-w-md mx-auto">
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
    <button type="submit" class="btn btn-primary w-full">Login</button>
    <div class="mt-4 text-center">
      Don't have an account?
      <router-link to="/signup" class="text-accent hover:text-secondary">Sign Up</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  const success = await authStore.loginUser(email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

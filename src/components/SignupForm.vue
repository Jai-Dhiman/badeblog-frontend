<template>
  <form @submit.prevent="handleSubmit" class="card max-w-md mx-auto">
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
    <button type="submit" class="btn btn-primary w-full">Sign Up</button>
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

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  const success = await authStore.signupUser({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
    role: 'user',
  })
  if (success) {
    router.push('/')
  }
}
</script>

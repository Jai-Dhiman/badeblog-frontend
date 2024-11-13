<template>
  <form @submit.prevent="handleSubmit" class="max-w-md mx-auto mt-8 p-4">
    <div class="mb-4">
      <label class="block mb-2">Email:</label>
      <input v-model="email" type="email" required class="w-full p-2 border rounded" />
    </div>
    <div class="mb-4">
      <label class="block mb-2">Password:</label>
      <input v-model="password" type="password" required class="w-full p-2 border rounded" />
    </div>
    <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
      Login
    </button>
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
    router.push('/stories')
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const message = ref('Processing authentication...')

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (token) {
      await authStore.setToken(token)
      message.value = 'Authentication successful!'
      router.push('/')
    } else {
      message.value = 'Authentication failed: No token received'
      setTimeout(() => router.push('/login'), 2000)
    }
  } catch (error) {
    console.error('Authentication error:', error)
    message.value = 'Authentication failed'
    setTimeout(() => router.push('/login'), 2000)
  }
})
</script>

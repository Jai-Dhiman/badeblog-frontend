<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-primary shadow-md">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <router-link to="/" class="text-white text-xl font-bold"> Home </router-link>

          <div v-if="authStore.user">
            <router-link to="/stories" class="text-white hover:text-gray-200 mr-4">
              Stories
            </router-link>
            <button @click="authStore.logout" class="text-white hover:text-gray-200">Logout</button>
          </div>
          <router-link v-else to="/login" class="text-white hover:text-gray-200">
            Login
          </router-link>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
</script>

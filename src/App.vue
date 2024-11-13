<template>
  <main>
    <nav class="bg-gray-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-white text-xl font-bold"> Stories App </router-link>

        <div v-if="authStore.user">
          <router-link to="/stories" class="text-white mr-4 hover:text-gray-300">
            Stories
          </router-link>
          <button @click="authStore.logout" class="text-white hover:text-gray-300">Logout</button>
        </div>
        <router-link v-else to="/login" class="text-white hover:text-gray-300"> Login </router-link>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <router-view />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

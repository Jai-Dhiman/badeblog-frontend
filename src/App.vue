<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-primary shadow-md">
      <div class="container mx-auto px-4 py-3">
        <!-- Top navigation with auth -->
        <div class="flex justify-between items-center mb-3">
          <router-link to="/" class="text-white text-xl font-bold"> Home </router-link>
          <div class="flex items-center space-x-4">
            <div v-if="authStore.user">
              <div class="flex items-center space-x-4">
                <router-link
                  v-if="authStore.user.role === 'admin'"
                  to="/drafts"
                  class="text-white hover:text-gray-200"
                >
                  Drafts
                </router-link>
                <button @click="authStore.logout" class="text-white hover:text-gray-200">
                  Logout
                </button>
              </div>
            </div>
            <div v-else class="flex items-center space-x-4">
              <router-link to="/signup" class="text-white hover:text-gray-200">
                Sign Up
              </router-link>
              <router-link to="/login" class="text-white hover:text-gray-200"> Login </router-link>
            </div>
          </div>
        </div>
        <!-- Category navigation -->
        <div class="flex space-x-6 overflow-x-auto">
          <router-link to="/essays" class="text-white hover:text-gray-200 whitespace-nowrap">
            Essays
          </router-link>
          <router-link to="/articles" class="text-white hover:text-gray-200 whitespace-nowrap">
            Articles
          </router-link>
          <router-link to="/short-stories" class="text-white hover:text-gray-200 whitespace-nowrap">
            Short Stories
          </router-link>
          <router-link to="/poems" class="text-white hover:text-gray-200 whitespace-nowrap">
            Poems
          </router-link>
          <router-link to="/plays" class="text-white hover:text-gray-200 whitespace-nowrap">
            Plays
          </router-link>
          <router-link to="/others" class="text-white hover:text-gray-200 whitespace-nowrap">
            Other
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

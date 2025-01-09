<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-primary shadow-md">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <!-- Left section -->
          <div class="flex items-center space-x-6">
            <router-link to="/" class="text-white hover:text-gray-200 text-xl font-bold">
              Home
            </router-link>

            <!-- Stories dropdown -->
            <div class="relative group">
              <button class="text-white hover:text-gray-200 flex items-center space-x-1 py-2">
                <span>Stories</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div class="absolute left-0 w-48 pt-2">
                <!-- Actual dropdown content -->
                <div
                  class="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block"
                >
                  <div class="py-1">
                    <router-link
                      to="/articles"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Articles
                    </router-link>
                    <router-link
                      to="/short-stories"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Short Stories
                    </router-link>
                    <router-link
                      to="/poems"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Poems
                    </router-link>
                    <router-link
                      to="/plays"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Plays
                    </router-link>
                    <!-- <router-link
                      to="/others"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Other
                    </router-link> -->
                  </div>
                </div>
              </div>
            </div>

            <!-- About Me dropdown -->
            <div class="relative group">
              <button class="text-white hover:text-gray-200 flex items-center space-x-1 py-2">
                <span>About Me</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <!-- Added pt-2 for gap coverage -->
              <div class="absolute left-0 w-48 pt-2">
                <!-- Actual dropdown content -->
                <div
                  class="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block"
                >
                  <div class="py-1">
                    <router-link
                      to="/about"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      About Me
                    </router-link>
                    <router-link
                      to="/acknowledge"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Acknowledgements
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right section -->
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
            <div v-else class="relative group">
              <!-- Login dropdown button -->
              <button class="text-white hover:text-gray-200 flex items-center space-x-1 py-2">
                <span>Login</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <!-- Dropdown menu -->
              <div class="absolute right-0 w-48 pt-2">
                <div
                  class="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block"
                >
                  <div class="py-1">
                    <router-link
                      to="/login"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </router-link>
                    <router-link
                      to="/signup"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Up
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

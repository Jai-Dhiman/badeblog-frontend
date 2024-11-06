<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex items-center px-4 text-2xl font-bold text-gray-900" aria-label="Home">
              Life Stories
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="isLoggedIn">
              <router-link
                to="/stories/new"
                class="inline-flex items-center px-6 py-3 text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Write new story"
              >
                Write Story
              </router-link>

              <button
                @click="logout"
                class="px-6 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Log out"
              >
                Logout
              </button>
            </template>

            <template v-else>
              <router-link
                to="/login"
                class="px-6 py-3 text-lg font-medium text-blue-600 hover:text-blue-900"
                aria-label="Log in"
              >
                Login
              </router-link>

              <router-link
                to="/register"
                class="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                aria-label="Create account"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { auth } from "./services/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = computed(() => auth.isAuthenticated());

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<style>
:root {
  --primary-font-size: 16px;
  --heading-font-size: 24px;
  --button-font-size: 18px;
}

body {
  font-size: var(--primary-font-size);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* High contrast text */
.text-gray-700 {
  color: #374151;
}

/* Larger touch targets */
button,
a {
  min-height: 44px;
  min-width: 44px;
}

/* Focus states for accessibility */
*:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Improve form field visibility */
input,
textarea,
select {
  font-size: var(--primary-font-size);
  padding: 0.75rem;
  border: 2px solid #d1d5db;
}

/* Error messages */
.error-message {
  color: #dc2626;
  font-size: var(--primary-font-size);
  padding: 0.5rem;
  margin-top: 0.5rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
}
</style>

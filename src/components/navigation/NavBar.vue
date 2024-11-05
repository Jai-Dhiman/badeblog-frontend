<template>
  <nav class="bg-blue-600 text-white p-4 shadow-lg">
    <div class="container mx-auto flex items-center justify-between">
      <router-link to="/" class="text-2xl font-bold hover:text-blue-100">Life Stories</router-link>
      <div class="space-x-4">
        <template v-if="isLoggedIn">
          <router-link to="/" class="px-4 py-2 hover:bg-blue-500 rounded-lg transition">Home</router-link>
          <router-link to="/stories/new" class="px-4 py-2 hover:bg-blue-500 rounded-lg transition">
            Write Story
          </router-link>
          <button @click="handleLogout" class="px-4 py-2 hover:bg-blue-500 rounded-lg transition">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition">
            Login
          </router-link>
          <router-link to="/register" class="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition">
            Register
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const { isLoggedIn, logout } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>

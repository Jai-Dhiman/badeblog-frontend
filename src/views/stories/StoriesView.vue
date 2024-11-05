<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Stories</h1>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="story in stories" :key="story.id" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-2">{{ story.title }}</h2>
        <p class="text-gray-600 mb-4">{{ story.content.substring(0, 150) }}...</p>
        <router-link :to="`/stories/${story.id}`" class="text-blue-600 hover:text-blue-800">Read more</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storiesAPI } from "@/services/api";
import type { Story } from "@/types";

const stories = ref<Story[]>([]);

onMounted(async () => {
  try {
    const response = await storiesAPI.getAll();
    stories.value = response.data;
  } catch (error) {
    console.error("Failed to fetch stories:", error);
  }
});
</script>

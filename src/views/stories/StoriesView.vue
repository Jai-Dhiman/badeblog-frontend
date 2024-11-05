<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Stories</h1>
      <router-link
        v-if="auth.isAuthenticated()"
        to="/stories/new"
        class="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Write New Story
      </router-link>
    </div>

    <!-- Categories Filter -->
    <CategoryList :selectedId="selectedCategoryId" @select="handleCategorySelect" />

    <!-- Stories Grid -->
    <div v-if="loading" class="text-center text-xl">Loading stories...</div>

    <div v-else-if="stories.length === 0" class="text-center text-xl">No stories found.</div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StoryCard v-for="story in stories" :key="story.id" :story="story" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storyApi, categoryApi } from "@/services/api";
import { auth } from "@/services/auth";
import { handleApiError } from "@/utils/helpers";
import CategoryList from "@/components/CategoryList.vue";
import StoryCard from "@/components/StoryCard.vue";
import type { Story } from "@/types";

const stories = ref<Story[]>([]);
const loading = ref(true);
const selectedCategoryId = ref<number>();

const fetchStories = async (categoryId?: number) => {
  try {
    loading.value = true;
    const response = categoryId ? await categoryApi.getStories(categoryId) : await storyApi.getAll();
    stories.value = response.data;
  } catch (error) {
    alert(handleApiError(error));
  } finally {
    loading.value = false;
  }
};

const handleCategorySelect = (categoryId: number) => {
  selectedCategoryId.value = categoryId;
  fetchStories(categoryId);
};

onMounted(() => {
  fetchStories();
});
</script>

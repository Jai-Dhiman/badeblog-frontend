<template>
  <article
    class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    :class="{ 'border-2 border-blue-600': isHighlighted }"
  >
    <div v-if="story.photoUrl" class="mb-4">
      <img :src="story.photoUrl" :alt="story.title" class="w-full h-48 object-cover rounded-lg" loading="lazy" />
    </div>

    <header class="mb-4">
      <h2 class="text-2xl font-bold mb-2 text-gray-900">
        {{ story.title }}
      </h2>
      <div class="flex items-center text-gray-600 space-x-4">
        <span class="text-lg">{{ story.user?.name }}</span>
        <span>•</span>
        <time :datetime="story.createdAt" class="text-lg">
          {{ formatDate(story.createdAt) }}
        </time>
      </div>
    </header>

    <div class="mb-4">
      <p class="text-lg text-gray-700 line-clamp-3">
        {{ stripHtml(truncateText(story.content)) }}
      </p>
    </div>

    <footer class="flex justify-between items-center">
      <router-link :to="`/stories/${story.id}`" class="text-lg text-blue-600 hover:text-blue-800 hover:underline">
        Read more
      </router-link>

      <div class="flex items-center space-x-2 text-gray-600">
        <span class="text-lg">{{ story.comments?.length || 0 }} comments</span>
        <span v-if="story.category" class="px-3 py-1 bg-gray-100 rounded-full text-sm">
          {{ story.category.name }}
        </span>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { formatDate, truncateText } from "@/utils/helpers";
import type { Story } from "@/types";

const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

defineProps<{
  story: Story;
  isHighlighted?: boolean;
}>();
</script>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>

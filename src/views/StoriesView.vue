<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Stories</h1>
      <router-link
        to="/stories/new"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Write New Story
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-4">Loading...</div>

    <div v-else-if="error" class="text-red-500 text-center py-4">
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div v-for="story in stories" :key="story.id" class="border p-4 rounded shadow">
        <h2 class="text-xl font-bold">
          <router-link :to="`/stories/${story.id}`" class="hover:text-accent">
            {{ story.title }}
          </router-link>
        </h2>
        <p class="text-gray-600 mt-2">
          {{ formatDate(story.created_at) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getStories } from '@/services/api'
import type { Story } from '@/types'

const stories = ref<Story[]>([])
const loading = ref(true)
const error = ref('')

function formatDate(dateString?: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  try {
    stories.value = await getStories()
  } catch {
    error.value = 'Failed to load stories'
  } finally {
    loading.value = false
  }
})
</script>

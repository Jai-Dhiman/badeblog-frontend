<template>
  <div class="max-w-4xl mx-auto px-4">
    <header class="text-center my-8">
      <h1 class="text-3xl font-bold mb-4">Welcome to BadeBlog</h1>
      <p class="text-xl text-gray-600">A place to share and preserve life stories and memories.</p>
    </header>

    <div class="mb-8">
      <div v-if="authStore.user?.role === 'admin'" class="text-right mb-6">
        <router-link
          to="/stories/new"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          Write New Story
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-4">
        <p>Loading stories...</p>
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-4">
        {{ error }}
      </div>

      <div v-else-if="stories.length === 0" class="text-center py-4">
        <p>No stories have been shared yet.</p>
      </div>

      <div v-else class="space-y-8">
        <article
          v-for="story in stories"
          :key="story.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <router-link :to="`/stories/${story.id}`" class="block">
            <h2 class="text-2xl font-bold mb-2 text-primary hover:text-accent">
              {{ story.title }}
            </h2>
          </router-link>

          <div class="flex items-center text-gray-600 text-sm mb-4">
            <span>{{ formatDate(story.created_at) }}</span>
            <span class="mx-2">•</span>
            <span>{{ story.category?.name }}</span>
          </div>

          <div
            class="prose prose-sm line-clamp-3 mb-4"
            v-html="truncateContent(story.content)"
          ></div>

          <router-link
            :to="`/stories/${story.id}`"
            class="text-accent hover:text-secondary font-medium"
          >
            Read more →
          </router-link>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getStories } from '@/services/api'
import type { Story } from '@/types'

const authStore = useAuthStore()
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

function truncateContent(content?: string) {
  if (!content) return ''
  // Strip HTML tags and truncate to ~200 characters
  const strippedContent = content.replace(/<[^>]*>/g, '')
  return strippedContent.length > 200 ? strippedContent.slice(0, 200) + '...' : strippedContent
}

onMounted(async () => {
  try {
    stories.value = await getStories()
  } catch (err) {
    error.value = 'Failed to load stories'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

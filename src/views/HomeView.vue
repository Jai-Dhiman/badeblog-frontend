<template>
  <div class="max-w-4xl mx-auto px-4">
    <header class="text-center my-8">
      <h1 class="text-3xl font-bold mb-4">Welcome to BadeBlog</h1>
      <p class="text-xl text-gray-600">A place to share and preserve life stories and memories.</p>
    </header>

    <div class="mb-8">
      <div v-if="authStore.user?.role === 'admin'" class="text-center mb-6">
        <router-link
          to="/stories/new"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          New Work
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-4">Loading stories...</div>

      <div v-else-if="error" class="text-red-500 text-center py-4">
        {{ error }}
      </div>

      <div v-if="stories.length === 0" class="text-center py-4">No stories found.</div>

      <div v-else class="space-y-8">
        <article
          v-for="story in stories"
          :key="story.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-2xl font-bold mb-2">
            <router-link :to="`/stories/${story.id}`" class="hover:text-accent">
              {{ story.attributes.title }}
            </router-link>
          </h2>

          <div class="flex items-center text-gray-600 text-sm mb-4">
            <span>{{ formatDate(story.attributes['created-at']) }}</span>
            <span class="mx-2">•</span>
            <span>{{ categoryNames[story.id] || 'Loading...' }}</span>
          </div>

          <div class="prose prose-sm line-clamp-3 mb-4" v-html="story.attributes.content"></div>

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
import { getStories, getCategory } from '@/services/api'
import type { Story } from '@/types'

const authStore = useAuthStore()
const stories = ref<Story[]>([])
const loading = ref(true)
const error = ref('')
const categoryNames = ref<Record<string, string>>({})

function formatDate(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function fetchCategoryName(story: Story) {
  try {
    const categoryId = story.relationships.category.data.id
    const categoryResponse = await getCategory(categoryId)
    categoryNames.value[story.id] = categoryResponse.data.attributes.name
  } catch (error) {
    console.error('Error fetching category:', error)
    categoryNames.value[story.id] = 'Uncategorized'
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const data = await getStories()
    stories.value = Array.isArray(data) ? data : []

    await Promise.all(stories.value.map(fetchCategoryName))
  } catch (err) {
    console.error('Failed to load stories:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load stories'
  } finally {
    loading.value = false
  }
})
</script>

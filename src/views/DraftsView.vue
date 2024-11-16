<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Drafts</h1>

    <div v-if="loading" class="text-center py-4">Loading...</div>

    <div v-else-if="drafts.length === 0" class="text-center py-4">No drafts found</div>

    <div v-else class="space-y-4">
      <div
        v-for="story in drafts"
        :key="story.id"
        class="bg-white p-6 border rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h2 class="text-xl font-semibold">{{ story.attributes.title }}</h2>
        <p class="text-gray-600 mt-2">
          {{ getCategoryName(story.relationships.category.data.id) }}
        </p>
        <div class="mt-4 flex gap-2">
          <router-link
            :to="`/stories/${story.id}/edit`"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDrafts } from '@/services/api'
import { getCategories } from '@/services/api'
import type { Story, Category } from '@/types'

const drafts = ref<Story[]>([])
const loading = ref(true)
const categories = ref<Category[]>([])

function getCategoryName(categoryId: string): string {
  const category = categories.value.find((c: Category) => c.id.toString() === categoryId)
  return category?.attributes?.name || 'Unknown Category'
}

onMounted(async () => {
  try {
    const [draftsResponse, categoriesResponse] = await Promise.all([getDrafts(), getCategories()])
    drafts.value = draftsResponse
    categories.value = categoriesResponse
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
})
</script>

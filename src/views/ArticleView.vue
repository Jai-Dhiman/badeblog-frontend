<template>
  <CategoryStoriesLayout v-if="categoryId" :category-id="categoryId" title="Articles" />
  <div v-else class="text-center py-4">Loading...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CategoryStoriesLayout from '@/components/CategoryStoriesLayout.vue'
import { getCategories } from '@/services/api'
import type { Category } from '@/types'

const categoryId = ref<string | null>(null)

onMounted(async () => {
  try {
    const categories = await getCategories()
    const essayCategory = categories.find(
      (c: Category) => c.attributes.name.toLowerCase() === 'article',
    )
    if (essayCategory) {
      categoryId.value = essayCategory.id
    }
  } catch (err) {
    console.error('Failed to fetch category:', err)
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Write New Story</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block mb-2">Title</label>
        <input v-model="title" type="text" class="w-full p-2 border rounded" required />
      </div>

      <div>
        <label class="block mb-2">Category</label>
        <select v-model="categoryId" class="w-full p-2 border rounded" required>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-2">Content</label>
        <textarea v-model="content" rows="10" class="w-full p-2 border rounded" required></textarea>
      </div>

      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Save Story' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createStory, getCategories } from '@/services/api'
import type { Category } from '@/types'

const router = useRouter()
const title = ref('')
const content = ref('')
const categoryId = ref<number>()
const categories = ref<Category[]>([])
const loading = ref(false)

onMounted(async () => {
  try {
    categories.value = await getCategories()
  } catch {
    console.error('Failed to load categories')
  }
})

async function handleSubmit() {
  if (!categoryId.value) return

  loading.value = true
  try {
    await createStory({
      title: title.value,
      content: content.value,
      category_id: categoryId.value,
      status: 'published',
    })
    router.push('/stories')
  } catch {
    console.error('Failed to create story')
  } finally {
    loading.value = false
  }
}
</script>

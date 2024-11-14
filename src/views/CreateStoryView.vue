<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Write New Story</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block mb-2 text-lg">Title</label>
        <input v-model="title" type="text" class="w-full p-3 border rounded-lg text-lg" required />
      </div>

      <div>
        <label class="block mb-2 text-lg">Category</label>
        <select v-model="categoryId" class="w-full p-3 border rounded-lg text-lg" required>
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.attributes.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-2 text-lg">Content</label>
        <RichTextEditor v-model="content" class="mb-6" />
      </div>

      <button
        type="submit"
        class="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-opacity-90 transition-colors"
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
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { CreateStoryData, Category } from '@/types'

const router = useRouter()
const title = ref('')
const content = ref('')
const categoryId = ref<number>()
const categories = ref<Category[]>([])
const loading = ref(false)

onMounted(async () => {
  try {
    console.log('Fetching categories...')
    const data = await getCategories()
    console.log('Received categories:', data)
    categories.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})

async function handleSubmit() {
  if (!categoryId.value) return

  loading.value = true
  try {
    const storyData: CreateStoryData = {
      title: title.value,
      content: content.value,
      category_id: categoryId.value,
      status: 'published',
    }
    await createStory(storyData)
    router.push('/stories')
  } catch (error) {
    console.error('Failed to create story:', error)
  } finally {
    loading.value = false
  }
}
</script>

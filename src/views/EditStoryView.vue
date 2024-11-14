<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Edit Story</h1>

    <div v-if="loading" class="text-center py-4">Loading...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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
        {{ loading ? 'Saving...' : 'Update Story' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getStory, updateStory, getCategories } from '@/services/api'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { Category } from '@/types'

const router = useRouter()
const route = useRoute()
const title = ref('')
const content = ref('')
const categoryId = ref<number>()
const categories = ref<Category[]>([])
const loading = ref(true)

function stripTrixContent(content: string): string {
  if (!content) return ''
  const temp = document.createElement('div')
  temp.innerHTML = content
  const trixContent = temp.querySelector('.trix-content')
  return trixContent ? trixContent.innerHTML : content
}

onMounted(async () => {
  try {
    const [storyData, categoriesData] = await Promise.all([
      getStory(Number(route.params.id)),
      getCategories(),
    ])

    const cleanContent = stripTrixContent(storyData.attributes.content)

    title.value = storyData.attributes.title
    content.value = cleanContent
    categoryId.value = storyData.attributes['category-id']
    categories.value = Array.isArray(categoriesData) ? categoriesData : []
  } catch (error) {
    console.error('Failed to load story or categories:', error)
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!categoryId.value) return

  loading.value = true
  try {
    await updateStory(Number(route.params.id), {
      title: title.value,
      content: content.value,
      category_id: categoryId.value,
      status: 'published',
    })
    router.push(`/stories/${route.params.id}`)
  } catch (error) {
    console.error('Failed to update story:', error)
  } finally {
    loading.value = false
  }
}
</script>

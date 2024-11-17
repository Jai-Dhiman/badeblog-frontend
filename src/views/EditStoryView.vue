<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Edit Story</h1>
    <div v-if="loading" class="text-center py-4">Loading...</div>
    <div v-else class="space-y-6">
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
      <div
        v-if="editorError"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ formatError(editorError) }}
      </div>
      <div>
        <label class="block mb-2 text-lg">Content</label>
        <RichTextEditor v-model="content" class="mb-6" @error="handleEditorError" />
      </div>
      <div class="flex gap-4">
        <button
          type="button"
          @click="handleSubmit('draft')"
          class="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save as Draft' }}
        </button>

        <button
          type="button"
          @click="handleSubmit('published')"
          class="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-opacity-90 transition-colors"
          :disabled="loading"
        >
          {{ loading ? 'Publishing...' : 'Publish Story' }}
        </button>

        <button
          type="button"
          @click="confirmDelete"
          class="bg-red-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-600 transition-colors"
          :disabled="loading"
        >
          Delete Story
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getStory, updateStory, getCategories } from '@/services/api'
import { deleteStory } from '@/services/api'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { Category, ApiError } from '@/types'

const router = useRouter()
const route = useRoute()
const title = ref('')
const content = ref('')
const categoryId = ref<string>()
const categories = ref<Category[]>([])
const loading = ref(true)
const editorError = ref<ApiError | null>(null)
const editorInitialized = ref(false)

function formatError(error: ApiError): string {
  if (error.errors?.length) {
    return error.errors.join(', ')
  }
  return error.message || error.error || 'An unexpected error occurred'
}

function handleEditorError(error: unknown) {
  console.error('Editor error:', error)
  const apiError: ApiError = {
    message:
      error instanceof Error
        ? error.message
        : 'There was an error loading the editor. Please refresh the page.',
  }
  editorError.value = apiError
}

onMounted(async () => {
  try {
    loading.value = true

    const [storyData, categoriesData] = await Promise.all([
      getStory(String(route.params.id)),
      getCategories(),
    ])

    title.value = storyData.attributes.title
    content.value = storyData.attributes.content
    categoryId.value = storyData.relationships.category.data.id
    categories.value = categoriesData

    editorInitialized.value = true
  } catch (err) {
    console.error('Failed to load story or categories:', err)
    const error = err as { response?: { data: ApiError } }
    editorError.value = error.response?.data || {
      message: 'Failed to load story data',
    }
  } finally {
    loading.value = false
  }
})

async function handleSubmit(status: 'draft' | 'published') {
  if (!categoryId.value) return

  loading.value = true

  try {
    const storyData = {
      title: title.value,
      content: content.value,
      category_id: categoryId.value,
      status: status,
    }

    await updateStory(String(route.params.id), storyData)
    router.push(status === 'draft' ? '/drafts' : '/')
  } catch (err) {
    const error = err as { response?: { data: ApiError } }
    editorError.value = error.response?.data || {
      message: 'Failed to update story',
    }
    console.error('Failed to update story:', editorError.value)
  } finally {
    loading.value = false
  }
}

async function confirmDelete() {
  if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
    loading.value = true
    try {
      await deleteStory(String(route.params.id))
      router.push('/')
    } catch (error) {
      console.error('Failed to delete story:', error)
    } finally {
      loading.value = false
    }
  }
}
</script>

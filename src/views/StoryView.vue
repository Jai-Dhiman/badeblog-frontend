<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="text-center py-4">Loading...</div>

    <div v-else-if="error" class="text-red-500 text-center py-4">
      {{ error }}
    </div>

    <div v-else class="space-y-6">
      <!-- Story Header -->
      <div class="border-b pb-4">
        <h1 class="text-4xl font-bold mb-2">{{ story?.title }}</h1>
        <div class="flex items-center text-gray-600 space-x-4">
          <span>{{ formatDate(story?.created_at) }}</span>
          <span>·</span>
          <span>{{ story?.category?.name }}</span>
        </div>
      </div>

      <!-- Story Content -->
      <div class="prose prose-lg max-w-none">
        {{ story?.content }}
      </div>

      <!-- Comments Section -->
      <div class="mt-12 pt-8 border-t">
        <h2 class="text-2xl font-bold mb-4">Comments</h2>
        <div v-if="comments.length === 0" class="text-gray-500">No comments yet.</div>
        <div v-else class="space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-4 rounded">
            <div class="font-medium">{{ comment.user?.name }}</div>
            <div class="text-gray-600">{{ comment.content }}</div>
            <div class="text-sm text-gray-500 mt-1">
              {{ formatDate(comment.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Story, Comment } from '@/types'
import { getStory, getStoryComments } from '@/services/api'

const route = useRoute()
const story = ref<Story | null>(null)
const comments = ref<Comment[]>([])
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
  const storyId = route.params.id as string
  try {
    loading.value = true
    const [storyData, commentsData] = await Promise.all([
      getStory(parseInt(storyId)),
      getStoryComments(parseInt(storyId)),
    ])
    story.value = storyData
    comments.value = commentsData
  } catch {
    error.value = 'Failed to load story'
  } finally {
    loading.value = false
  }
})
</script>

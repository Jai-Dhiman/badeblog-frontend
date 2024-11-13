<template>
  <div class="max-w-4xl mx-auto px-4">
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
          <span>•</span>
          <span>{{ story?.category?.name }}</span>
        </div>
      </div>

      <!-- Admin Controls -->
      <div v-if="authStore.user?.role === 'admin'" class="flex space-x-4">
        <button
          @click="handleEdit"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          Edit Story
        </button>
        <button
          @click="handleDelete"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          Delete Story
        </button>
      </div>

      <!-- Story Content -->
      <div class="prose prose-lg max-w-none" v-html="story?.content"></div>

      <!-- Comments Section -->
      <div class="mt-12 pt-8 border-t">
        <h2 class="text-2xl font-bold mb-4">Comments</h2>

        <!-- Comment Form - Only for logged in users -->
        <div v-if="authStore.user" class="mb-6">
          <form @submit.prevent="handleCommentSubmit" class="space-y-4">
            <textarea
              v-model="newComment"
              rows="3"
              class="w-full p-3 border rounded-lg"
              placeholder="Share your thoughts..."
              required
            ></textarea>
            <button
              type="submit"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
              :disabled="commentLoading"
            >
              {{ commentLoading ? 'Posting...' : 'Post Comment' }}
            </button>
          </form>
        </div>

        <div v-else class="mb-6 p-4 bg-gray-50 rounded-lg">
          <p>
            <router-link to="/login" class="text-accent hover:text-secondary"> Log in </router-link>
            to leave a comment.
          </p>
        </div>

        <!-- Comments List -->
        <div v-if="comments.length === 0" class="text-gray-500">No comments yet.</div>
        <div v-else class="space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg">
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
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Story, Comment } from '@/types'
import { getStory, getStoryComments, deleteStory, createComment } from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const story = ref<Story | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const error = ref('')
const newComment = ref('')
const commentLoading = ref(false)

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

const handleEdit = () => {
  router.push(`/stories/${story.value?.id}/edit`)
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this story?')) return

  try {
    await deleteStory(parseInt(route.params.id as string))
    router.push('/')
  } catch (err) {
    console.error('Failed to delete story:', err)
  }
}

const handleCommentSubmit = async () => {
  if (!story.value?.id) return

  commentLoading.value = true
  try {
    await createComment(story.value.id, { content: newComment.value })
    newComment.value = ''
    comments.value = await getStoryComments(story.value.id)
  } catch (err) {
    console.error('Failed to post comment:', err)
  } finally {
    commentLoading.value = false
  }
}
</script>

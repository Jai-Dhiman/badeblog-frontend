<template>
  <div class="max-w-4xl mx-auto px-4">
    <header class="text-center my-8">
      <h1 class="text-3xl font-bold mb-4">My Ideas My Words</h1>
      <p class="text-xl text-gray-600">
        A place to share and preserve stories and other literary work
      </p>
    </header>

    <div class="mb-8">
      <div v-if="authStore.user?.role === 'admin'" class="text-center mb-6">
        <router-link
          to="/stories/new"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          New Story
        </router-link>
      </div>

      <div v-if="authStore.user?.role === 'admin'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Subscribers</h3>
      <p class="text-3xl font-bold text-primary mb-4">{{ subscriberCount }}</p>

      <div class="mt-4">
        <h4 class="text-md font-semibold mb-2">Subscriber List</h4>
        <div class="max-h-60 overflow-y-auto">
          <ul class="space-y-1">
            <li v-for="email in subscribers" :key="email" class="text-sm text-gray-600">
              {{ email }}
            </li>
          </ul>
        </div>
      </div>
    </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Recent Comments</h3>
          <div v-if="recentComments.length > 0">
            <div
              v-for="comment in recentComments"
              :key="comment.id"
              class="mb-3 p-2 bg-white rounded"
            >
              <p class="text-sm text-gray-600">
                {{ comment.attributes['user-info'].name }} on
                {{ new Date(comment.attributes['created-at']).toLocaleDateString() }} to
                {{ comment.attributes['story-info'].title }}
              </p>
              <p class="mt-1">{{ comment.attributes.content }}</p>
            </div>
          </div>
          <p v-else class="text-gray-500">No recent comments</p>
        </div>
      </div>

      <div v-if="authStore.user?.role != 'admin'" class="mt-8 mb-8">
        <SubscriptionForm />
      </div>

      <div v-if="loading" class="space-y-8">
        <StorySkeletonLoader v-for="n in itemsPerPage" :key="n" />
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-4">
        {{ error }}
      </div>

      <div v-if="paginatedStories.length === 0" class="text-center py-4">No stories found.</div>

      <div v-else class="space-y-8">
        <article
          v-for="story in paginatedStories"
          :key="story.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-2xl font-bold mb-2">
            <router-link :to="`/stories/${story.id}`" class="text-black hover:text-accent">
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
      <PaginationControls
        v-if="stories.length > itemsPerPage"
        :current-page="currentPage"
        :total-pages="totalPages"
        @change-page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getStories, getCategory, getSubscribers, getRecentComments } from '@/services/api'
import type { Story, Comment } from '@/types'
import PaginationControls from '@/components/PaginationControls.vue'
import SubscriptionForm from '@/components/SubscriptionForm.vue'
import StorySkeletonLoader from '@/components/StorySkeletonLoader.vue'

const authStore = useAuthStore()
const stories = ref<Story[]>([])
const loading = ref(true)
const error = ref('')
const categoryNames = ref<Record<string, string>>({})
const currentPage = ref(1)
const itemsPerPage = 5
const subscriberCount = ref(0)
const subscribers = ref<string[]>([])
const recentComments = ref<Comment[]>([])

const totalPages = computed(() => Math.ceil(stories.value.length / itemsPerPage))

const paginatedStories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return stories.value.slice(start, end)
})

const fetchAdminStats = async () => {
  if (authStore.user?.role === 'admin') {
    try {
      const [subscribersResponse, commentsResponse] = await Promise.all([
        getSubscribers(),
        getRecentComments(),
      ])
      subscriberCount.value = subscribersResponse.count
      subscribers.value = subscribersResponse.subscribers
      recentComments.value = commentsResponse.data
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    }
  }
}

function handlePageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
    fetchAdminStats()
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

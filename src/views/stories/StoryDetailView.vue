<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div v-if="loading" class="text-center text-xl">Loading story...</div>

    <template v-else-if="story">
      <!-- Story Header -->
      <div class="space-y-4">
        <h1 class="text-4xl font-bold">{{ story.title }}</h1>
        <div class="flex items-center space-x-4 text-gray-600">
          <span class="text-lg">By {{ story.user?.name }}</span>
          <span>•</span>
          <span class="text-lg">{{ formatDate(story.createdAt) }}</span>
        </div>
      </div>

      <!-- Story Image -->
      <img v-if="story.photoUrl" :src="story.photoUrl" :alt="story.title" class="w-full rounded-lg shadow-lg" />

      <!-- Story Content -->
      <div class="prose max-w-none text-lg leading-relaxed">
        {{ story.content }}
      </div>

      <!-- Comments Section -->
      <div class="border-t pt-8">
        <h2 class="text-2xl font-bold mb-6">Comments</h2>

        <!-- Comment Form -->
        <div v-if="auth.isAuthenticated()" class="mb-8">
          <form @submit.prevent="handleCommentSubmit" class="space-y-4">
            <div>
              <label class="block text-lg font-medium text-gray-700 mb-2">Add a comment</label>
              <textarea
                v-model="newComment"
                rows="3"
                class="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
                placeholder="Write your comment here..."
              ></textarea>
            </div>
            <button type="submit" class="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Post Comment
            </button>
          </form>
        </div>

        <div v-else class="mb-8 text-lg">
          <router-link to="/login" class="text-blue-600 hover:text-blue-800">Log in to comment</router-link>
        </div>

        <!-- Comments List -->
        <div class="space-y-6">
          <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <span class="font-medium text-lg">{{ comment.user?.name }}</span>
              <span class="text-gray-500">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="mt-2 text-lg">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storyApi } from "@/services/api";
import { auth } from "@/services/auth";
import { formatDate, handleApiError } from "@/utils/helpers";
import type { Story, Comment } from "@/types";

const route = useRoute();
const router = useRouter();

const story = ref<Story | null>(null);
const comments = ref<Comment[]>([]);
const newComment = ref("");
const loading = ref(true);

const fetchStory = async () => {
  try {
    loading.value = true;
    const storyId = Number(route.params.id);
    const [storyResponse, commentsResponse] = await Promise.all([storyApi.get(storyId), storyApi.getComments(storyId)]);

    story.value = storyResponse.data;
    comments.value = commentsResponse.data;
  } catch (error) {
    alert(handleApiError(error));
    router.push("/stories");
  } finally {
    loading.value = false;
  }
};

const handleCommentSubmit = async () => {
  if (!story.value || !newComment.value.trim()) return;

  try {
    const response = await storyApi.addComment(story.value.id, {
      content: newComment.value,
    });
    comments.value.unshift(response.data);
    newComment.value = "";
  } catch (error) {
    alert(handleApiError(error));
  }
};

onMounted(() => {
  fetchStory();
});
</script>

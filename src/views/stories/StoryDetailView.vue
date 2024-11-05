<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="story" class="space-y-6">
      <h1 class="text-4xl font-bold">{{ story.title }}</h1>

      <div class="flex items-center text-gray-600 space-x-4">
        <span>By {{ story.user?.name }}</span>
        <span>·</span>
        <span>{{ new Date(story.createdAt).toLocaleDateString() }}</span>
      </div>

      <img v-if="story.photoUrl" :src="story.photoUrl" :alt="story.title" class="w-full rounded-lg shadow-lg" />

      <div class="prose max-w-none" v-html="story.content"></div>

      <!-- Comments Section -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6">Comments</h2>

        <form v-if="isLoggedIn" @submit.prevent="addComment" class="mb-8">
          <textarea
            v-model="newComment"
            rows="3"
            class="w-full rounded-md border border-gray-300 p-2"
            placeholder="Write a comment..."
          ></textarea>
          <button type="submit" class="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Comment
          </button>
        </form>

        <div v-else class="mb-8">
          <router-link to="/login" class="text-blue-600 hover:text-blue-800">Log in to comment</router-link>
        </div>

        <div class="space-y-6">
          <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div class="font-medium">{{ comment.user?.name }}</div>
              <div class="text-sm text-gray-500">
                {{ new Date(comment.createdAt).toLocaleDateString() }}
              </div>
            </div>
            <p class="mt-2">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { storiesAPI } from "@/services/api";

const route = useRoute();
const store = useStore();
const story = ref<any>(null);
const comments = ref<any[]>([]);
const newComment = ref("");

const isLoggedIn = computed(() => store.state.isLoggedIn);

onMounted(async () => {
  const storyId = Number(route.params.id);
  try {
    const [storyResponse, commentsResponse] = await Promise.all([
      storiesAPI.get(storyId),
      fetch(`/api/v1/stories/${storyId}/comments`).then((res) => res.json()),
    ]);
    story.value = storyResponse.data;
    comments.value = commentsResponse;
  } catch (error) {
    console.error("Failed to fetch story data:", error);
  }
});

const addComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    const response = await fetch(`/api/v1/stories/${story.value.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.state.token}`,
      },
      body: JSON.stringify({
        comment: {
          content: newComment.value,
        },
      }),
    });

    const comment = await response.json();
    comments.value.unshift(comment);
    newComment.value = "";
  } catch (error) {
    console.error("Failed to add comment:", error);
    alert("Failed to add comment. Please try again.");
  }
};
</script>

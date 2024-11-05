<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Create New Story</h1>

    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <!-- Add the StoryEditor component here -->
    <StoryEditor @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storyApi } from "@/services/api";
import { handleApiError } from "@/utils/helpers";
import StoryEditor from "@/components/StoryEditor.vue";
import type { StoryFormData } from "@/types";

const router = useRouter();
const error = ref("");

const handleSave = async (storyData: StoryFormData) => {
  try {
    error.value = "";
    const formData = new FormData();
    formData.append("story[title]", storyData.title);
    formData.append("story[content]", storyData.content);
    formData.append("story[category_id]", storyData.categoryId.toString());
    formData.append("story[status]", storyData.status);

    if (storyData.photo) {
      formData.append("story[photo]", storyData.photo);
    }

    await storyApi.create(formData);
    router.push("/stories");
  } catch (err) {
    error.value = handleApiError(err);
  }
};
</script>

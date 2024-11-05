<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Write New Story</h1>

    <div v-if="error" class="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <StoryEditor @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storyApi } from "@/services/api";
import { handleApiError } from "@/utils/helpers";
import StoryEditor from "@/components/StoryEditor.vue";

const router = useRouter();
const error = ref("");

const handleSave = async (storyData: any) => {
  try {
    error.value = "";
    const formData = new FormData();
    formData.append("story[title]", storyData.title);
    formData.append("story[content]", storyData.content);
    formData.append("story[category_id]", storyData.categoryId);
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

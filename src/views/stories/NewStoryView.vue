<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">Write New Story</h1>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="title" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Category</label>
        <select v-model="categoryId" required class="mt-1 block w-full rounded-md border border-gray-300 p-2">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Content</label>
        <QuillEditor v-model:content="content" contentType="html" theme="snow" toolbar="full" class="h-64 mb-12" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Photo (optional)</label>
        <input type="file" accept="image/*" @change="handlePhotoChange" class="mt-1 block w-full" />
      </div>

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="saveDraft"
          class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Publish Story
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storiesAPI } from "@/services/api";
import type { Category } from "@/types";

const router = useRouter();
const title = ref("");
const content = ref("");
const categoryId = ref<number>();
const categories = ref<Category[]>([]);
const photo = ref<File | null>(null);

onMounted(async () => {
  try {
    const response = await fetch("/api/v1/categories");
    categories.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
});

const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    photo.value = target.files[0];
  }
};

const createStory = async (status: "draft" | "published") => {
  const formData = new FormData();
  formData.append("story[title]", title.value);
  formData.append("story[content]", content.value);
  formData.append("story[category_id]", categoryId.value?.toString() || "");
  formData.append("story[status]", status);
  if (photo.value) {
    formData.append("story[photo]", photo.value);
  }

  try {
    await storiesAPI.create(formData);
    router.push("/stories");
  } catch (error) {
    console.error("Failed to create story:", error);
    alert("Failed to create story. Please try again.");
  }
};

const handleSubmit = () => createStory("published");
const saveDraft = () => createStory("draft");
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-lg font-medium text-gray-700 mb-2">Title</label>
      <input
        data-test="title-input"
        v-model="title"
        type="text"
        class="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
        placeholder="Enter your story title"
      />
    </div>

    <div>
      <label class="block text-lg font-medium text-gray-700 mb-2">Story</label>
      <textarea
        data-test="content-input"
        v-model="content"
        rows="10"
        class="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
        placeholder="Write your story here..."
      ></textarea>
    </div>

    <div>
      <label class="block text-lg font-medium text-gray-700 mb-2">Category</label>
      <select
        data-test="category-select"
        v-model="categoryId"
        class="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
      >
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex justify-end space-x-4">
      <button
        data-test="draft-button"
        @click="saveDraft"
        class="px-6 py-3 text-lg border-2 border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Save Draft
      </button>
      <button
        data-test="publish-button"
        @click="publish"
        class="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Publish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { categoryApi } from "@/services/api";
import type { Category } from "@/types";

const title = ref("");
const content = ref("");
const categoryId = ref<number>();
const photo = ref<File | null>(null);
const categories = ref<Category[]>([]);

onMounted(async () => {
  try {
    const response = await categoryApi.getAll();
    categories.value = response.data;
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
</script>

<style>
.ql-editor {
  font-size: 1.125rem;
  line-height: 1.75;
  min-height: 200px;
}
</style>

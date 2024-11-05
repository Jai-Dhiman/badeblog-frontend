<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Categories</h2>

    <div class="flex flex-wrap gap-3">
      <!-- All Stories Button -->
      <button
        @click="$emit('select', undefined)"
        class="px-4 py-2 rounded-lg text-lg transition-colors"
        :class="[!selectedId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
      >
        All Stories
      </button>

      <!-- Category Buttons -->
      <button
        v-for="category in categories"
        :key="category.id"
        @click="$emit('select', category.id)"
        class="px-4 py-2 rounded-lg text-lg transition-colors"
        :class="[selectedId === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
      >
        {{ category.name }}
      </button>
    </div>

    <div v-if="loading" class="text-lg text-gray-600">Loading categories...</div>

    <div v-if="error" class="text-lg text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { categoryApi } from "@/services/api";
import { handleApiError } from "@/utils/helpers";
import type { Category } from "@/types";

defineProps<{
  selectedId?: number;
}>();

defineEmits<{
  select: [id: number | undefined];
}>();

const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    loading.value = true;
    const response = await categoryApi.getAll();
    categories.value = response.data;
  } catch (err) {
    error.value = handleApiError(err);
  } finally {
    loading.value = false;
  }
});
</script>

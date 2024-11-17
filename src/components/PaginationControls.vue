<template>
  <div class="flex justify-center items-center space-x-4 mt-8">
    <button
      @click="$emit('change-page', currentPage - 1)"
      :disabled="currentPage === 1"
      class="btn"
      :class="
        currentPage === 1
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-primary text-white hover:bg-secondary'
      "
    >
      <span class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        Previous
      </span>
    </button>

    <div class="flex items-center space-x-2">
      <span class="text-gray-600 font-medium"> Page {{ currentPage }} of {{ totalPages }} </span>
    </div>

    <button
      @click="$emit('change-page', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="btn"
      :class="
        currentPage === totalPages
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-primary text-white hover:bg-secondary'
      "
    >
      <span class="flex items-center">
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  (e: 'change-page', page: number): void
}>()
</script>

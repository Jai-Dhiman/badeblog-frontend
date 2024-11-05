<template>
  <div
    class="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200"
    aria-label="Accessibility controls"
  >
    <!-- Toggle Button to Show/Hide Controls -->
    <button
      @click="isOpen = !isOpen"
      class="text-2xl w-full flex items-center justify-between text-gray-700 mb-2"
      :aria-expanded="isOpen"
    >
      <span class="text-lg">Accessibility</span>
      <span>{{ isOpen ? "▼" : "▲" }}</span>
    </button>

    <!-- Controls Panel -->
    <div v-if="isOpen" class="space-y-3">
      <!-- Font Size Controls -->
      <div class="space-y-2">
        <p class="text-lg font-medium text-gray-700">Text Size</p>
        <div class="flex space-x-2">
          <button
            @click="decreaseFontSize"
            class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg"
            aria-label="Decrease font size"
          >
            A-
          </button>
          <button
            @click="increaseFontSize"
            class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg"
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
      </div>

      <!--Font Family Control -->
      <div class="space-y-2">
        <p class="text-lg font-medium text-gray-700">Font Family</p>
        <button
          @click="toggleFontFamily"
          class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg"
          :class="{ 'bg-blue-600 text-white hover:bg-blue-700': isSansSerif }"
        >
          Sans-serif Font
        </button>
      </div>

      <!-- Contrast Controls -->
      <div class="space-y-2">
        <p class="text-lg font-medium text-gray-700">Contrast</p>
        <button
          @click="toggleHighContrast"
          class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg"
          :class="{ 'bg-blue-600 text-white hover:bg-blue-700': isHighContrast }"
        >
          High Contrast
        </button>
      </div>

      <!-- Line Height Controls -->
      <div class="space-y-2">
        <p class="text-lg font-medium text-gray-700">Line Spacing</p>
        <button
          @click="toggleLineHeight"
          class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg"
          :class="{ 'bg-blue-600 text-white hover:bg-blue-700': isLargeLineHeight }"
        >
          Large Spacing
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);
const isHighContrast = ref(false);
const isLargeLineHeight = ref(false);
const isSansSerif = ref(false);

const increaseFontSize = () => {
  const root = document.documentElement;
  const currentSize = parseInt(getComputedStyle(root).fontSize);
  root.style.fontSize = `${currentSize + 2}px`;
};

const decreaseFontSize = () => {
  const root = document.documentElement;
  const currentSize = parseInt(getComputedStyle(root).fontSize);
  if (currentSize > 14) {
    // prevent too small font size
    root.style.fontSize = `${currentSize - 2}px`;
  }
};

const toggleFontFamily = () => {
  isSansSerif.value = !isSansSerif.value;
  document.body.classList.toggle("sans-serif-font");
};

const toggleHighContrast = () => {
  isHighContrast.value = !isHighContrast.value;
  document.body.classList.toggle("high-contrast");
};

const toggleLineHeight = () => {
  isLargeLineHeight.value = !isLargeLineHeight.value;
  document.body.classList.toggle("large-line-height");
};
</script>

<style>
.high-contrast {
  background-color: white !important;
  color: black !important;
}

.high-contrast * {
  background-color: white !important;
  color: black !important;
  border-color: black !important;
}

.large-line-height {
  line-height: 2 !important;
}

.large-line-height p {
  margin-bottom: 1.5em !important;
}

.sans-serif-font {
  font-family: Arial, sans-serif !important;
}
</style>

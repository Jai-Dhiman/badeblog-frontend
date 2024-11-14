<template>
  <QuillEditor
    v-model:content="editorContent"
    :toolbar="toolbarOptions"
    contentType="html"
    @update:content="updateContent"
    theme="snow"
    class="h-[300px] mb-12"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorContent = ref(props.modelValue)

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['link', 'image'],
  ['clean'],
]

const updateContent = (content: string) => {
  emit('update:modelValue', content)
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== editorContent.value) {
      editorContent.value = newValue
    }
  },
)
</script>

<style>
.ql-container {
  min-height: 200px;
}
</style>

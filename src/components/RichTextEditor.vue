<template>
  <QuillEditor
    ref="quillEditor"
    v-model:content="localContent"
    :toolbar="toolbarOptions"
    contentType="html"
    theme="snow"
    class="h-[300px] mb-12 text-lg"
    @update:content="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const quillEditor = ref()
const localContent = ref('')

onMounted(() => {
  if (props.modelValue) {
    const temp = document.createElement('div')
    temp.innerHTML = props.modelValue
    const trixContent = temp.querySelector('.trix-content')
    localContent.value = trixContent ? trixContent.innerHTML : props.modelValue
  }
})

function handleUpdate(content: string) {
  const cleanContent = content.trim()
  const wrappedContent = `<div class="trix-content">${cleanContent}</div>`
  emit('update:modelValue', wrappedContent)
}

const toolbarOptions = [
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['image'],
  [{ script: 'sub' }, { script: 'super' }],
  [{ direction: 'rtl' }],
  ['clean'],
]
</script>

<style>
.ql-container {
  min-height: 200px;
  font-size: 16px;
}

.ql-editor {
  line-height: 1.6;
}

/* Fix button sizes */
.ql-toolbar.ql-snow {
  padding: 8px;
}

.ql-toolbar.ql-snow .ql-formats {
  margin-right: 12px;
}

.ql-snow.ql-toolbar button {
  width: 32px;
  height: 32px;
  padding: 6px;
}

.ql-snow.ql-toolbar button svg {
  width: 20px;
  height: 20px;
}

.ql-snow .ql-picker {
  height: 32px;
}

.ql-snow .ql-picker-label {
  padding: 4px 8px;
  font-size: 14px;
}

.ql-editor p {
  margin-bottom: 1em;
}

.ql-editor blockquote {
  border-left: 3px solid #ccc;
  padding-left: 1em;
  margin: 1em 0;
}

.ql-editor ul,
.ql-editor ol {
  padding-left: 1.5em;
  margin: 1em 0;
}

.ql-editor li {
  margin-bottom: 0.5em;
}

.ql-editor a {
  color: #2563eb;
  text-decoration: underline;
}

.ql-editor pre {
  background: #f4f4f4;
  padding: 1em;
  border-radius: 4px;
}

.ql-snow .ql-stroke {
  stroke-width: 1.5px;
}

.ql-snow .ql-picker-options {
  padding: 4px 8px;
}

.ql-snow .ql-picker-item {
  padding: 4px 8px;
  font-size: 14px;
}
</style>

<template>
  <QuillEditor
    ref="quillEditor"
    :content="localContent"
    :toolbar="toolbarOptions"
    contentType="html"
    theme="snow"
    class="h-[300px] mb-12 text-lg editor-container"
    @textChange="handleTextChange"
    @ready="onEditorReady"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { ApiError } from '@/types'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'error', error: ApiError): void
}>()

const quillEditor = ref()
const localContent = ref('')
const editorReady = ref(false)
const contentQueue = ref<string | null>(null)

const toolbarOptions = [
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ align: ['', 'center', 'right', 'justify'] }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote'],
  ['image'],
]

function handleError(error: unknown) {
  const apiError: ApiError = {
    message: error instanceof Error ? error.message : 'Editor initialization error',
    errors: error instanceof Error ? [error.message] : ['Unknown editor error'],
  }
  emit('error', apiError)
}

function setEditorContent(content: string) {
  if (!quillEditor.value?.getQuill) {
    contentQueue.value = content
    return
  }
  try {
    const quill = quillEditor.value.getQuill()
    if (!quill?.root || !quill.emitter) {
      contentQueue.value = content
      return
    }
    const currentContent = quill.root.innerHTML
    if (currentContent !== content) {
      quill.clipboard.dangerouslyPasteHTML(content)
    }
  } catch (error) {
    handleError(error)
  }
}

function onEditorReady() {
  editorReady.value = true
  if (contentQueue.value !== null) {
    setEditorContent(contentQueue.value)
    contentQueue.value = null
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editorReady.value) {
      contentQueue.value = newValue
      return
    }
    setEditorContent(newValue)
  },
  { immediate: true },
)

function handleTextChange() {
  if (!quillEditor.value?.getQuill) return
  try {
    const quill = quillEditor.value.getQuill()
    if (!quill?.root || !quill.emitter) return
    emit('update:modelValue', quill.root.innerHTML)
  } catch (error) {
    handleError(error)
  }
}

onMounted(() => {
  if (props.modelValue) {
    contentQueue.value = props.modelValue
  }
})
</script>

<style>
.ql-container {
  min-height: 200px;
  font-size: 16px;
  background-color: white;
}

.ql-toolbar.ql-snow {
  padding: 8px;
}

.ql-editor {
  font-size: 16px;
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

.ql-editor table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.ql-editor td,
.ql-editor th {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.ql-editor th {
  background-color: #f4f4f4;
}

.ql-editor hr {
  border: none;
  border-top: 2px solid #ccc;
  margin: 1.5em 0;
}

.ql-editor a {
  color: #2563eb;
  text-decoration: underline;
}

.ql-editor .ql-align-center {
  text-align: center;
}

.ql-editor .ql-align-right {
  text-align: right;
}

.ql-editor .ql-align-justify {
  text-align: justify;
}
</style>

<template>
  <QuillEditor
    ref="quillEditor"
    :content="localContent"
    :toolbar="toolbarOptions"
    contentType="html"
    theme="snow"
    class="h-[300px] mb-12 text-lg"
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

function handleError(error: unknown) {
  const apiError: ApiError = {
    message: error instanceof Error ? error.message : 'Editor initialization error',
    errors: error instanceof Error ? [error.message] : ['Unknown editor error'],
  }
  console.error('Quill editor error:', apiError)
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

    const cleanContent = extractContent(content)

    const delta = quill.clipboard.convert(cleanContent)
    quill.setContents(delta, 'silent')
  } catch (error) {
    handleError(error)
  }
}

function extractContent(html: string): string {
  if (!html) return ''

  const div = document.createElement('div')
  div.innerHTML = html

  const trixContent = div.querySelector('.trix-content')
  const content = trixContent ? trixContent.innerHTML : html

  return normalizeHtml(content)
}

function normalizeHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html.trim()

  const trixDivs = div.querySelectorAll('.trix-content')
  trixDivs.forEach((trixDiv, index) => {
    if (index > 0) {
      const parent = trixDiv.parentNode
      while (trixDiv.firstChild) {
        parent?.insertBefore(trixDiv.firstChild, trixDiv)
      }
      trixDiv.remove()
    }
  })

  return div.innerHTML
}

function onEditorReady() {
  editorReady.value = true

  if (contentQueue.value !== null) {
    setTimeout(() => {
      setEditorContent(contentQueue.value!)
      contentQueue.value = null
    }, 100)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editorReady.value) {
      console.log('Editor not ready, queueing content')
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

    const content = quill.root.innerHTML
    const wrappedContent = `<div class="trix-content">${content}</div>`
    emit('update:modelValue', wrappedContent)
  } catch (error) {
    handleError(error)
  }
}

onMounted(() => {
  if (props.modelValue) {
    contentQueue.value = props.modelValue
  }
})

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
  background-color: white !important;
}

.ql-editor {
  line-height: 1.6;
  background-color: white !important;
}

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
  margin: 0;
  padding: 0;
}

.ql-editor p + p {
  margin-top: 1em;
}

.ql-editor p:last-child {
  margin-bottom: 0;
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

.ql-editor br + br {
  display: none;
}

.ql-editor > * + * {
  margin-top: 1em;
}

.ql-editor p:empty::before {
  content: '\200B';
}
</style>

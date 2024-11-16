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
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
const editorReady = ref(false)

function normalizeHtml(html: string): string {
  // Create a temporary div
  const div = document.createElement('div')
  div.innerHTML = html

  // Function to clean text nodes
  function cleanTextNodes(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = node.textContent?.replace(/\s+/g, ' ').trim() || ''
    } else {
      node.childNodes.forEach(cleanTextNodes)
    }
  }

  // Clean all text nodes
  cleanTextNodes(div)

  // Remove empty paragraphs and normalize spacing
  const paragraphs = div.getElementsByTagName('p')
  Array.from(paragraphs).forEach((p) => {
    // Remove empty paragraphs except those with a single <br>
    if (!p.textContent?.trim() && !p.querySelector('br')) {
      p.remove()
    }
    // Remove extra br tags
    const brs = p.getElementsByTagName('br')
    while (brs.length > 1) {
      brs[0].remove()
    }
  })

  // Get the cleaned HTML
  const cleanedHtml = div.innerHTML
    .replace(/<p>\s*<\/p>/g, '<p><br></p>') // Replace empty p with p containing br
    .replace(/(<\/p>\s*<p>)/g, '</p><p>') // Remove extra spaces between paragraphs
    .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
    .trim()

  return cleanedHtml
}

function extractContent(html: string): string {
  if (!html) return ''

  const div = document.createElement('div')
  div.innerHTML = html

  // Look for trix-content
  const trixContent = div.querySelector('.trix-content')
  const content = trixContent ? trixContent.innerHTML : html

  return normalizeHtml(content)
}

onMounted(() => {
  if (props.modelValue) {
    localContent.value = extractContent(props.modelValue)
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editorReady.value) return

    const extractedContent = extractContent(newValue)
    if (extractedContent !== localContent.value) {
      localContent.value = extractedContent
    }
  },
)

function onEditorReady() {
  editorReady.value = true
  if (props.modelValue) {
    localContent.value = extractContent(props.modelValue)
  }
}

function handleTextChange() {
  if (!quillEditor.value) return

  const content = quillEditor.value.getHTML()
  const cleanedContent = normalizeHtml(content)
  const wrappedContent = `<div class="trix-content">${cleanedContent}</div>`
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

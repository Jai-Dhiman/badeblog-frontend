<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h3>Send Notification to Subscribers</h3>
      <textarea
        v-model="message"
        placeholder="Enter your custom message for subscribers"
        rows="4"
        class="w-full p-2 border rounded"
      ></textarea>
      <div class="mt-4 flex justify-end space-x-2">
        <button @click="$emit('close')" class="px-4 py-2 border rounded">Cancel</button>
        <button @click="sendNotification" class="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sendStoryNotification } from '@/services/api'

const props = defineProps<{
  show: boolean
  storyId: number | string
}>()

const emit = defineEmits(['close', 'sent'])
const message = ref('')

const sendNotification = async () => {
  try {
    await sendStoryNotification(props.storyId, message.value)
    emit('sent')
    message.value = ''
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}
</script>

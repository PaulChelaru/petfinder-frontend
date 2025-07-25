<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ resolveTitle }}
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <div class="mb-4">
          <p class="text-gray-600">
            {{ resolveDescription }}
          </p>
        </div>

        <!-- Resolution Message -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Resolution Message (Optional)
          </label>
          <textarea
            v-model="resolutionMessage"
            rows="3"
            maxlength="500"
            :placeholder="resolvePlaceholder"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">{{ resolutionMessage.length }}/500 characters</p>
        </div>

        <!-- Success Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <BaseButton @click="$emit('close')" variant="outline">
            Cancel
          </BaseButton>
          <BaseButton @click="handleResolve" :loading="loading" variant="primary">
            {{ resolveButtonText }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { announcementApi } from '@/api/announcements'
import BaseButton from '../buttons/BaseButton.vue'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

// State
const loading = ref(false)
const error = ref('')
const resolutionMessage = ref('')

// Computed
const resolveTitle = computed(() => {
  switch (props.announcement.type) {
    case 'lost':
      return 'Mark Pet as Found'
    case 'found':
      return 'Mark Pet as Reunited'
    case 'adoption':
      return 'Mark Pet as Adopted'
    default:
      return 'Resolve Announcement'
  }
})

const resolveDescription = computed(() => {
  switch (props.announcement.type) {
    case 'lost':
      return 'Great news! Are you sure this lost pet has been found and safely returned?'
    case 'found':
      return 'Wonderful! Are you sure this found pet has been reunited with their family?'
    case 'adoption':
      return 'Congratulations! Are you sure this pet has found their forever home?'
    default:
      return 'Are you sure you want to mark this announcement as resolved?'
  }
})

const resolvePlaceholder = computed(() => {
  switch (props.announcement.type) {
    case 'lost':
      return 'Share details about how the pet was found or reunited...'
    case 'found':
      return 'Share details about the happy reunion...'
    case 'adoption':
      return 'Share details about the adoption or new family...'
    default:
      return 'Add any additional details about the resolution...'
  }
})

const resolveButtonText = computed(() => {
  switch (props.announcement.type) {
    case 'lost':
      return 'Mark as Found'
    case 'found':
      return 'Mark as Reunited'
    case 'adoption':
      return 'Mark as Adopted'
    default:
      return 'Mark as Resolved'
  }
})

// Methods
const handleResolve = async () => {
  try {
    loading.value = true
    error.value = ''


    const resolveData = {}
    if (resolutionMessage.value.trim()) {
      resolveData.resolvedNote = resolutionMessage.value.trim()
    }

    
    const finalPayload = {
      status: 'resolved',
      resolvedNote: resolveData.resolvedNote || '',
      ...(resolveData.matchedWith && { matchedWith: resolveData.matchedWith })
    }
    
    
    const response = await announcementApi.resolve(props.announcement.id, resolveData)
    
    emit('success', response.data)
    
  } catch (err) {
    console.error('Error resolving announcement:', err)
    console.error('Error response:', err.response)
    console.error('Error data:', err.response?.data)
    
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.response?.data?.validation) {
      error.value = `Validation error: ${JSON.stringify(err.response.data.validation)}`
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'An error occurred while resolving the announcement. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

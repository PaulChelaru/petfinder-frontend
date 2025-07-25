<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ title }}
          </h2>
          <button
            @click="$emit('cancel')"
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
        <div class="flex items-center mb-4">
          <!-- Warning Icon -->
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div>
            <p class="text-gray-900 font-medium mb-1">
              {{ message }}
            </p>
            <p class="text-gray-600 text-sm">
              {{ description }}
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <BaseButton @click="$emit('cancel')" variant="outline">
            Cancel
          </BaseButton>
          <BaseButton 
            @click="handleConfirm" 
            :loading="loading" 
            variant="danger"
            class="bg-red-600 hover:bg-red-700 text-white"
          >
            {{ confirmText }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '../buttons/BaseButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'This action cannot be undone.'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  onConfirm: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['cancel', 'confirm'])

// State
const loading = ref(false)
const error = ref('')

// Methods
const handleConfirm = async () => {
  try {
    
    loading.value = true
    error.value = ''
    
    await props.onConfirm()
    emit('confirm')
    
  } catch (err) {
    console.error('Error in confirmation action:', err)
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'An error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

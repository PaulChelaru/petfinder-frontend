<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          Resolve Announcement
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="text-center space-y-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <i class="fas fa-check text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Mark as Resolved</h3>
            <p class="text-sm text-gray-500 mt-2">
              Are you sure you want to mark this announcement as resolved? This action cannot be undone.
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
          <BaseButton
            variant="outline"
            size="md"
            @click="closeModal"
            class="w-full sm:w-auto"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            size="md"
            @click="confirmResolve"
            :disabled="isSubmitting"
            class="w-full sm:w-auto"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-check mr-2"></i>
            {{ isSubmitting ? 'Resolving...' : 'Mark as Resolved' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './buttons/BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  announcement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'resolve'])

const isSubmitting = ref(false)

const closeModal = () => {
  emit('close')
}

const confirmResolve = async () => {
  isSubmitting.value = true
  
  try {
    emit('resolve', props.announcement?.id)
    closeModal()
  } catch (error) {
    console.error('Error resolving announcement:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
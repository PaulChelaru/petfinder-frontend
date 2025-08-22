<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ title || 'Confirm Action' }}
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
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="iconClasses">
            <i :class="iconName + ' text-xl'"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ title || 'Are you sure?' }}</h3>
            <p class="text-sm text-gray-500 mt-2">
              {{ message || 'This action cannot be undone.' }}
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
            {{ cancelText || 'Cancel' }}
          </BaseButton>
          <BaseButton
            :variant="confirmVariant"
            size="md"
            @click="confirmAction"
            :disabled="isSubmitting"
            class="w-full sm:w-auto"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else :class="confirmIcon + ' mr-2'"></i>
            {{ isSubmitting ? 'Processing...' : (confirmText || 'Confirm') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from './buttons/BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed? This action cannot be undone.'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['success', 'warning', 'danger', 'info'].includes(value)
  }
})

const emit = defineEmits(['close', 'confirm'])

const isSubmitting = ref(false)

const iconClasses = computed(() => {
  const classes = {
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100'
  }
  return classes[props.type]
})

const iconName = computed(() => {
  const icons = {
    success: 'fas fa-check text-green-600',
    warning: 'fas fa-exclamation-triangle text-yellow-600',
    danger: 'fas fa-trash text-red-600',
    info: 'fas fa-info text-blue-600'
  }
  return icons[props.type]
})

const confirmVariant = computed(() => {
  const variants = {
    success: 'primary',
    warning: 'secondary',
    danger: 'danger',
    info: 'primary'
  }
  return variants[props.type]
})

const confirmIcon = computed(() => {
  const icons = {
    success: 'fas fa-check',
    warning: 'fas fa-exclamation-triangle',
    danger: 'fas fa-trash',
    info: 'fas fa-info'
  }
  return icons[props.type]
})

const closeModal = () => {
  emit('close')
}

const confirmAction = async () => {
  isSubmitting.value = true
  
  try {
    emit('confirm')
    closeModal()
  } catch (error) {
    console.error('Error confirming action:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
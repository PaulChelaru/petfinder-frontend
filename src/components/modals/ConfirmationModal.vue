<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center">
          <!-- Icon -->
          <div v-if="icon" class="flex-shrink-0 mr-4">
            <div :class="iconClasses" class="w-10 h-10 rounded-full flex items-center justify-center">
              <component :is="icon" class="w-6 h-6" />
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h3>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <p class="text-gray-600">
          {{ message }}
        </p>
        
        <div v-if="details" class="mt-3 p-3 bg-gray-50 rounded-md">
          <p class="text-sm text-gray-700">{{ details }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <ActionButton
          variant="outline"
          @click="handleCancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </ActionButton>
        <ActionButton
          :variant="confirmVariant"
          @click="handleConfirm"
          :loading="loading"
        >
          {{ confirmText }}
        </ActionButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ActionButton from '../buttons/ActionButton.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: null
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  variant: {
    type: String,
    default: 'danger',
    validator: (value) => ['primary', 'danger', 'warning', 'success'].includes(value)
  },
  icon: {
    type: [String, Object],
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

// Computed properties
const confirmVariant = computed(() => props.variant)

const iconClasses = computed(() => {
  const classes = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    success: 'bg-green-100 text-green-600',
    primary: 'bg-blue-100 text-blue-600'
  }
  return classes[props.variant] || classes.danger
})

// Methods
const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}
</script>

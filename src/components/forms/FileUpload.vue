<template>
  <div
    :class="[
      'flex items-center justify-center',
      'rounded-lg border-2 border-dashed border-gray-300',
      'hover:border-gray-400 transition-colors duration-200',
      'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200',
      sizeClasses,
      {
        'bg-gray-50': !isDragOver,
        'bg-blue-50 border-blue-400': isDragOver
      }
    ]"
    @dragover.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @drop.prevent="handleDrop"
  >
    <div class="text-center">
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <!-- Upload Icon -->
      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      
      <div class="mt-4">
        <button
          type="button"
          class="text-blue-600 hover:text-blue-700 font-medium"
          @click="triggerFileSelect"
        >
          {{ buttonText }}
        </button>
        <p class="text-gray-500 text-sm mt-1">{{ helpText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  buttonText: {
    type: String,
    default: 'Alege fișiere'
  },
  helpText: {
    type: String,
    default: 'sau trage și lasă aici'
  }
})

const emit = defineEmits(['files-selected'])

const fileInput = ref(null)
const isDragOver = ref(false)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'p-4 min-h-32',
    md: 'p-6 min-h-40',
    lg: 'p-8 min-h-48'
  }
  return sizes[props.size]
})

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  emit('files-selected', files)
}

const handleDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  emit('files-selected', files)
}
</script>

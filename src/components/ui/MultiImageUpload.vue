<template>
  <div class="multi-image-upload">
    <!-- Upload Controls -->
    <div class="upload-controls mb-4">
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">
          Pet Photos ({{ totalImages }}/{{ maxImages }})
        </label>
        <button
          v-if="previewImages.length > 0"
          @click="clearAll"
          type="button"
          class="text-sm text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>

      <!-- File Upload Area -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        :class="{ 'border-red-300': hasErrors }"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          @change="handleFileUpload"
          class="hidden"
        />
        
        <div class="space-y-2">
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
          <div>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              :disabled="!canAddMore"
              class="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
            >
              {{ canAddMore ? 'Upload photos' : 'Maximum reached' }}
            </button>
            <p class="text-gray-500 text-sm">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-400">
            JPEG, PNG, WebP up to 10MB each ({{ remainingSlots }} slots remaining)
          </p>
        </div>
      </div>

      <!-- URL Input -->
      <div class="flex space-x-2 mt-3">
        <input
          v-model="urlInput"
          type="url"
          placeholder="Or add image URL"
          :disabled="!canAddMore"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          @keypress.enter.prevent="handleUrlAdd"
        />
        <button
          type="button"
          @click="handleUrlAdd"
          :disabled="!urlInput.trim() || !canAddMore"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add URL
        </button>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="hasErrors" class="mb-4">
      <div 
        v-for="error in errors" 
        :key="error"
        class="bg-red-50 border border-red-200 rounded-md p-3 mb-2"
      >
        <div class="flex items-center justify-between">
          <p class="text-red-600 text-sm">{{ error }}</p>
          <button
            @click="removeError(error)"
            class="text-red-400 hover:text-red-600"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Preview Grid -->
    <div v-if="previewImages.length > 0" class="image-preview-grid">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(image, index) in previewImages"
          :key="image.id"
          class="relative group"
        >
          <!-- Image Preview -->
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              :src="image.src"
              :alt="image.name"
              class="w-full h-full object-cover"
              @error="handleImageError($event, image)"
            />
            
            <!-- Loading Overlay -->
            <div 
              v-if="image.status === 'uploading'"
              class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <div class="text-white text-center">
                <i class="fas fa-spinner fa-spin text-xl mb-2"></i>
                <p class="text-sm">Uploading...</p>
              </div>
            </div>
            
            <!-- Success/Error Status -->
            <div 
              v-else-if="image.status && image.status !== 'pending'"
              class="absolute top-2 left-2"
            >
              <div 
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs',
                  image.status === 'uploaded' ? 'bg-green-500' : 'bg-red-500'
                ]"
              >
                <i :class="image.status === 'uploaded' ? 'fas fa-check' : 'fas fa-exclamation'"></i>
              </div>
            </div>

            <!-- Remove Button -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
              <button
                type="button"
                @click="removeImage(index)"
                class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Image Info -->
          <div class="mt-2 px-1">
            <p class="text-xs text-gray-600 truncate" :title="image.name">
              {{ image.name }}
            </p>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs text-gray-500">
                {{ image.type === 'file' ? 'FILE' : 'URL' }}
              </span>
              <span v-if="image.size" class="text-xs text-gray-500">
                {{ formatFileSize(image.size) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-gray-500">
      <i class="fas fa-images text-4xl mb-2"></i>
      <p>No images selected</p>
      <p class="text-sm">Upload files or add URLs to get started</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useImageUpload } from '@/composables/useImageUpload'

const props = defineProps({
  maxImages: {
    type: Number,
    default: 5
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'files-changed', 'error'])

// Initialize image upload composable
const {
  selectedFiles,
  imageUrls,
  previewImages,
  isUploading,
  errors,
  totalImages,
  canAddMore,
  remainingSlots,
  hasErrors,
  addFiles,
  addImageUrl,
  removeImage,
  clearAll,
  loadExistingImages,
  addError,
  clearErrors,
  removeError,
  getImageData
} = useImageUpload(props.maxImages)

// Local refs
const fileInput = ref(null)
const urlInput = ref('')

// Load existing images if provided
if (props.modelValue.length > 0) {
  loadExistingImages(props.modelValue)
}

// Watch for changes and emit to parent
const emitChanges = () => {
  const imageData = getImageData()
  emit('update:modelValue', imageData)
  emit('files-changed', imageData)
}

// File upload handler
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    try {
      addFiles(files)
      emitChanges()
    } catch (error) {
      emit('error', error.message)
    }
  }
  // Clear the input
  event.target.value = ''
}

// Drag and drop handlers
const handleDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  if (files.length > 0) {
    try {
      addFiles(files)
      emitChanges()
    } catch (error) {
      emit('error', error.message)
    }
  }
}

// URL add handler
const handleUrlAdd = () => {
  const url = urlInput.value.trim()
  if (url) {
    try {
      addImageUrl(url)
      urlInput.value = ''
      emitChanges()
    } catch (error) {
      emit('error', error.message)
    }
  }
}

// Image error handler
const handleImageError = (event, image) => {
  event.target.src = '/placeholder-image.png'
  addError(`Failed to load image: ${image.name}`)
}

// Remove image handler
const handleRemoveImage = (index) => {
  removeImage(index)
  emitChanges()
}

// Clear all handler
const handleClearAll = () => {
  clearAll()
  clearErrors()
  emitChanges()
}

// File size formatter
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Expose methods for parent component
defineExpose({
  addFiles,
  addImageUrl,
  clearAll,
  clearErrors,
  getImageData,
  selectedFiles,
  previewImages,
  totalImages,
  hasErrors
})
</script>

<style scoped>
.multi-image-upload {
  width: 100%;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-preview-grid {
  width: 100%;
}

/* Custom drag over styles */
.border-dashed:hover {
  border-color: #60a5fa;
  background-color: #eff6ff;
}

/* Animation for image grid */
.grid > div {
  transition: transform 0.2s ease-in-out;
}

.grid > div:hover {
  transform: scale(1.05);
}
</style>

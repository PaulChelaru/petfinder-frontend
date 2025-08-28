<template>
  <div class="image-upload-container">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Upload Area -->
    <div class="space-y-4">
      <!-- File Drop Zone -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
        @drop="handleDrop"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @dragenter.prevent
      >
        <input
          ref="fileInputRef"
          type="file"
          multiple
          :accept="acceptedTypes"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <div class="space-y-2">
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
          <div>
            <button
              type="button"
              @click="fileInputRef?.click()"
              :disabled="!canAddMore"
              class="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {{ uploadButtonText }}
            </button>
            <p class="text-gray-500 text-sm">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-400">{{ acceptedFormats }} up to {{ maxFileSize }}</p>
        </div>
      </div>
      
      <!-- URL Input -->
      <div v-if="allowUrls" class="flex space-x-2">
        <input
          v-model="urlInput"
          type="url"
          placeholder="Or add image URL"
          :disabled="!canAddMore"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
    
    <!-- Image Counter -->
    <div class="mt-2 text-sm text-gray-600">
      {{ totalImages }} / {{ maxImages }} images
      <span v-if="!canAddMore" class="text-orange-600">(limit reached)</span>
    </div>
    
    <!-- Error Display -->
    <div v-if="error" class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
      {{ error }}
    </div>
    
    <!-- Image Preview Grid -->
    <div v-if="previewImages.length > 0" class="mt-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(image, index) in previewImages"
          :key="image.id"
          class="relative group"
        >
          <!-- Image -->
          <img
            :src="image.src"
            :alt="image.name"
            class="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer transition-transform hover:scale-105"
            @error="handleImageError"
            @click="$emit('image-preview', image, index)"
          />
          
          <!-- Overlay on Hover -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
            <button
              type="button"
              @click="handleRemoveImage(index)"
              class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200"
              title="Remove image"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- Type Badge -->
          <div class="absolute top-1 left-1 px-2 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded">
            {{ getTypeBadge(image) }}
          </div>
          
          <!-- Size Badge (for files) -->
          <div v-if="image.size" class="absolute top-1 right-1 px-2 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded">
            {{ formatFileSize(image.size) }}
          </div>
          
          <!-- Image Name/Title -->
          <div class="absolute bottom-1 left-1 right-1 px-2 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded truncate">
            {{ image.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useImageUpload } from '@/composables/useImageUpload'

const props = defineProps({
  label: {
    type: String,
    default: 'Pet Photos'
  },
  maxImages: {
    type: Number,
    default: 5
  },
  required: {
    type: Boolean,
    default: false
  },
  allowUrls: {
    type: Boolean,
    default: true
  },
  acceptedTypes: {
    type: String,
    default: 'image/jpeg,image/jpg,image/png,image/webp'
  },
  maxFileSizeMB: {
    type: Number,
    default: 10
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'error', 'image-preview'])

// Image upload composable
const {
  selectedFiles,
  imageUrls,
  previewImages,
  totalImages,
  canAddMore,
  addFiles,
  addImageUrl,
  removeImage,
  loadExistingImages,
  getImageData
} = useImageUpload(props.maxImages)

// Component state
const fileInputRef = ref(null)
const urlInput = ref('')
const isDragOver = ref(false)
const error = ref('')

// Computed properties
const uploadButtonText = computed(() => {
  return canAddMore.value ? 'Upload photos' : 'Maximum reached'
})

const acceptedFormats = computed(() => {
  const types = props.acceptedTypes.split(',')
  return types.map(type => type.split('/')[1].toUpperCase()).join(', ')
})

const maxFileSize = computed(() => {
  return `${props.maxFileSizeMB}MB`
})

// Methods
const clearError = () => {
  error.value = ''
}

const showError = (message) => {
  error.value = message
  emit('error', message)
  setTimeout(clearError, 5000)
}

const handleFileSelect = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    handleFiles(files)
  }
  // Reset input
  event.target.value = ''
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleFiles(files)
  }
}

const handleFiles = (files) => {
  clearError()
  
  try {
    addFiles(files)
    emitUpdate()
  } catch (err) {
    showError(err.message)
  }
}

const handleUrlAdd = () => {
  clearError()
  
  try {
    addImageUrl(urlInput.value.trim())
    urlInput.value = ''
    emitUpdate()
  } catch (err) {
    showError(err.message)
  }
}

const handleRemoveImage = (index) => {
  removeImage(index)
  emitUpdate()
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.png'
}

const getTypeBadge = (image) => {
  switch (image.type) {
    case 'file':
      return 'FILE'
    case 'url':
      return 'URL'
    case 'existing':
      return 'EXISTING'
    default:
      return 'IMAGE'
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const emitUpdate = () => {
  const imageData = getImageData()
  emit('update:modelValue', {
    files: imageData.files,
    urls: imageData.urls,
    previews: previewImages.value,
    total: imageData.total
  })
}

// Load existing images when modelValue changes
const loadImages = (images) => {
  if (Array.isArray(images)) {
    loadExistingImages(images)
    emitUpdate()
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (Array.isArray(newValue) && newValue.length !== previewImages.value.length) {
    loadImages(newValue)
  }
}, { immediate: true, deep: true })

// Expose methods for parent component
defineExpose({
  clearAll: () => {
    clearAll()
    emitUpdate()
  },
  loadImages,
  getImageData
})
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
</style>

<template>
  <div class="image-gallery">
    <div v-if="images && images.length > 0" class="space-y-4">
      <!-- Main Image Display -->
      <div class="main-image-container">
        <img
          :src="currentImage"
          :alt="`Image ${currentIndex + 1}`"
          class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          @click="openFullscreen"
        />
        
        <!-- Image Controls -->
        <div v-if="images.length > 1" class="absolute inset-0 flex items-center justify-between p-4">
          <button
            @click="previousImage"
            class="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
            :disabled="currentIndex === 0"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button
            @click="nextImage"
            class="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
            :disabled="currentIndex === images.length - 1"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Image Counter -->
        <div v-if="images.length > 1" class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>

      <!-- Thumbnail Strip -->
      <div v-if="images.length > 1 && showThumbnails" class="flex space-x-2 overflow-x-auto pb-2">
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="currentIndex = index"
          :class="[
            'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
            currentIndex === index
              ? 'border-blue-500 opacity-100'
              : 'border-gray-300 opacity-70 hover:opacity-100'
          ]"
        >
          <img
            :src="image"
            :alt="`Thumbnail ${index + 1}`"
            class="w-full h-full object-cover"
          />
        </button>
      </div>

      <!-- Gallery Actions -->
      <div class="flex justify-center space-x-4">
        <button
          @click="openFullscreen"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <i class="fas fa-expand"></i>
          <span>View Fullscreen</span>
        </button>
        
        <button
          v-if="allowDownload"
          @click="downloadImage"
          class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <i class="fas fa-download"></i>
          <span>Download</span>
        </button>
      </div>
    </div>

    <!-- No Images State -->
    <div v-else class="text-center py-8">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-images text-4xl"></i>
      </div>
      <p class="text-gray-500">{{ noImagesText || 'No images available' }}</p>
    </div>

    <!-- Fullscreen Modal -->
    <div
      v-if="isFullscreen"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      @click="closeFullscreen"
      @keydown.esc="closeFullscreen"
      tabindex="0"
    >
      <div class="relative max-w-full max-h-full p-4">
        <!-- Close Button -->
        <button
          @click="closeFullscreen"
          class="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200 z-10"
        >
          <i class="fas fa-times"></i>
        </button>

        <!-- Fullscreen Image -->
        <img
          :src="currentImage"
          :alt="`Fullscreen image ${currentIndex + 1}`"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />

        <!-- Fullscreen Navigation -->
        <div v-if="images.length > 1" class="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4">
          <button
            @click.stop="previousImage"
            class="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all duration-200"
            :disabled="currentIndex === 0"
          >
            <i class="fas fa-chevron-left text-lg"></i>
          </button>
          
          <button
            @click.stop="nextImage"
            class="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all duration-200"
            :disabled="currentIndex === images.length - 1"
          >
            <i class="fas fa-chevron-right text-lg"></i>
          </button>
        </div>

        <!-- Fullscreen Counter -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  showThumbnails: {
    type: Boolean,
    default: true
  },
  allowDownload: {
    type: Boolean,
    default: false
  },
  noImagesText: {
    type: String,
    default: 'No images available'
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['imageChanged', 'fullscreenToggle'])

const currentIndex = ref(0)
const isFullscreen = ref(false)

const currentImage = computed(() => {
  if (!props.images || props.images.length === 0) return null
  return props.images[currentIndex.value]
})

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
    emit('imageChanged', currentIndex.value)
  }
}

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    emit('imageChanged', currentIndex.value)
  }
}

const openFullscreen = () => {
  isFullscreen.value = true
  emit('fullscreenToggle', true)
  // Focus the modal for keyboard navigation
  setTimeout(() => {
    const modal = document.querySelector('[tabindex="0"]')
    if (modal) modal.focus()
  }, 100)
}

const closeFullscreen = () => {
  isFullscreen.value = false
  emit('fullscreenToggle', false)
}

const downloadImage = () => {
  if (!currentImage.value) return
  
  const link = document.createElement('a')
  link.href = currentImage.value
  link.download = `image-${currentIndex.value + 1}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleKeyboard = (event) => {
  if (!isFullscreen.value) return
  
  switch (event.key) {
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'Escape':
      closeFullscreen()
      break
  }
}

onMounted(() => {
  currentIndex.value = Math.max(0, Math.min(props.initialIndex, props.images.length - 1))
  document.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard)
})

// Watch for prop changes
watch(() => props.images, (newImages) => {
  if (!newImages || newImages.length === 0) {
    currentIndex.value = 0
  } else if (currentIndex.value >= newImages.length) {
    currentIndex.value = newImages.length - 1
  }
})
</script>

<style scoped>
.image-gallery .main-image-container {
  position: relative;
  cursor: pointer;
}

.image-gallery img {
  user-select: none;
  -webkit-user-drag: none;
}

/* Smooth transitions for image changes */
.image-gallery .main-image-container img {
  transition: opacity 0.3s ease-in-out;
}

/* Custom scrollbar for thumbnail strip */
.image-gallery .overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.image-gallery .overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.image-gallery .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.image-gallery .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Fullscreen modal animations */
.image-gallery .fixed {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
<template>
  <div class="space-y-4">
    <!-- Main image display -->
    <div v-if="images && images.length > 0" class="space-y-4">
      <div class="relative bg-gray-100 rounded-xl overflow-hidden shadow-lg group">
        <img 
          :src="currentImage" 
          :alt="alt"
          class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <!-- Thumbnails -->
      <div v-if="images.length > 1" class="flex space-x-3 overflow-x-auto pb-2">
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="setCurrentImage(index)"
          :class="[
            'flex-shrink-0 w-20 h-20 rounded-lg border-3 overflow-hidden transition-all duration-200 transform hover:scale-105',
            currentImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
          ]"
        >
          <img :src="image" :alt="`Image ${index + 1}`" class="w-full h-full object-cover">
        </button>
      </div>
    </div>
    
    <!-- No images placeholder -->
    <div v-else class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-80 flex items-center justify-center shadow-inner">
      <div class="text-center text-gray-500">
        <svg class="w-20 h-20 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
        <p class="text-lg font-medium">{{ noImagesText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  alt: {
    type: String,
    default: 'Image'
  },
  noImagesText: {
    type: String,
    default: 'No images available'
  }
})

const emit = defineEmits(['image-change'])

const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (props.images && props.images.length > 0) {
    return props.images[currentImageIndex.value]
  }
  return null
})

const setCurrentImage = (index) => {
  currentImageIndex.value = index
  emit('image-change', index)
}
</script>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>

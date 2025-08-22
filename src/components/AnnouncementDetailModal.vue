<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ announcement?.title || 'Announcement Details' }}</h2>
          <div class="flex items-center space-x-2 mt-1">
            <span :class="typeClasses" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ formatType(announcement?.type) }}
            </span>
            <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {{ formatPetType(announcement?.petType) }}
            </span>
            <span v-if="announcement?.resolved" class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Resolved
            </span>
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Images -->
          <div v-if="announcement?.images && announcement.images.length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
            <div class="grid grid-cols-2 gap-4">
              <img
                v-for="(image, index) in announcement.images"
                :key="index"
                :src="image"
                :alt="`Pet photo ${index + 1}`"
                class="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                @click="openImageModal(image)"
              />
            </div>
          </div>

          <!-- Details -->
          <div class="space-y-6">
            <!-- Description -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p class="text-gray-700 leading-relaxed">{{ announcement?.description || 'No description provided.' }}</p>
            </div>

            <!-- Location -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                {{ announcement?.location || 'Location not specified' }}
              </div>
            </div>

            <!-- Date Last Seen -->
            <div v-if="announcement?.type === 'lost' && announcement?.lastSeenDate">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Last Seen</h3>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-calendar mr-2 text-blue-600"></i>
                {{ formatDate(announcement.lastSeenDate) }}
              </div>
            </div>

            <!-- Contact Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
              <div class="space-y-2">
                <div class="flex items-center text-gray-700">
                  <i class="fas fa-user mr-2 text-blue-600"></i>
                  {{ announcement?.contactName || 'Name not provided' }}
                </div>
                <div class="flex items-center text-gray-700">
                  <i class="fas fa-phone mr-2 text-blue-600"></i>
                  <a
                    :href="`tel:${announcement?.contactPhone}`"
                    class="text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    {{ announcement?.contactPhone || 'Phone not provided' }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Additional Notes -->
            <div v-if="announcement?.notes">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
              <p class="text-gray-700 leading-relaxed">{{ announcement.notes }}</p>
            </div>

            <!-- Posted Date -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Posted</h3>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-clock mr-2 text-blue-600"></i>
                {{ formatDate(announcement?.createdAt) || 'Date not available' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
          <BaseButton
            v-if="announcement?.contactPhone"
            variant="primary"
            size="lg"
            :href="`tel:${announcement.contactPhone}`"
            class="w-full sm:w-auto"
          >
            <i class="fas fa-phone mr-2"></i>
            Call {{ announcement.contactName }}
          </BaseButton>
          
          <BaseButton
            variant="outline"
            size="lg"
            @click="shareAnnouncement"
            class="w-full sm:w-auto"
          >
            <i class="fas fa-share mr-2"></i>
            Share
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60" @click="closeImageModal">
      <div class="max-w-4xl max-h-full p-4">
        <img :src="selectedImage" alt="Full size image" class="max-w-full max-h-full object-contain" />
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
  announcement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const selectedImage = ref(null)

const typeClasses = computed(() => {
  if (!props.announcement?.type) return 'bg-gray-100 text-gray-700'
  
  const classes = {
    lost: 'bg-red-100 text-red-700',
    found: 'bg-green-100 text-green-700',
    adoption: 'bg-blue-100 text-blue-700'
  }
  return classes[props.announcement.type] || 'bg-gray-100 text-gray-700'
})

const closeModal = () => {
  emit('close')
}

const openImageModal = (image) => {
  selectedImage.value = image
}

const closeImageModal = () => {
  selectedImage.value = null
}

const formatType = (type) => {
  const types = {
    lost: 'Lost Pet',
    found: 'Found Pet',
    adoption: 'For Adoption'
  }
  return types[type] || type
}

const formatPetType = (petType) => {
  if (!petType) return 'Unknown'
  return petType.charAt(0).toUpperCase() + petType.slice(1)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const shareAnnouncement = () => {
  if (navigator.share) {
    navigator.share({
      title: props.announcement?.title || 'Pet Announcement',
      text: props.announcement?.description || 'Check out this pet announcement',
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!')
    })
  }
}
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-slide-up">
      <!-- Header with dynamic background based on type and status -->
      <div :class="headerClass" class="px-8 py-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-4">
              <!-- Icon badge -->
              <div :class="iconBadgeClasses" class="p-3 rounded-full flex items-center justify-center shadow-lg">
                <i v-if="props.announcement?.status === 'resolved'" class="fas fa-check-circle text-white text-xl"></i>
                <i v-else-if="props.announcement?.type === 'lost'" class="fas fa-search text-white text-xl"></i>
                <i v-else-if="props.announcement?.type === 'found'" class="fas fa-heart text-white text-xl"></i>
                <i v-else class="fas fa-paw text-white text-xl"></i>
              </div>
              
              <div>
                <h2 class="text-2xl font-bold text-gray-900 leading-tight">{{ announcementTitle }}</h2>
                <div class="flex items-center space-x-2 mt-1">
                  <span 
                    :class="typeBadgeClass"
                    class="px-3 py-1 text-sm font-semibold rounded-full shadow-sm"
                  >
                    {{ typeText }}
                  </span>
                  <span 
                    :class="statusBadgeClass"
                    class="px-3 py-1 text-sm font-semibold rounded-full shadow-sm"
                  >
                    {{ statusText }}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              @click="handleClose"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Content with better spacing and styling -->
      <div class="px-8 py-6 max-h-[calc(95vh-200px)] overflow-y-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Images Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
            <div v-if="props.announcement?.images && props.announcement.images.length > 0" class="space-y-4">
              <!-- Main Image Display -->
              <div class="relative">
                <img
                  :src="getImageUrl(props.announcement.images[currentImageIndex])"
                  :alt="`Pet photo ${currentImageIndex + 1}`"
                  class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg cursor-pointer"
                  @click="openFullscreen(getImageUrl(props.announcement.images[currentImageIndex]))"
                />
                
                <!-- Navigation arrows -->
                <div v-if="props.announcement.images.length > 1" class="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    @click="previousImage"
                    class="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
                    :disabled="currentImageIndex === 0"
                    :class="{ 'opacity-50 cursor-not-allowed': currentImageIndex === 0 }"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  
                  <button
                    @click="nextImage"
                    class="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
                    :disabled="currentImageIndex === props.announcement.images.length - 1"
                    :class="{ 'opacity-50 cursor-not-allowed': currentImageIndex === props.announcement.images.length - 1 }"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>

                <!-- Image Counter -->
                <div v-if="props.announcement.images.length > 1" class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {{ currentImageIndex + 1 }} / {{ props.announcement.images.length }}
                </div>
              </div>

              <!-- Thumbnail Strip -->
              <div v-if="props.announcement.images.length > 1" class="flex space-x-2 overflow-x-auto pb-2">
                <button
                  v-for="(image, index) in props.announcement.images"
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="[
                    'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
                    currentImageIndex === index
                      ? 'border-blue-500 opacity-100'
                      : 'border-gray-300 opacity-70 hover:opacity-100'
                  ]"
                >
                  <img
                    :src="getImageUrl(image)"
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>

            <!-- No Images State -->
            <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
              <div class="text-gray-400 mb-4">
                <i class="fas fa-images text-4xl"></i>
              </div>
              <p class="text-gray-500">No photos available for this pet</p>
            </div>
          </div>

          <!-- Details Section with cards -->
          <div class="space-y-6">
            <!-- Basic Info Card - Simplified -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Pet Details</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-500">Pet Type:</span>
                  <span class="ml-2 text-gray-900">{{ props.announcement?.petType || 'Not specified' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Name:</span>
                  <span class="ml-2 text-gray-900">{{ props.announcement?.petName || 'Unknown' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Breed:</span>
                  <span class="ml-2 text-gray-900">{{ props.announcement?.breed || 'Not specified' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Color:</span>
                  <span class="ml-2 text-gray-900">{{ props.announcement?.color || 'Not specified' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Age:</span>
                  <span class="ml-2 text-gray-900">{{ props.announcement?.age || 'Not specified' }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Status:</span>
                  <span class="ml-2 text-gray-900">{{ props.announcement?.status || 'Unknown' }}</span>
                </div>
              </div>
            </div>

            <!-- Description Card - Simplified -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p class="text-gray-700 leading-relaxed">{{ props.announcement?.description || 'No description provided.' }}</p>
            </div>

            <!-- Location Card - Simplified -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div class="space-y-3">
                <p class="font-semibold text-gray-900 text-lg">{{ locationText }}</p>
                
                <!-- Detailed location information -->
                <div class="space-y-3">
                  <div v-if="props.announcement?.locationDetails?.address" class="flex items-start space-x-3">
                    <span class="text-sm font-medium text-gray-500 min-w-[80px] flex-shrink-0">Address:</span>
                    <span class="text-sm text-gray-700">{{ props.announcement.locationDetails.address }}</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div v-if="props.announcement?.locationDetails?.city" class="flex items-start space-x-3">
                      <span class="text-sm font-medium text-gray-500 min-w-[50px] flex-shrink-0">City:</span>
                      <span class="text-sm text-gray-700">{{ props.announcement.locationDetails.city }}</span>
                    </div>
                    <div v-if="props.announcement?.locationDetails?.state" class="flex items-start space-x-3">
                      <span class="text-sm font-medium text-gray-500 min-w-[50px] flex-shrink-0">County:</span>
                      <span class="text-sm text-gray-700">{{ props.announcement.locationDetails.state }}</span>
                    </div>
                  </div>
                  <!-- Show coordinates if available -->
                  <div v-if="props.announcement?.location?.coordinates" class="flex items-start space-x-3">
                    <span class="text-sm font-medium text-gray-500 min-w-[80px] flex-shrink-0">Coordinates:</span>
                    <span class="text-sm text-gray-600 break-all">{{ formatCoordinates(props.announcement.location.coordinates) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Info Card - Simplified -->
            <div v-if="hasContactInfo" class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div class="space-y-3">
                <div v-if="props.announcement?.contactInfo?.phone" class="flex items-center">
                  <i class="fas fa-phone mr-3 text-blue-600"></i>
                  <a :href="`tel:${props.announcement.contactInfo.phone}`" class="text-blue-600 hover:underline">
                    {{ props.announcement.contactInfo.phone }}
                  </a>
                </div>
                <div v-if="props.announcement?.contactInfo?.email" class="flex items-center">
                  <i class="fas fa-envelope mr-3 text-blue-600"></i>
                  <a :href="`mailto:${props.announcement.contactInfo.email}`" class="text-blue-600 hover:underline">
                    {{ props.announcement.contactInfo.email }}
                  </a>
                </div>
                <div v-if="props.announcement?.contactInfo?.preferredContact" class="text-sm text-gray-600">
                  <span class="font-medium">Preferred contact:</span> {{ props.announcement.contactInfo.preferredContact }}
                </div>
              </div>
            </div>

            <!-- Meta Information Card - Simplified -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div class="grid grid-cols-1 gap-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">Posted</span>
                  <span class="text-gray-900 font-semibold">{{ formattedDate }}</span>
                </div>
                <div v-if="props.announcement?.lastSeenDate" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">{{ lastSeenText }}</span>
                  <span class="text-gray-900 font-semibold">{{ formattedLastSeenDate }}</span>
                </div>
                <div v-if="props.announcement?.viewCount" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">Views</span>
                  <span class="text-gray-900 font-semibold">{{ props.announcement.viewCount }}</span>
                </div>
                <div v-if="props.announcement?.resolvedAt" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">Resolved</span>
                  <span class="text-gray-900 font-semibold">{{ formattedResolvedDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons with improved styling -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-8 border-t border-gray-200 mt-8">
          <div class="flex">
            <ActionButton 
              @click="handleClose" 
              variant="outline"
              size="md"
              class="whitespace-nowrap"
            >
              <i class="fas fa-times mr-2"></i>
              Close
            </ActionButton>
          </div>
          
          <div v-if="props.announcement?.isOwner" class="flex flex-wrap gap-2">
            <ActionButton 
              v-if="props.announcement?.status !== 'resolved'"
              @click="$emit('edit', props.announcement)"
              variant="secondary"
              size="md"
              class="whitespace-nowrap"
            >
              <i class="fas fa-edit mr-2"></i>
              Edit
            </ActionButton>
            
            <ActionButton 
              v-if="props.announcement?.status === 'active'"
              @click="$emit('resolve', props.announcement)"
              variant="success"
              size="md"
              class="whitespace-nowrap"
            >
              <i class="fas fa-check mr-2"></i>
              {{ resolveButtonText }}
            </ActionButton>
            
            <ActionButton 
              @click="handleDelete"
              variant="danger"
              size="md"
              :loading="deleting"
              class="whitespace-nowrap"
            >
              <i v-if="!deleting" class="fas fa-trash mr-2"></i>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Modal -->
    <div
      v-if="fullscreenImage"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 p-4"
      @click="closeFullscreen"
    >
      <div class="relative max-w-full max-h-full">
        <img 
          :src="fullscreenImage" 
          alt="Full size image" 
          class="max-w-full max-h-full object-contain rounded-lg"
        />
        <button
          @click="closeFullscreen"
          class="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActionButton from '../buttons/ActionButton.vue'
import DetailCard from '../cards/DetailCard.vue'
import InfoField from '../ui/InfoField.vue'
import ImageGallery from '../ui/ImageGallery.vue'
import ContactLink from '../ui/ContactLink.vue'
import { getImageUrl } from '../../services/announcementService.js'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit', 'resolve', 'delete'])

// Close handler with logging
const handleClose = () => {
  console.log('=== DETAIL MODAL CLOSE BUTTON CLICKED ===')
  console.log('Announcement being closed:', props.announcement?.id)
  console.log('About to emit close event...')
  console.log('🎯 EMITTING CLOSE EVENT TO PARENT!')
  emit('close')
  console.log('✅ Close event emitted!')
  console.log('🔍 Parent should receive this event and call handleCloseDetailModal')
  
  // BACKUP: Also emit global event directly since Vue event seems to be lost
  console.log('🚨 BACKUP: Emitting global detail-modal-closed event directly!')
  if (props.announcement?.id) {
    window.dispatchEvent(new CustomEvent('detail-modal-closed', { 
      detail: { announcementId: props.announcement.id }
    }))
    console.log('✅ Global event dispatched for announcement:', props.announcement.id)
  } else {
    window.dispatchEvent(new CustomEvent('detail-modal-closed'))
    console.log('✅ Generic global event dispatched')
  }
}

// Debug - să vedem ce primim
console.log('AnnouncementDetailModal - received announcement:', props.announcement)

// State
const currentImageIndex = ref(0)
const deleting = ref(false)
const fullscreenImage = ref(null)

// Image navigation methods
const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (props.announcement?.images && currentImageIndex.value < props.announcement.images.length - 1) {
    currentImageIndex.value++
  }
}

const openFullscreen = (imageSrc) => {
  fullscreenImage.value = imageSrc
}

const closeFullscreen = () => {
  fullscreenImage.value = null
}

// Computed
const announcementTitle = computed(() => {
  const petName = props.announcement.petName || 'Pet'
  const type = props.announcement.type || props.announcement.announcementType
  const typeText = type === 'lost' ? 'Lost' : type === 'found' ? 'Found' : 'Pet'
  return `${typeText}: ${petName}`
})

const statusBadgeClass = computed(() => {
  switch (props.announcement.status) {
    case 'active':
      return 'bg-emerald-500 text-white shadow-lg'
    case 'resolved':
      return 'bg-green-600 text-white shadow-lg'
    default:
      return 'bg-gray-500 text-white shadow-lg'
  }
})

const statusText = computed(() => {
  return props.announcement.status?.toUpperCase() || 'UNKNOWN'
})

const typeBadgeClass = computed(() => {
  switch (props.announcement.type || props.announcement.announcementType) {
    case 'lost':
      return 'bg-red-100 text-red-800 border border-red-200'
    case 'found':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'adoption':
      return 'bg-purple-100 text-purple-800 border border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
})

const typeText = computed(() => {
  return (props.announcement.type || props.announcement.announcementType)?.toUpperCase() || 'UNKNOWN'
})

const headerClass = computed(() => {
  if (props.announcement.status === 'resolved') {
    return 'bg-green-100 border-b border-green-200'
  }
  
  const type = props.announcement.type || props.announcement.announcementType
  if (type === 'lost') {
    return 'bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100'
  } else if (type === 'found') {
    return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100'
  }
  return 'bg-gray-50 border-b border-gray-100'
})

const iconBadgeClasses = computed(() => {
  const type = props.announcement.type || props.announcement.announcementType
  switch (type) {
    case 'lost':
      return {
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800 border border-red-200'
      }
    case 'found':
      return {
        icon: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-800 border border-amber-200'
      }
    case 'adoption':
      return {
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800 border border-purple-200'
      }
    default:
      return {
        icon: 'text-gray-600',
        badge: 'bg-gray-100 text-gray-800 border border-gray-200'
      }
  }
})

const locationText = computed(() => {
  // Use locationName if available (most complete address)
  if (props.announcement.locationName) {
    return props.announcement.locationName
  }
  
  // Build from locationDetails
  if (props.announcement.locationDetails) {
    const parts = []
    
    if (props.announcement.locationDetails.address) {
      parts.push(props.announcement.locationDetails.address)
    }
    
    if (props.announcement.locationDetails.city) {
      parts.push(props.announcement.locationDetails.city)
    }
    
    if (props.announcement.locationDetails.state) {
      parts.push(props.announcement.locationDetails.state)
    }
    
    if (parts.length > 0) {
      return parts.join(', ')
    }
  }
  
  // Fallback to coordinates if no address available
  if (props.announcement.location?.coordinates) {
    const coords = props.announcement.location.coordinates
    return `Coordinates: ${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`
  }
  
  return 'Location not specified'
})

// Methods
const formatCoordinates = (coordinates) => {
  if (!coordinates) return ''
  
  let lat, lng
  
  // Handle both object format {latitude: x, longitude: y} and array format [lng, lat]
  if (typeof coordinates === 'object' && !Array.isArray(coordinates)) {
    lat = coordinates.latitude
    lng = coordinates.longitude
  } else if (Array.isArray(coordinates) && coordinates.length >= 2) {
    // coordinates are [longitude, latitude] in GeoJSON format
    lat = coordinates[1]
    lng = coordinates[0]
  } else {
    return ''
  }
  
  if (lat === undefined || lng === undefined) return ''
  
  return `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)} (lat, lng)`
}

const formattedDate = computed(() => {
  if (props.announcement.createdAt) {
    return new Date(props.announcement.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return ''
})

const formattedResolvedDate = computed(() => {
  if (props.announcement.resolvedAt) {
    return new Date(props.announcement.resolvedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return ''
})

const lastSeenText = computed(() => {
  const type = props.announcement.type || props.announcement.announcementType
  return type === 'lost' ? 'Last seen' : 'Found on'
})

const formattedLastSeenDate = computed(() => {
  if (props.announcement.lastSeenDate) {
    return new Date(props.announcement.lastSeenDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  return ''
})

const hasContactInfo = computed(() => {
  return props.announcement.contactInfo?.phone || props.announcement.contactInfo?.email
})

const resolveButtonText = computed(() => {
  const type = props.announcement.type || props.announcement.announcementType
  switch (type) {
    case 'lost':
      return 'Mark as Found'
    case 'found':
      return 'Mark as Reunited'
    case 'adoption':
      return 'Mark as Adopted'
    default:
      return 'Mark as Resolved'
  }
})

// Methods
const handleDelete = () => {
  emit('delete', props.announcement)
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}
</style>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-slide-up">
      <!-- Header with dynamic background based on type and status -->
      <div :class="headerClass" class="px-8 py-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h2 class="text-2xl font-bold text-gray-900 leading-tight">{{ announcement.title }}</h2>
            <div class="flex items-center space-x-2">
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
          <button
            @click="$emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-80 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content with better spacing and styling -->
      <div class="px-8 py-6 max-h-[calc(95vh-200px)] overflow-y-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Images Section -->
          <ImageGallery 
            :images="announcement.images"
            :alt="announcement.title"
            no-images-text="No images available"
            @image-change="currentImageIndex = $event"
          />

          <!-- Details Section with cards -->
          <div class="space-y-6">
            <!-- Basic Info Card -->
            <DetailCard title="Pet Details" :icon="InfoIcon" color="blue">
              <div class="grid grid-cols-2 gap-4">
                <InfoField 
                  label="Type" 
                  :value="announcement.petType" 
                  capitalize 
                />
                <InfoField 
                  label="Breed" 
                  :value="announcement.petDetails?.breed" 
                />
                <InfoField 
                  label="Age" 
                  :value="announcement.petDetails?.age" 
                />
                <InfoField 
                  label="Color" 
                  :value="announcement.petDetails?.color" 
                />
              </div>
            </DetailCard>

            <!-- Description Card -->
            <DetailCard title="Description" :icon="DocumentIcon" color="green">
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ announcement.description }}</p>
            </DetailCard>

            <!-- Location Card -->
            <DetailCard title="Location" :icon="LocationIcon" color="red">
              <div class="space-y-3">
                <p class="font-semibold text-gray-900 text-lg">{{ locationText }}</p>
                
                <!-- Detailed location information if available -->
                <div v-if="announcement.locationDetails" class="space-y-2">
                  <div v-if="announcement.locationDetails.address" class="flex items-start">
                    <span class="text-sm font-medium text-gray-500 w-20 flex-shrink-0">Address:</span>
                    <span class="text-sm text-gray-700">{{ announcement.locationDetails.address }}</span>
                  </div>
                  <div class="flex gap-6">
                    <div v-if="announcement.locationDetails.city" class="flex items-start">
                      <span class="text-sm font-medium text-gray-500 w-12 flex-shrink-0">City:</span>
                      <span class="text-sm text-gray-700">{{ announcement.locationDetails.city }}</span>
                    </div>
                    <div v-if="announcement.locationDetails.state" class="flex items-start">
                      <span class="text-sm font-medium text-gray-500 w-12 flex-shrink-0">State:</span>
                      <span class="text-sm text-gray-700">{{ announcement.locationDetails.state }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Fallback for backward compatibility -->
                <div v-else-if="announcement.location?.address">
                  <span class="text-sm text-gray-600">{{ announcement.location.address }}</span>
                </div>
              </div>
            </DetailCard>

            <!-- Contact Info Card (if available) -->
            <DetailCard 
              v-if="showContactInfo && hasContactInfo" 
              title="Contact Information" 
              :icon="PhoneIcon" 
              color="purple"
            >
              <div class="space-y-3">
                <ContactLink
                  v-if="announcement.contactInfo?.phone"
                  type="phone"
                  :value="announcement.contactInfo.phone"
                  :icon="PhoneIcon"
                />
                <ContactLink
                  v-if="announcement.contactInfo?.email"
                  type="email"
                  :value="announcement.contactInfo.email"
                  :icon="EmailIcon"
                />
              </div>
            </DetailCard>

            <!-- Meta Information Card -->
            <DetailCard title="Additional Information" :icon="ClockIcon" color="yellow">
              <div class="grid grid-cols-1 gap-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">Posted</span>
                  <span class="text-gray-900 font-semibold">{{ formattedDate }}</span>
                </div>
                <div v-if="announcement.lastSeenDate" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">{{ lastSeenText }}</span>
                  <span class="text-gray-900 font-semibold">{{ formattedLastSeenDate }}</span>
                </div>
                <div v-if="announcement.views" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">Views</span>
                  <span class="text-gray-900 font-semibold">{{ announcement.views }}</span>
                </div>
                <div v-if="announcement.resolvedAt" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-gray-600 font-medium">Resolved</span>
                  <span class="text-gray-900 font-semibold">{{ formattedResolvedDate }}</span>
                </div>
              </div>
            </DetailCard>
          </div>
        </div>

        <!-- Action Buttons with improved styling -->
        <div class="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
          <div class="flex space-x-3">
            <ActionButton 
              @click="$emit('close')" 
              variant="outline"
              class="px-6 py-3 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </ActionButton>
          </div>
          
          <div v-if="announcement.isOwner" class="flex space-x-3">
            <ActionButton 
              @click="$emit('edit', announcement)"
              variant="secondary"
              class="px-6 py-3 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </ActionButton>
            
            <ActionButton 
              v-if="announcement.status === 'active'"
              @click="$emit('resolve', announcement)"
              variant="primary"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ resolveButtonText }}
            </ActionButton>
            
            <ActionButton 
              @click="handleDelete"
              variant="danger"
              :loading="deleting"
              class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 transition-all duration-200 transform hover:scale-105"
            >
              <svg v-if="!deleting" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </ActionButton>
          </div>
        </div>
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
import StatusBadge from '../ui/StatusBadge.vue'
// Import icons
import InfoIcon from '../icons/InfoIcon.vue'
import DocumentIcon from '../icons/DocumentIcon.vue'
import LocationIcon from '../icons/LocationIcon.vue'
import PhoneIcon from '../icons/PhoneIcon.vue'
import EmailIcon from '../icons/EmailIcon.vue'
import ClockIcon from '../icons/ClockIcon.vue'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit', 'resolve', 'delete'])

// State
const currentImageIndex = ref(0)
const deleting = ref(false)

// Computed
const currentImage = computed(() => {
  if (props.announcement.images && props.announcement.images.length > 0) {
    return props.announcement.images[currentImageIndex.value]
  }
  return null
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
  // Match header colors with card headers
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

const locationText = computed(() => {
  // First try locationName from backend (preferred)
  if (props.announcement.locationName) {
    return props.announcement.locationName
  }
  
  // Build location from locationDetails if available
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
  
  // Fallback to building location from location object (for backward compatibility)
  if (props.announcement.location) {
    const parts = []
    
    if (props.announcement.location.address) {
      parts.push(props.announcement.location.address)
    }
    
    if (props.announcement.location.city) {
      parts.push(props.announcement.location.city)
    }
    
    if (props.announcement.location.state) {
      parts.push(props.announcement.location.state)
    }
    
    if (parts.length > 0) {
      return parts.join(', ')
    }
  }
  
  return 'Location not specified'
})

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

const showContactInfo = computed(() => {
  return props.announcement.isOwner || 
         props.announcement.status === 'resolved' ||
         (props.announcement.type || props.announcement.announcementType) === 'found'
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

const resolveButtonVariant = computed(() => {
  const type = props.announcement.type || props.announcement.announcementType
  switch (type) {
    case 'lost':
      return 'success'
    case 'found':
      return 'warning'
    case 'adoption':
      return 'primary'
    default:
      return 'success'
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Enhanced border style for image thumbnails */
.border-3 {
  border-width: 3px;
}

/* Custom scrollbar for the modal */
.max-h-\[calc\(95vh-200px\)\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[calc\(95vh-200px\)\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.max-h-\[calc\(95vh-200px\)\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.max-h-\[calc\(95vh-200px\)\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Better hover effects for interactive elements */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Smooth transitions for all interactive elements */
button, .cursor-pointer {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus visible improvements */
button:focus-visible,
select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

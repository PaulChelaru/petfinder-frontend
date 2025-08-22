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
            <i class="fas fa-times w-6 h-6"></i>
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
            <DetailCard title="Pet Details" color="blue">
              <template #icon>
                <i class="fas fa-info-circle"></i>
              </template>
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
            <DetailCard title="Description" color="green">
              <template #icon>
                <i class="fas fa-file-text"></i>
              </template>
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ announcement.description }}</p>
            </DetailCard>

            <!-- Location Card -->
            <DetailCard title="Location" color="red">
              <template #icon>
                <i class="fas fa-map-marker-alt"></i>
              </template>
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
              color="purple"
            >
              <template #icon>
                <i class="fas fa-phone"></i>
              </template>
              <div class="space-y-3">
                <ContactLink
                  v-if="announcement.contactInfo?.phone"
                  type="phone"
                  :value="announcement.contactInfo.phone"
                />
                <ContactLink
                  v-if="announcement.contactInfo?.email"
                  type="email"
                  :value="announcement.contactInfo.email"
                />
              </div>
            </DetailCard>

            <!-- Meta Information Card -->
            <DetailCard title="Additional Information" color="yellow">
              <template #icon>
                <i class="fas fa-clock"></i>
              </template>
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
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-8 border-t border-gray-200 mt-8">
          <div class="flex">
            <ActionButton 
              @click="$emit('close')" 
              variant="outline"
              size="md"
              class="whitespace-nowrap"
            >
              <i class="fas fa-times mr-2"></i>
              Close
            </ActionButton>
          </div>
          
          <div v-if="announcement.isOwner" class="flex flex-wrap gap-2">
            <ActionButton 
              v-if="announcement.status !== 'resolved'"
              @click="$emit('edit', announcement)"
              variant="secondary"
              size="md"
              class="whitespace-nowrap"
            >
              <i class="fas fa-edit mr-2"></i>
              Edit
            </ActionButton>
            
            <ActionButton 
              v-if="announcement.status === 'active'"
              @click="$emit('resolve', announcement)"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActionButton from '../buttons/ActionButton.vue'
import DetailCard from '../cards/DetailCard.vue'
import InfoField from '../ui/InfoField.vue'
import ImageGallery from '../ui/ImageGallery.vue'
import ContactLink from '../ui/ContactLink.vue'

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

const locationText = computed(() => {
  if (props.announcement.locationName) {
    return props.announcement.locationName
  }
  
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

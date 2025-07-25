<template>
  <div class="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div :class="headerClass" class="px-4 py-3 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div :class="iconBadgeClass" class="mr-3">
            <!-- Checkmark icon for resolved announcements -->
            <svg v-if="announcement.status === 'resolved'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            
            <!-- Search/magnifying glass icon for lost pets -->
            <svg v-else-if="announcement.type === 'lost'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            
            <!-- Heart/home icon for found pets -->
            <svg v-else-if="announcement.type === 'found'" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            
            <!-- Default icon -->
            <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          
          <span :class="headerTextClass" class="font-bold text-sm uppercase">
            {{ typeText }}
          </span>
        </div>
        
        <!-- Status Badge - only show for resolved announcements -->
        <StatusBadge v-if="announcement.status === 'resolved'" :variant="announcement.status">
          {{ statusText }}
        </StatusBadge>
      </div>
    </div>

    <!-- Image Section -->
    <div class="relative h-48 bg-gray-100 overflow-hidden">
      <!-- Color overlay for type distinction -->
      <div v-if="announcement.type === 'lost'" class="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 opacity-40 z-10"></div>
      <div v-else-if="announcement.type === 'found'" class="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-40 z-10"></div>
      
      <!-- Loading state -->
      <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <!-- Image -->
      <img 
        v-if="announcement.images && announcement.images.length > 0 && !imageError"
        :src="announcement.images[0]" 
        :alt="announcement.petName"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        @load="imageLoading = false"
        @error="handleImageError"
      >
      
      <!-- Fallback when no image or error -->
      <div v-else class="flex items-center justify-center h-full text-gray-400 relative z-10">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
          </svg>
          <p class="text-xs text-gray-500">{{ imageError ? 'Image failed to load' : 'No image available' }}</p>
        </div>
      </div>
      
      <!-- Image count indicator -->
      <div v-if="announcement.images && announcement.images.length > 1 && !imageError" 
           class="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full z-20">
        1/{{ announcement.images.length }}
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col h-full">
      <!-- Main Content Area -->
      <div class="flex-1 space-y-3 px-4 pt-4">
        <!-- Pet Name and Type Badge -->
        <div class="flex items-center justify-between mb-2">
          <h3 :class="petNameClass" class="truncate flex-1">
            {{ announcement.petName || 'Unknown Pet' }}
          </h3>
          
          <!-- Pet Type Badge - Large and Prominent -->
          <div class="ml-3 shrink-0">
            <StatusBadge :variant="petTypeVariant" class="text-sm font-bold px-3 py-1.5 shadow-md">
              <span class="flex items-center gap-2">
                <!-- Dog icon -->
                <svg v-if="announcement.petType === 'dog'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.5 12a7.5 7.5 0 0015 0 7.5 7.5 0 00-15 0z"/>
                  <path d="M12 1.5c-1.5 0-2.5 1-2.5 2s1 2 2.5 2 2.5-1 2.5-2-1-2-2.5-2z"/>
                  <path d="M8.5 7.5c-.5 0-1 .5-1 1v3c0 .5.5 1 1 1s1-.5 1-1v-3c0-.5-.5-1-1-1z"/>
                  <path d="M15.5 7.5c-.5 0-1 .5-1 1v3c0 .5.5 1 1 1s1-.5 1-1v-3c0-.5-.5-1-1-1z"/>
                </svg>
                <!-- Cat icon -->
                <svg v-else-if="announcement.petType === 'cat'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1.5L9 4.5v2L7.5 8v4.5c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V8L15 6.5v-2L12 1.5z"/>
                  <path d="M8.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  <path d="M15.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  <path d="M12 12.5c.5 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .5 1 1 1z"/>
                </svg>
                <!-- Default pet icon -->
                <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="capitalize font-bold uppercase tracking-wide">{{ announcement.petType || 'Pet' }}</span>
              </span>
            </StatusBadge>
          </div>
        </div>

        <!-- Description -->
        <p :class="descriptionClass" class="line-clamp-2">
          {{ announcement.description }}
        </p>

        <!-- Last Seen Date (for lost pets) or Found Date -->
        <div v-if="announcement.lastSeenDate" class="flex items-center text-gray-500 text-sm">
          <ClockIcon class="w-4 h-4 mr-2 shrink-0" />
          <span class="truncate">
            {{ lastSeenText }}: {{ formatDate(announcement.lastSeenDate) }}
          </span>
        </div>

        <!-- Location -->
        <div class="flex items-center text-gray-500 text-sm">
          <LocationIcon class="w-4 h-4 mr-2 shrink-0" />
          <span class="truncate">{{ locationDisplay }}</span>
        </div>

        <!-- Posted Date -->
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>Posted: {{ formattedDate }}</span>
        </div>
      </div>

      <!-- Contact Info Section (if available) -->
      <div v-if="showContactInfo && hasContactInfo" class="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <h4 class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Contact Info</h4>
        <div class="space-y-2">
          <ContactLink 
            v-if="announcement.contactInfo?.phone || announcement.contactPhone"
            type="phone"
            :value="announcement.contactInfo?.phone || announcement.contactPhone"
            :icon="PhoneIcon"
          />
          <ContactLink 
            v-if="announcement.contactInfo?.email || announcement.contactEmail"
            type="email"
            :value="announcement.contactInfo?.email || announcement.contactEmail"
            :icon="EmailIcon"
          />
        </div>
      </div>

      <!-- Action Buttons - Fixed at bottom -->
      <div class="px-4 py-3 border-t border-gray-100 bg-white">
        <div class="flex gap-2">
          <ActionButton 
            @click="emit('view', announcement)"
            variant="outline"
            size="sm"
            class="flex-1"
          >
            View Details
          </ActionButton>
          
          <ActionButton 
            v-if="announcement.isOwner"
            @click="emit('edit', announcement)"
            variant="secondary"
            size="sm"
          >
            Edit
          </ActionButton>
          
          <ActionButton 
            v-if="announcement.isOwner && announcement.status === 'active'"
            @click="emit('resolve', announcement)"
            :variant="resolveButtonVariant"
            size="sm"
          >
            {{ resolveButtonText }}
          </ActionButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusBadge from '../ui/StatusBadge.vue'
import ActionButton from '../buttons/ActionButton.vue'
import ContactLink from '../ui/ContactLink.vue'
import ClockIcon from '../icons/ClockIcon.vue'
import LocationIcon from '../icons/LocationIcon.vue'
import PhoneIcon from '../icons/PhoneIcon.vue'
import EmailIcon from '../icons/EmailIcon.vue'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'resolve'])

// Reactive state
const imageLoading = ref(true)
const imageError = ref(false)

// Methods
const handleImageError = () => {
  imageLoading.value = false
  imageError.value = true
}

// Computed properties
const cardVariant = computed(() => {
  if (props.announcement.status === 'resolved') return 'resolved'
  if (props.announcement.type === 'lost') return 'lost'
  if (props.announcement.type === 'found') return 'found'
  return 'default'
})

const iconBadgeClass = computed(() => {
  const baseClass = 'p-2 rounded-full flex items-center justify-center'
  if (props.announcement.status === 'resolved') {
    return `${baseClass} bg-green-600`
  }
  if (props.announcement.type === 'lost') {
    return `${baseClass} bg-red-600`
  } else if (props.announcement.type === 'found') {
    return `${baseClass} bg-yellow-600`
  }
  return `${baseClass} bg-gray-600`
})

const headerClass = computed(() => {
  if (props.announcement.status === 'resolved') {
    return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
  }
  if (props.announcement.type === 'lost') {
    return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
  } else if (props.announcement.type === 'found') {
    return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
  }
  return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
})

const headerTextClass = computed(() => {
  // All headers now have white text due to colored backgrounds
  return 'text-white'
})

const typeTextClass = computed(() => {
  if (props.announcement.status === 'resolved') {
    return 'text-white'
  }
  if (props.announcement.type === 'lost') {
    return 'text-white'
  } else if (props.announcement.type === 'found') {
    return 'text-white'
  }
  return 'text-white'
})

const typeText = computed(() => {
  if (props.announcement.status === 'resolved') {
    return props.announcement.type || 'Unknown'
  }
  return props.announcement.type || 'Unknown'
})

const petTypeVariant = computed(() => {
  if (props.announcement.petType === 'dog') return 'primary' // Blue for dogs
  if (props.announcement.petType === 'cat') return 'orange' // Orange for cats
  return 'secondary'
})

const statusText = computed(() => {
  return props.announcement.status === 'resolved' ? 'RESOLVED' : ''
})

const petNameClass = computed(() => {
  const baseClass = 'text-lg font-bold'
  if (props.announcement.status === 'resolved') {
    return `${baseClass} text-gray-600`
  }
  if (props.announcement.type === 'lost') {
    return `${baseClass} text-red-800`
  } else if (props.announcement.type === 'found') {
    return `${baseClass} text-yellow-800`
  }
  return `${baseClass} text-gray-800`
})

const descriptionClass = computed(() => {
  if (props.announcement.status === 'resolved') {
    return 'text-gray-600'
  }
  return 'text-gray-700'
})

const lastSeenText = computed(() => {
  return props.announcement.type === 'lost' ? 'Last seen' : 'Found on'
})

const resolveButtonVariant = computed(() => {
  return props.announcement.type === 'lost' ? 'danger' : 'warning'
})

const resolveButtonText = computed(() => {
  return props.announcement.type === 'lost' ? 'Mark Found' : 'Mark Reunited'
})

const showContactInfo = computed(() => {
  return props.announcement.isOwner || props.announcement.status === 'resolved'
})

const hasContactInfo = computed(() => {
  return (props.announcement.contactInfo?.phone || props.announcement.contactPhone) || 
         (props.announcement.contactInfo?.email || props.announcement.contactEmail)
})

const locationDisplay = computed(() => {
  // Try different location fields
  if (props.announcement.locationName) {
    return props.announcement.locationName
  }
  if (props.announcement.location) {
    return props.announcement.location
  }
  if (props.announcement.locationDetails?.city) {
    const parts = []
    if (props.announcement.locationDetails.city) parts.push(props.announcement.locationDetails.city)
    if (props.announcement.locationDetails.state) parts.push(props.announcement.locationDetails.state)
    return parts.join(', ')
  }
  return 'Location not specified'
})

const formattedDate = computed(() => {
  return formatDate(props.announcement.createdAt)
})

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Image hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Improved focus styles */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Better card hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Fixed bottom elements */
.absolute.bottom-0 {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.absolute.bottom-16 {
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}

/* Pet type badge styling */
.capitalize {
  text-transform: capitalize;
}

/* Enhanced pet type badge visibility */
.shrink-0 .inline-flex {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid white;
  transform: scale(1.05);
  font-weight: 700;
}

.shrink-0 .inline-flex:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Card height consistency */
.relative.pb-20 {
  min-height: 400px;
}

/* Better contact info styling */
.absolute.bottom-16 {
  border-radius: 8px 8px 0 0;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}
</style>

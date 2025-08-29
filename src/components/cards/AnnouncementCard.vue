<template>
  <BaseCard 
    :variant="cardVariant" 
    :rounded="'lg'"
    class="announcement-card hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] cursor-pointer"
  >
    <!-- Header with Type Badge and Status -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <!-- Icon Badge -->
          <div :class="iconBadgeClasses" class="p-3 rounded-full flex items-center justify-center">
            <i v-if="announcement.status === 'resolved'" class="fas fa-check-circle text-white text-xl"></i>
            <i v-else-if="announcement.type === 'lost'" class="fas fa-search text-white text-xl"></i>
            <i v-else-if="announcement.type === 'found'" class="fas fa-heart text-white text-xl"></i>
            <i v-else class="fas fa-paw text-white text-xl"></i>
          </div>
          
          <!-- Type Text -->
          <div>
            <span class="font-bold text-black text-2xl uppercase tracking-wide drop-shadow-lg">
              {{ typeDisplayText }}
            </span>
          </div>
        </div>
        
        <!-- Status Badge -->
        <div v-if="showStatusBadge">
          <span :class="statusBadgeClasses" class="px-3 py-1 rounded-full text-xs font-semibold">
            {{ announcement.status === 'resolved' ? 'RESOLVED' : 'ACTIVE' }}
          </span>
        </div>
      </div>
    </template>

    <!-- Content -->
    <div class="space-y-4">
      <!-- Image Section -->
      <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
        <!-- Pet Type Badge - Positioned over image -->
        <div v-if="announcement.petType" class="absolute top-3 right-3 z-10">
          <span :class="petTypeBadgeClasses" class="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
            {{ formatPetTypeForBadge(announcement.petType) }}
          </span>
        </div>
        
        <img 
          v-if="announcement.images && announcement.images.length > 0"
          :src="getImageUrl(announcement.images[0])" 
          :alt="announcement.title || 'Pet image'"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <i class="fas fa-paw text-gray-400 text-4xl"></i>
        </div>
      </div>

      <!-- Pet Name and Title -->
      <div>
        <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {{ announcement.petName || announcement.title || 'Unknown Pet' }}
        </h3>
        <p v-if="announcement.description" class="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {{ announcement.description }}
        </p>
      </div>
      
      <!-- Details Grid -->
      <div class="space-y-3">
        <!-- Location -->
        <div class="flex items-center text-sm text-gray-600">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
            <i class="fas fa-map-marker-alt text-blue-600 text-sm"></i>
          </div>
          <span class="truncate">{{ locationText }}</span>
        </div>
        
        <!-- Date Posted -->
        <div class="flex items-center text-sm text-gray-600">
          <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
            <i class="fas fa-calendar text-purple-600 text-sm"></i>
          </div>
          <span>Posted: {{ formatDate(announcement.createdAt) }}</span>
        </div>

        <!-- Contact Info -->
        <div v-if="contactInfo" class="flex items-center text-sm text-gray-600">
          <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
            <i class="fas fa-user text-green-600 text-sm"></i>
          </div>
          <span class="truncate">{{ contactInfo }}</span>
        </div>
      </div>
    </div>

    <!-- Footer with Action Buttons -->
    <template #footer>
      <div class="flex items-center justify-between space-x-3">
        <!-- View Details Button -->
        <button 
          @click.stop="$emit('view', announcement)"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center group"
        >
          <span>View</span>
          <i class="fas fa-eye ml-2 group-hover:scale-110 transition-transform"></i>
        </button>

        <!-- Edit Button (only for owners) -->
        <button 
          v-if="announcement.isOwner && announcement.status !== 'resolved'"
          @click.stop="$emit('edit', announcement)"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <i class="fas fa-edit mr-1"></i>
          <span>Edit</span>
        </button>

        <!-- Resolve Button (only for owners and active announcements) -->
        <button 
          v-if="announcement.isOwner && announcement.status === 'active'"
          @click.stop="$emit('resolve', announcement)"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <i class="fas fa-check mr-1"></i>
          <span>Resolve</span>
        </button>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from './BaseCard.vue'
import { getImageUrl } from '../../services/announcementService.js'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'resolve'])

// Computed properties for card styling and behavior
const cardVariant = computed(() => {
  if (props.announcement.status === 'resolved') return 'glass'
  return 'elevated'
})

const iconBadgeClasses = computed(() => {
  const baseClasses = 'shadow-lg'
  
  if (props.announcement.status === 'resolved') {
    return `${baseClasses} bg-emerald-600`
  }
  if (props.announcement.type === 'lost') {
    return `${baseClasses} bg-rose-600`
  }
  if (props.announcement.type === 'found') {
    return `${baseClasses} bg-amber-600`
  }
  return `${baseClasses} bg-indigo-600`
})

const statusBadgeClasses = computed(() => {
  if (props.announcement.status === 'resolved') {
    return 'bg-green-100 text-green-800'
  }
  return 'bg-blue-100 text-blue-800'
})

const typeDisplayText = computed(() => {
  if (props.announcement.status === 'resolved') {
    return 'RESOLVED'
  }
  if (props.announcement.type === 'lost') {
    return 'LOST PET'
  }
  if (props.announcement.type === 'found') {
    return 'FOUND PET'
  }
  return props.announcement.type?.toUpperCase() || 'PET ANNOUNCEMENT'
})

const showStatusBadge = computed(() => {
  return props.announcement.status === 'resolved'
})

const petTypeBadgeClasses = computed(() => {
  const petType = props.announcement.petType?.toLowerCase()
  
  if (petType === 'dog') {
    return 'bg-orange-600 text-white border border-orange-700'
  }
  if (petType === 'cat') {
    return 'bg-purple-600 text-white border border-purple-700'
  }
  
  // Default styling for other pet types
  return 'bg-slate-600 text-white border border-slate-700'
})

const locationText = computed(() => {
  // Try different location field combinations
  if (props.announcement.locationDetails) {
    const details = props.announcement.locationDetails
    const parts = []
    
    if (details.city) parts.push(details.city)
    if (details.state) parts.push(details.state)
    if (details.country) parts.push(details.country)
    
    if (parts.length > 0) {
      return parts.join(', ')
    }
    
    if (details.address) {
      return details.address
    }
  }
  
  // Fallback to other location formats
  if (props.announcement.location) {
    if (typeof props.announcement.location === 'string') {
      return props.announcement.location
    }
    if (props.announcement.location.address) {
      return props.announcement.location.address
    }
  }
  
  return 'Location not specified'
})

const contactInfo = computed(() => {
  // Try to get contact information from different possible fields
  if (props.announcement.contactInfo) {
    const contact = props.announcement.contactInfo
    if (contact.phone && contact.email) {
      return `${contact.phone} • ${contact.email}`
    }
    if (contact.phone) return contact.phone
    if (contact.email) return contact.email
  }
  
  // Legacy field support
  if (props.announcement.contactPhone) return props.announcement.contactPhone
  if (props.announcement.contactEmail) return props.announcement.contactEmail
  if (props.announcement.phone) return props.announcement.phone
  if (props.announcement.email) return props.announcement.email
  
  return null
})

const formatType = (type) => {
  if (!type) return 'Unknown'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatPetType = (petType) => {
  if (!petType) return 'Pet'
  
  const petTypes = {
    'dog': '🐕 Dog',
    'cat': '🐱 Cat'
  }
  
  return petTypes[petType.toLowerCase()] || petType.charAt(0).toUpperCase() + petType.slice(1)
}

const formatPetTypeForBadge = (petType) => {
  if (!petType) return 'PET'
  
  const petTypes = {
    'dog': '🐕 DOG',
    'cat': '🐱 CAT'
  }
  
  return petTypes[petType.toLowerCase()] || petType.toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date not available'
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 168) { // Less than a week
      return `${Math.floor(diffInHours / 24)} days ago`
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  } catch (error) {
    return 'Invalid date'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.announcement-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.announcement-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Improved mobile responsiveness */
@media (max-width: 640px) {
  .announcement-card .p-6 {
    padding: 1rem;
  }
  
  .announcement-card h3 {
    font-size: 1rem;
  }
}
</style>
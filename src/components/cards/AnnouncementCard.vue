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

    <!-- Matches Section -->
    <div v-if="announcement.isOwner && announcement.matches && announcement.matches.length > 0" class="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3 flex-shrink-0">
            <i class="fas fa-magic text-white text-sm"></i>
          </div>
          <div>
            <span class="text-sm font-semibold text-gray-800">
              🎯 {{ announcement.matches.length }} potential match{{ announcement.matches.length !== 1 ? 'es found' : ' found' }}
            </span>
            <div v-if="announcement.matches[0]" class="text-xs text-gray-600">
              Best match: {{ getMatchScoreDisplay(getMatchScore(announcement.matches[0])) }}% similarity
            </div>
          </div>
        </div>
        <button 
          @click.stop="openMatchesModal"
          class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <i class="fas fa-search-plus"></i>
          View All Matches
        </button>
      </div>
    </div>

    <!-- No Matches Section -->
    <div v-else-if="announcement.isOwner && (!announcement.matches || announcement.matches.length === 0)" class="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
      <div class="flex items-center mb-3" style="min-height: 40px;">
        <div class="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3 flex-shrink-0">
          <i class="fas fa-search text-white text-sm"></i>
        </div>
        <div class="flex-1">
          <span class="text-sm font-medium text-gray-700">
            🔍 No matches found yet
          </span>
          <div class="text-xs text-gray-500 mt-1">
            Our matching system is continuously searching for matches
          </div>
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

  <!-- Matches Modal -->
  <MatchesModal
    :is-open="isMatchesModalVisible"
    :matches="announcement.matches || []"
    @close="closeMatchesModal"
    @view-announcement="handleViewAnnouncement"
  />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import BaseCard from './BaseCard.vue'
import MatchesModal from '../modals/MatchesModal.vue'
import { getImageUrl } from '../../services/announcementService.js'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'resolve', 'viewMatch', 'viewAllMatches', 'view-announcement', 'refresh-matches', 'detail-modal-closed'])

// Reactive data
const showMatchesModal = ref(false)
const hideMatchesModalTemporarily = ref(false)

// Computed for matches modal visibility
const isMatchesModalVisible = computed(() => {
  const visible = showMatchesModal.value && !hideMatchesModalTemporarily.value
  if (props.announcement.id) {
    console.log(`[${props.announcement.id}] Matches modal visibility calculated:`, visible, { 
      showMatchesModal: showMatchesModal.value, 
      hideTemporarily: hideMatchesModalTemporarily.value 
    })
  }
  return visible
})

// Helper function for match scores
const getMatchScore = (match) => {
  return match.matchScore || (match.confidence && match.confidence * 100) || 0
}

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

// Helper functions for match scores
const getMatchScoreDisplay = (score) => {
  if (score === null || score === undefined) return '0'
  if (typeof score === 'number') {
    return Math.round(score)
  }
  return '0'
}

const getMatchScoreColor = (score) => {
  const numScore = Number(score) || 0
  if (numScore >= 80) return 'text-emerald-600'
  if (numScore >= 60) return 'text-yellow-600'
  if (numScore >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const getScoreIndicatorColor = (score) => {
  const numScore = Number(score) || 0
  if (numScore >= 80) return 'bg-emerald-500'
  if (numScore >= 60) return 'bg-yellow-500'
  if (numScore >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

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

// Function to view match details
const viewMatchDetails = async (announcementId) => {
  try {
    emit('view-announcement', announcementId);
  } catch (error) {
    console.error('Error viewing match details:', error);
  }
}

// Modal functions
const openMatchesModal = () => {
  console.log(`[${props.announcement.id}] Opening matches modal`)
  // Reset any temporary hide state first
  hideMatchesModalTemporarily.value = false
  showMatchesModal.value = true
}

const closeMatchesModal = () => {
  console.log(`[${props.announcement.id}] Closing matches modal`)
  showMatchesModal.value = false
  hideMatchesModalTemporarily.value = false // Reset the temporary hide flag
}

const handleViewAnnouncement = (announcementOrMatch) => {
  // If MatchesModal is open, hide it temporarily
  if (showMatchesModal.value) {
    console.log('🔒 HIDING MATCHES MODAL TEMPORARILY for announcement:', props.announcement.id)
    console.log('State BEFORE hiding:', {
      showMatchesModal: showMatchesModal.value,
      hideTemporarily: hideMatchesModalTemporarily.value
    })
    hideMatchesModalTemporarily.value = true
    console.log('State AFTER hiding:', {
      showMatchesModal: showMatchesModal.value,
      hideTemporarily: hideMatchesModalTemporarily.value
    })
  }
  console.log('=== ANNOUNCEMENT CARD - EMITTING VIEW-ANNOUNCEMENT ===')
  console.log('Emitting for announcement/match:', announcementOrMatch?.id || announcementOrMatch?.announcementId)
  console.log('Re-emitting to parent view...')
  emit('view-announcement', announcementOrMatch)
}

// Function to handle when detail modal is closed
const handleDetailModalClosed = () => {
  // If MatchesModal was hidden temporarily, show it again
  if (hideMatchesModalTemporarily.value) {
    hideMatchesModalTemporarily.value = false
    // MatchesModal will reappear since showMatchesModal is still true
  }
  emit('detail-modal-closed')
}

// Function to refresh matches search
const refreshMatches = () => {
  emit('refresh-matches', props.announcement.id)
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

// Listen for global detail modal close events
const handleGlobalDetailModalClosed = (event) => {
  // Check if this event is for this specific announcement
  const announcementId = event.detail?.announcementId
  console.log('🔥 GLOBAL DETAIL MODAL CLOSED EVENT RECEIVED 🔥')
  console.log('Event announcementId:', announcementId, 'current announcement:', props.announcement.id)
  console.log(`[${props.announcement.id}] Current state BEFORE processing:`, {
    showMatchesModal: showMatchesModal.value,
    hideTemporarily: hideMatchesModalTemporarily.value
  })
  
  // IMPORTANT: Restore matches modal for ANY announcement that has hideTemporarily = true
  // This handles the case where we opened detail modal for a DIFFERENT announcement 
  // while matches modal was open for THIS announcement
  if (hideMatchesModalTemporarily.value) {
    console.log('✅ RESTORING MATCHES MODAL for announcement:', props.announcement.id)
    console.log('(This announcement had matches modal temporarily hidden)')
    hideMatchesModalTemporarily.value = false
    console.log('State AFTER restore:', {
      showMatchesModal: showMatchesModal.value,
      hideTemporarily: hideMatchesModalTemporarily.value
    })
  }
}

// Watchers for debugging
watch(showMatchesModal, (newVal) => {
  console.log(`[${props.announcement.id}] showMatchesModal changed to:`, newVal)
})

watch(hideMatchesModalTemporarily, (newVal) => {
  console.log(`[${props.announcement.id}] hideMatchesModalTemporarily changed to:`, newVal)
})

onMounted(() => {
  window.addEventListener('detail-modal-closed', handleGlobalDetailModalClosed)
})

onUnmounted(() => {
  window.removeEventListener('detail-modal-closed', handleGlobalDetailModalClosed)
})
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
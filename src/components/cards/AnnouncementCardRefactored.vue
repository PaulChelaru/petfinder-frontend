<template>
  <GenericCard :variant="cardVariant">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div :class="iconBadgeClass" class="mr-3">
            <!-- Checkmark icon for resolved announcements -->
            <i v-if="announcement.status === 'resolved'" class="fas fa-check-circle w-5 h-5 text-white"></i>
            
            <!-- Search/magnifying glass icon for lost pets -->
            <i v-else-if="announcement.type === 'lost'" class="fas fa-search w-5 h-5 text-white"></i>
            
            <!-- Heart/home icon for found pets -->
            <i v-else-if="announcement.type === 'found'" class="fas fa-heart w-5 h-5 text-white"></i>
            
            <!-- Default icon -->
            <i v-else class="fas fa-eye w-5 h-5 text-white"></i>
          </div>
          
          <span :class="typeTextClass" class="font-bold text-sm uppercase">
            {{ typeText }}
          </span>
        </div>
        
        <!-- Status Badge - only show for resolved announcements -->
        <StatusBadge v-if="announcement.status === 'resolved'" :variant="announcement.status">
          {{ statusText }}
        </StatusBadge>
      </div>
    </template>

    <!-- Image Section -->
    <div class="relative h-48 bg-gray-100">
      <!-- Color overlay for type distinction -->
      <div v-if="announcement.type === 'lost'" class="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 opacity-40"></div>
      <div v-else-if="announcement.type === 'found'" class="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-40"></div>
      
      <img 
        v-if="announcement.images && announcement.images.length > 0"
        :src="announcement.images[0]" 
        :alt="announcement.petName"
        class="w-full h-full object-cover relative z-10"
        @error="imageError = true"
      >
      <div v-else class="flex items-center justify-center h-full text-gray-400 relative z-10">
        <i class="fas fa-image w-12 h-12 text-4xl"></i>
      </div>
    </div>

    <!-- Content Section -->
    <div class="space-y-3">
      <!-- Pet Name and Type -->
      <div class="flex items-start justify-between">
        <h3 :class="petNameClass" class="truncate flex-1">
          {{ announcement.petName || 'Unknown Pet' }}
        </h3>
        <StatusBadge variant="primary" class="ml-3 shrink-0">
          {{ announcement.petType }}
        </StatusBadge>
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
        <span class="truncate">{{ announcement.location }}</span>
      </div>

      <!-- Posted Date -->
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span>Posted: {{ formattedDate }}</span>
      </div>

      <!-- Contact Info (if owner or resolved) -->
      <div v-if="showContactInfo" class="border-t pt-3 mt-3 space-y-2">
        <ContactLink 
          v-if="announcement.contactPhone"
          type="phone"
          :value="announcement.contactPhone"
        />
        <ContactLink 
          v-if="announcement.contactEmail"
          type="email"
          :value="announcement.contactEmail"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <template #actions>
      <ActionButton 
        @click="$emit('view', announcement)"
        variant="outline"
        size="sm"
        class="flex-1"
      >
        View Details
      </ActionButton>
      
      <ActionButton 
        v-if="announcement.isOwner && announcement.status !== 'resolved'"
        @click="$emit('edit', announcement)"
        variant="secondary"
        size="sm"
      >
        Edit
      </ActionButton>
      
      <ActionButton 
        v-if="announcement.isOwner && announcement.status === 'active'"
        @click="$emit('resolve', announcement)"
        :variant="resolveButtonVariant"
        size="sm"
      >
        {{ resolveButtonText }}
      </ActionButton>
    </template>
  </GenericCard>
</template>

<script setup>
import { computed } from 'vue'
import GenericCard from './GenericCard.vue'
import StatusBadge from '../ui/StatusBadge.vue'
import ActionButton from '../buttons/ActionButton.vue'
import ContactLink from '../ui/ContactLink.vue'
import ClockIcon from '../icons/ClockIcon.vue'
import LocationIcon from '../icons/LocationIcon.vue'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'resolve'])

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
    return 'Resolved'
  }
  return props.announcement.type || 'Unknown'
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

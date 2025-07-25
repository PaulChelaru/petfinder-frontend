<template>
  <GenericCard :variant="cardVariant">
    <!-- Header -->
    <template #header>
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
        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
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
        v-if="announcement.isOwner"
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

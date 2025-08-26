<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter Announcements</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <!-- Announcement Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select 
          v-model="localFilters.type"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Types</option>
          <option value="lost">Lost Pet</option>
          <option value="found">Found Pet</option>
        </select>
      </div>

      <!-- Pet Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
        <select 
          v-model="localFilters.petType"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Pets</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </div>

      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Posted Since</label>
        <select 
          v-model="localFilters.dateRange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Any Time</option>
          <option value="1">Last 24 hours</option>
          <option value="7">Last week</option>
          <option value="30">Last month</option>
          <option value="90">Last 3 months</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- Location -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <BaseButton 
          @click="toggleLocationFilter"
          :variant="showLocationFilter ? 'danger' : 'outline'"
          size="sm"
          class="w-full"
        >
          <i v-if="showLocationFilter" class="fas fa-times w-4 h-4 mr-2"></i>
          <i v-else class="fas fa-map-marker-alt w-4 h-4 mr-2"></i>
          {{ showLocationFilter ? 'Clear Location' : 'Near Me' }}
        </BaseButton>
      </div>

      <!-- Reset Button -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
        <BaseButton 
          @click="resetFilters"
          variant="outline"
          class="w-full"
        >
          <i class="fas fa-redo w-4 h-4 mr-2"></i>
          Reset Filters
        </BaseButton>
      </div>
    </div>

    <!-- Location Filter -->
    <div v-if="showLocationFilter" class="border-t pt-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
          <select 
            v-model="localFilters.maxDistance"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any Distance</option>
            <option value="1000">Within 1 km</option>
            <option value="5000">Within 5 km</option>
            <option value="10000">Within 10 km</option>
            <option value="25000">Within 25 km</option>
            <option value="50000">Within 50 km</option>
          </select>
        </div>
        
        <div class="md:col-span-2 flex items-end">
          <BaseButton 
            @click="getCurrentLocation"
            :loading="gettingLocation"
            variant="outline"
            size="sm"
            class="mr-2"
          >
            <i class="fas fa-crosshairs w-4 h-4 mr-2"></i>
            Use My Location
          </BaseButton>
          
          <p v-if="locationStatus" class="text-sm text-gray-600">
            {{ locationStatus }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onBeforeUnmount } from 'vue'
import BaseButton from '../buttons/BaseButton.vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:filters', 'reset'])

// Local copy of filters for v-model
const localFilters = reactive({ ...props.filters })

// Location state
const showLocationFilter = ref(false)
const gettingLocation = ref(false)
const locationStatus = ref('')

// Flag to prevent infinite loops
let isUpdatingFromProps = false
// Watch for changes and emit updates
watch(localFilters, (newFilters, oldFilters) => {
  if (isUpdatingFromProps) return
  
  // Calculate postedSince based on dateRange before emitting
  const filtersToEmit = { ...newFilters }
  if (filtersToEmit.dateRange) {
    const days = parseInt(filtersToEmit.dateRange)
    const date = new Date()
    date.setDate(date.getDate() - days)
    filtersToEmit.postedSince = date.toISOString().split('T')[0] // Use YYYY-MM-DD format
  } else {
    filtersToEmit.postedSince = null
  }
  
  // Emit immediately for all filter changes
  emit('update:filters', filtersToEmit)
}, { deep: true })

// Watch props.filters for external changes
watch(() => props.filters, (newFilters) => {
  isUpdatingFromProps = true
  Object.assign(localFilters, newFilters)
  nextTick(() => {
    isUpdatingFromProps = false
  })
}, { deep: true })

const toggleLocationFilter = () => {
  showLocationFilter.value = !showLocationFilter.value
  if (!showLocationFilter.value) {
    // Clear location filters when hiding
    localFilters.longitude = null
    localFilters.latitude = null
    localFilters.maxDistance = null
    locationStatus.value = ''
  }
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationStatus.value = 'Geolocation is not supported by this browser.'
    return
  }

  gettingLocation.value = true
  locationStatus.value = 'Getting your location...'

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      localFilters.latitude = position.coords.latitude
      localFilters.longitude = position.coords.longitude
      
      // Try to get readable address using free reverse geocoding
      try {
        locationStatus.value = 'Finding your address...'
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=16&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'PetFinder App'
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.display_name) {
            // Build more specific address
            const address = data.address || {}
            const parts = []
            
            // Add neighborhood/suburb/district (most specific)
            if (address.neighbourhood) parts.push(address.neighbourhood)
            else if (address.suburb) parts.push(address.suburb)
            else if (address.district) parts.push(address.district)
            else if (address.quarter) parts.push(address.quarter)
            
            // Add city/town
            if (address.city) parts.push(address.city)
            else if (address.town) parts.push(address.town)
            else if (address.village) parts.push(address.village)
            
            // Add state/region if available
            if (address.state) parts.push(address.state)
            
            if (parts.length >= 2) {
              locationStatus.value = `📍 ${parts.slice(0, 3).join(', ')}`
            } else if (parts.length === 1) {
              locationStatus.value = `📍 ${parts[0]}`
            } else {
              // Use first 3 parts of display name for more detail
              const detailedAddress = data.display_name.split(',').slice(0, 3).join(', ').trim()
              locationStatus.value = `📍 ${detailedAddress}`
            }
          } else {
            locationStatus.value = `📍 ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }
        } else {
          // Fallback to coordinates
          locationStatus.value = `📍 ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }
      } catch (error) {
        // Fallback to coordinates if reverse geocoding fails
        locationStatus.value = `📍 ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
      }
      
      gettingLocation.value = false
      
    },
    (error) => {
      console.error('Error getting location:', error)
      locationStatus.value = 'Failed to get location. Please try again.'
      gettingLocation.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  )
}

const resetFilters = () => {
  // Reset all filters (no status filter for public announcements)
  Object.assign(localFilters, {
    type: '',
    petType: '',
    longitude: null,
    latitude: null,
    maxDistance: null,
    postedSince: null,
    dateRange: ''
  })
  
  // Hide location filter
  showLocationFilter.value = false
  locationStatus.value = ''
  
  // Emit reset event
  emit('reset')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit Announcement' : 'Create Announcement' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.type"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select type</option>
            <option value="lost">Lost Pet</option>
            <option value="found">Found Pet</option>
          </select>
        </div>

        <!-- Pet Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pet Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.petName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter pet's name"
          />
        </div>

        <!-- Pet Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pet Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.petType"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select pet type</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>

        <!-- Pet Details Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Breed
            </label>
            <input
              v-model="formData.breed"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter breed"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              v-model="formData.color"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter color"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <select
              v-model="formData.age"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select age</option>
              <option value="puppy">Puppy</option>
              <option value="young">Young</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.description"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the pet (appearance, behavior, circumstances, etc.)"
          ></textarea>
        </div>

        <!-- Location -->
        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Address <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <input
              v-model="formData.locationName"
              type="text"
              required
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter street address and number (e.g. Bulevardul 1 decembrie 1918 nr 4)"
            />
            <button
              type="button"
              @click="getCurrentLocation"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
              :disabled="loadingLocation"
            >
              <i v-if="loadingLocation" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-map-marker-alt"></i>
              <span class="hidden sm:inline">{{ loadingLocation ? 'Loading...' : 'Current' }}</span>
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">Enter the street name and number. City and county will be filled separately below.</p>
        </div>        <!-- Location Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              City <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.locationDetails.city"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="cityValidation.error ? 'border-red-500' : 'border-gray-300'"
              placeholder="Enter city name (e.g., Suceava)"
              @blur="validateLocation"
              @input="debouncedGeocodeAddress"
            />
            <p v-if="cityValidation.error" class="text-red-500 text-xs mt-1">
              {{ cityValidation.message }}
            </p>
            <p v-if="cityValidation.suggestion" class="text-yellow-600 text-xs mt-1">
              {{ cityValidation.suggestion }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              State/County <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.locationDetails.state"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="countyValidation.error ? 'border-red-500' : 'border-gray-300'"
              placeholder="Enter county name (e.g., Suceava)"
              @blur="validateLocation"
              @input="debouncedGeocodeAddress"
            />
            <p v-if="countyValidation.error" class="text-red-500 text-xs mt-1">
              {{ countyValidation.message }}
            </p>
            <p v-if="countyValidation.suggestion" class="text-yellow-600 text-xs mt-1">
              {{ countyValidation.suggestion }}
            </p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.contactInfo.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                v-model="formData.contactInfo.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email address"
              />
            </div>
          </div>
          
        </div>

        <!-- Multi-Image Upload Component - Only show for creation, not editing -->
        <div v-if="!isEditing">
          <MultiImageUpload
            v-model="imageData"
            :max-images="5"
            @files-changed="handleImageChange"
            @error="handleImageError"
          />
        </div>
        
        <!-- Info message for editing -->
        <div v-else class="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div class="flex items-center">
            <i class="fas fa-info-circle text-blue-500 mr-2"></i>
            <p class="text-blue-700 text-sm">
              Image editing is not available in edit mode. Only text fields can be updated.
            </p>
          </div>
        </div>

        <!-- Last Seen Date (for lost pets) -->
        <div v-if="formData.type === 'lost'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date Last Seen
          </label>
          <div class="space-y-3">
            <!-- Quick options -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in quickDateOptions"
                :key="option.value"
                type="button"
                @click="setLastSeenDate(option.value)"
                class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                :class="{ 'bg-blue-100 text-blue-800': isDateSelected(option.value) }"
              >
                {{ option.label }}
              </button>
            </div>
            <!-- Custom date input -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">Or select a specific date:</label>
              <input
                v-model="formData.lastSeenDate"
                type="date"
                :max="today"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-red-600 text-sm">{{ submitError }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
          <BaseButton
            type="button"
            variant="outline"
            size="md"
            @click="closeModal"
            class="w-full sm:w-auto"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            size="md"
            :disabled="isSubmitting"
            class="w-full sm:w-auto"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }} Announcement
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import BaseButton from '../buttons/BaseButton.vue'
import MultiImageUpload from '../ui/MultiImageUpload.vue'
import { 
  processAnnouncementData, 
  createAnnouncementFormData, 
  createUpdateFormData,
  createUpdateJsonData,
  createAnnouncement, 
  updateAnnouncement,
  getImageUrl 
} from '@/services/announcementService'
import { 
  validateCityCountyPair, 
  isValidRomanianCity, 
  isValidRomanianCounty,
  getCountyForCity 
} from '@/utils/romaniaLocations'

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

const emit = defineEmits(['close', 'success'])

const isEditing = ref(false)
const isSubmitting = ref(false)
const loadingLocation = ref(false)
const submitError = ref('')
const imageData = ref([])

const maxImages = 5

// Date options for quick selection
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const quickDateOptions = computed(() => {
  const now = new Date()
  return [
    {
      label: 'Today',
      value: today.value
    },
    {
      label: 'Yesterday', 
      value: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      label: '3 days ago',
      value: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      label: '1 week ago',
      value: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  ]
})

const formData = reactive({
  type: '',
  petName: '',
  petType: '',
  breed: '',
  color: '',
  age: '',
  description: '',
  locationName: '',
  locationCoordinates: null, // Will store [longitude, latitude]
  locationDetails: {
    city: '',
    state: ''
  },
  contactInfo: {
    phone: '',
    email: ''
  },
  lastSeenDate: '',
  images: []
})

// Location validation state
const cityValidation = reactive({
  error: false,
  message: '',
  suggestion: ''
})

const countyValidation = reactive({
  error: false,
  message: '',
  suggestion: ''
})

// Functions - defined before watchers to avoid initialization issues
const setLastSeenDate = (dateValue) => {
  formData.lastSeenDate = dateValue
}

const isDateSelected = (dateValue) => {
  return formData.lastSeenDate === dateValue
}

const resetForm = () => {
  isEditing.value = false
  isSubmitting.value = false
  submitError.value = ''
  imageData.value = []
  
  Object.assign(formData, {
    type: '',
    petName: '',
    petType: '',
    breed: '',
    color: '',
    age: '',
    description: '',
    locationName: '',
    locationCoordinates: null,
    locationDetails: {
      city: '',
      state: ''
    },
    contactInfo: {
      phone: '',
      email: ''
    },
    lastSeenDate: '',
    images: [],
    // Reset geocoding tracking variables
    isGeocoding: false,
    lastGeocodedLocation: null
  })
}

// Watch for announcement prop changes (editing mode)
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement) {
    console.log('Populating form with announcement data:', newAnnouncement)
    isEditing.value = true
    
    // Process lastSeenDate - convert from ISO string to date input format
    let lastSeenDateValue = ''
    if (newAnnouncement.lastSeenDate) {
      try {
        const date = new Date(newAnnouncement.lastSeenDate)
        lastSeenDateValue = date.toISOString().split('T')[0] // YYYY-MM-DD format
      } catch (error) {
        console.warn('Invalid lastSeenDate:', newAnnouncement.lastSeenDate)
      }
    }
    
    // Process location coordinates
    let coordinates = null
    if (newAnnouncement.location?.coordinates) {
      coordinates = [
        newAnnouncement.location.coordinates.longitude || 0,
        newAnnouncement.location.coordinates.latitude || 0
      ]
    }
    
    Object.assign(formData, {
      type: newAnnouncement.type || '',
      petName: newAnnouncement.petName || '',
      petType: newAnnouncement.petType || '',
      breed: newAnnouncement.breed || '',
      color: newAnnouncement.color || '',
      age: newAnnouncement.age || '',
      description: newAnnouncement.description || '',
      locationName: newAnnouncement.locationName || newAnnouncement.location?.address || '',
      locationCoordinates: coordinates,
      locationDetails: {
        city: newAnnouncement.locationDetails?.city || newAnnouncement.location?.city || '',
        state: newAnnouncement.locationDetails?.state || newAnnouncement.location?.state || ''
      },
      contactInfo: {
        phone: newAnnouncement.contactInfo?.phone || '',
        email: newAnnouncement.contactInfo?.email || '',
        preferredContact: newAnnouncement.contactInfo?.preferredContact || 'phone'
      },
      lastSeenDate: lastSeenDateValue,
      images: newAnnouncement.images || []
    })
    
    console.log('Form data after population:', formData)
    
    // Load existing images for the upload component
    if (newAnnouncement.images && newAnnouncement.images.length > 0) {
      imageData.value = newAnnouncement.images.map(img => getImageUrl(img.url || img))
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

const closeModal = () => {
  emit('close')
}

// Image handling
const handleImageChange = (newImageData) => {
  imageData.value = newImageData
}

const handleImageError = (errorMessage) => {
  submitError.value = errorMessage
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.')
    return
  }

  loadingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        console.log('Location coordinates:', { latitude, longitude })
        
        // Use reverse geocoding to get human-readable address
        await reverseGeocode(latitude, longitude)
      } catch (error) {
        console.error('Error getting location:', error)
        // Fallback to coordinates if reverse geocoding fails
        formData.location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      } finally {
        loadingLocation.value = false
      }
    },
    (error) => {
      console.error('Error getting location:', error)
      alert('Unable to get your location. Please enter it manually.')
      loadingLocation.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000
    }
  )
}

const reverseGeocode = async (latitude, longitude) => {
  try {
    // Store coordinates for API (longitude, latitude object)
    formData.locationCoordinates = { longitude, latitude }
    
    // Try OpenStreetMap Nominatim API (free)
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }
    
    const data = await response.json()
    
    if (data && data.display_name) {
      // Format the address nicely
      const address = data.address || {}
      const parts = []
      
      if (address.house_number && address.road) {
        parts.push(`${address.road} ${address.house_number}`)
      } else if (address.road) {
        parts.push(address.road)
      }
      
      if (address.city || address.town || address.village) {
        parts.push(address.city || address.town || address.village)
      }
      
      if (address.county) {
        parts.push(address.county)
      }
      
      if (address.country) {
        parts.push(address.country)
      }
      
      // Use formatted address or fall back to display_name
      formData.locationName = parts.length > 0 ? parts.join(', ') : data.display_name
      
      // Populate detailed location fields  
      formData.locationDetails.city = address.city || address.town || address.village || ''
      formData.locationDetails.state = address.county || address.state || ''
      
      console.log('Formatted address:', formData.locationName)
      console.log('Location details:', formData.locationDetails)
    } else {
      throw new Error('No address found')
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    // Fallback to coordinates
    formData.locationName = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
  }
}

// Validate location fields (city and county)
const validateLocation = () => {
  // Reset validation state
  cityValidation.error = false
  cityValidation.message = ''
  cityValidation.suggestion = ''
  countyValidation.error = false
  countyValidation.message = ''
  countyValidation.suggestion = ''
  
  const city = formData.locationDetails.city.trim()
  const county = formData.locationDetails.state.trim()
  
  if (!city && !county) {
    return // Don't validate empty fields
  }
  
  if (city && !county) {
    // Only city provided - check if city exists and suggest county
    if (isValidRomanianCity(city)) {
      const suggestedCounty = getCountyForCity(city)
      if (suggestedCounty) {
        countyValidation.suggestion = `Suggestion: ${city} is in ${suggestedCounty} county`
      }
    } else {
      cityValidation.error = true
      cityValidation.message = `"${city}" is not a recognized Romanian city`
    }
    return
  }
  
  if (!city && county) {
    // Only county provided - check if county exists
    if (!isValidRomanianCounty(county)) {
      countyValidation.error = true
      countyValidation.message = `"${county}" is not a recognized Romanian county`
    }
    return
  }
  
  // Both city and county provided - validate pair
  if (city && county) {
    const validation = validateCityCountyPair(city, county)
    
    if (!validation.cityExists) {
      cityValidation.error = true
      cityValidation.message = `"${city}" is not a recognized Romanian city`
    }
    
    if (!validation.countyExists) {
      countyValidation.error = true
      countyValidation.message = `"${county}" is not a recognized Romanian county`
    }
    
    if (validation.cityExists && validation.countyExists && !validation.isValid) {
      countyValidation.error = true
      countyValidation.message = validation.message
      if (validation.suggestedCounty) {
        countyValidation.suggestion = `Correct county: ${validation.suggestedCounty}`
      }
    }
    
    // Auto-correct if we have a valid city and empty/wrong county
    if (validation.cityExists && validation.suggestedCounty && (!county || !validation.countyExists)) {
      formData.locationDetails.state = validation.suggestedCounty
      countyValidation.suggestion = `Auto-corrected to: ${validation.suggestedCounty}`
    }
    
    // Trigger geocoding if both city and county are valid
    if (validation.cityExists && validation.countyExists && validation.isValid) {
      // Only trigger if we don't already have coordinates for this exact location
      const currentLocationKey = `${formData.locationDetails.city}-${formData.locationDetails.state}-${formData.locationName || ''}`
      
      if (!formData.locationCoordinates || formData.lastGeocodedLocation !== currentLocationKey) {
        setTimeout(() => {
          geocodeAddress()
        }, 100) // Small delay to ensure UI updates first
      }
    }
  }
}

// Debounced geocoding for real-time address updates
let geocodeTimeout = null
const debouncedGeocodeAddress = () => {
  if (geocodeTimeout) {
    clearTimeout(geocodeTimeout)
  }
  geocodeTimeout = setTimeout(() => {
    // Trigger geocoding if we have city and state (address is optional)
    if (formData.locationDetails.city && formData.locationDetails.state) {
      const currentLocationKey = `${formData.locationDetails.city}-${formData.locationDetails.state}-${formData.locationName || ''}`
      
      // Only geocode if location changed
      if (formData.lastGeocodedLocation !== currentLocationKey) {
        geocodeAddress()
      }
    }
  }, 1000) // Wait 1 second after user stops typing
}

// Enhanced geocoding with OpenStreetMap
const geocodeAddress = async () => {
  // Only geocode if we have at least city and state
  if (!formData.locationDetails.city || !formData.locationDetails.state) {
    return
  }
  
  // Check if we're already in the process of geocoding to prevent loops
  if (formData.isGeocoding) {
    return
  }
  
  // Create location key to track if we already geocoded this exact location
  const currentLocationKey = `${formData.locationDetails.city}-${formData.locationDetails.state}-${formData.locationName || ''}`
  if (formData.lastGeocodedLocation === currentLocationKey && formData.locationCoordinates) {
    return
  }
  
  formData.isGeocoding = true
  
  try {
    // Try multiple query strategies for better results
    let coordinates = await tryOpenStreetMapGeocoding()
    
    if (coordinates) {
      formData.locationCoordinates = coordinates
      formData.lastGeocodedLocation = currentLocationKey
      console.log('Geocoding successful:', {
        coordinates: formData.locationCoordinates,
        source: coordinates.source,
        accuracy: coordinates.accuracy
      })
      
      // Update the main location name if not already set
      if (!formData.locationName) {
        const addressParts = []
        if (formData.locationDetails.city) addressParts.push(formData.locationDetails.city)
        if (formData.locationDetails.state) addressParts.push(formData.locationDetails.state)
        formData.locationName = addressParts.join(', ')
      }
    } else {
      // Try one final fallback - get coordinates for just the city if available
      console.log('Primary geocoding failed, trying enhanced city-only fallback')
      let fallbackCoordinates = null
      
      if (formData.locationDetails.city) {
        try {
          // Use structured search for better city matching
          const fallbackParams = new URLSearchParams({
            format: 'json',
            city: formData.locationDetails.city,
            country: 'Romania',
            countrycodes: 'ro',
            limit: '3',
            featureType: 'settlement',
            addressdetails: '1'
          })
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${fallbackParams}`,
            {
              headers: {
                'User-Agent': 'PetFinder-App/1.0 (Contact: your-email@domain.com)'
              }
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data && data.length > 0) {
              // Find the best city match - prefer administrative places
              const cityResult = data.find(result => 
                result.class === 'place' && (
                  result.type === 'city' || 
                  result.type === 'town' || 
                  result.type === 'village' ||
                  result.type === 'municipality'
                )
              ) || data[0]
              
              fallbackCoordinates = {
                longitude: parseFloat(cityResult.lon),
                latitude: parseFloat(cityResult.lat)
              }
              console.log(`Enhanced fallback successful for city: ${formData.locationDetails.city}`, {
                coordinates: fallbackCoordinates,
                display_name: cityResult.display_name,
                type: cityResult.type
              })
            }
          }
        } catch (error) {
          console.log('Enhanced city fallback also failed:', error.message)
        }
      }
      
      if (fallbackCoordinates) {
        formData.locationCoordinates = fallbackCoordinates
      } else {
        // Final fallback to Romania center
        console.log('All geocoding attempts failed, using Romania center')
        formData.locationCoordinates = { longitude: 24.9668, latitude: 45.9432 } // Romania center
      }
      
      formData.lastGeocodedLocation = currentLocationKey
    }
    
  } catch (error) {
    console.error('Geocoding failed:', error)
    formData.locationCoordinates = { longitude: 24.9668, latitude: 45.9432 } // Romania center
    formData.lastGeocodedLocation = currentLocationKey
  } finally {
    formData.isGeocoding = false
  }
}

// Enhanced OpenStreetMap geocoding with simple rate limiting
let lastOpenStreetMapCall = 0
const OPENSTREETMAP_RATE_LIMIT = 2000 // 2 seconds between calls for better reliability

const tryOpenStreetMapGeocoding = async () => {
  try {
    // Simple rate limiting to avoid API issues
    const now = Date.now()
    if (now - lastOpenStreetMapCall < OPENSTREETMAP_RATE_LIMIT) {
      const waitTime = OPENSTREETMAP_RATE_LIMIT - (now - lastOpenStreetMapCall)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    lastOpenStreetMapCall = Date.now()
    
    // Create queries in order of preference using best practices from Nominatim docs
    const queries = []
    
    // 1. Try structured search first (more reliable for addresses)
    if (formData.locationName && formData.locationDetails.city && formData.locationDetails.state) {
      // Use structured query parameters for better accuracy
      const structuredParams = new URLSearchParams({
        format: 'json',
        street: formData.locationName,
        city: formData.locationDetails.city,
        state: formData.locationDetails.state,
        country: 'Romania',
        countrycodes: 'ro',
        limit: '5',
        addressdetails: '1'
      })
      queries.push({ 
        url: `https://nominatim.openstreetmap.org/search?${structuredParams}`,
        type: 'structured',
        description: `Structured: ${formData.locationName}, ${formData.locationDetails.city}, ${formData.locationDetails.state}`
      })
    }
    
    // 2. Try full address as free-form query
    if (formData.locationName && formData.locationDetails.city && formData.locationDetails.state) {
      const freeFormQuery = `${formData.locationName}, ${formData.locationDetails.city}, ${formData.locationDetails.state}, Romania`
      const encodedQuery = encodeURIComponent(freeFormQuery)
      queries.push({ 
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=ro&limit=5&addressdetails=1`,
        type: 'free-form',
        description: freeFormQuery
      })
    }
    
    // 3. Try street name without number in city
    if (formData.locationName && formData.locationDetails.city) {
      const streetName = formData.locationName.replace(/\s+(nr\.?\s*)?\d+\s*$/, '').trim()
      if (streetName && streetName !== formData.locationName) {
        const streetQuery = `${streetName}, ${formData.locationDetails.city}, Romania`
        const encodedQuery = encodeURIComponent(streetQuery)
        queries.push({ 
          url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=ro&limit=5&layer=address`,
          type: 'street',
          description: streetQuery
        })
      }
    }
    
    // 4. City with county - use featureType for better city results
    if (formData.locationDetails.city && formData.locationDetails.state) {
      const cityQuery = `${formData.locationDetails.city}, ${formData.locationDetails.state}, Romania`
      const encodedQuery = encodeURIComponent(cityQuery)
      queries.push({ 
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=ro&limit=5&featureType=city&addressdetails=1`,
        type: 'city-county',
        description: cityQuery
      })
    }
    
    // 5. Just city with settlement feature type
    if (formData.locationDetails.city) {
      const cityOnlyQuery = `${formData.locationDetails.city}, Romania`
      const encodedQuery = encodeURIComponent(cityOnlyQuery)
      queries.push({ 
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=ro&limit=5&featureType=settlement&addressdetails=1`,
        type: 'city-only',
        description: cityOnlyQuery
      })
    }
    
    console.log('Trying geocoding queries:', queries.map(q => `${q.type}: ${q.description}`))
    
    // Try each query
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      try {
        const response = await fetch(query.url, {
          headers: {
            'User-Agent': 'PetFinder-App/1.0 (Contact: your-email@domain.com)' // Recommended by Nominatim docs
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data && data.length > 0) {
            let bestResult = data[0]
            
            // For city-level queries, prefer administrative places
            if (query.type.includes('city')) {
              const adminResults = data.filter(result => 
                result.class === 'place' && (
                  result.type === 'city' || 
                  result.type === 'town' || 
                  result.type === 'village' ||
                  result.type === 'municipality'
                )
              )
              if (adminResults.length > 0) {
                // Sort by importance and pick the best
                bestResult = adminResults.sort((a, b) => (b.importance || 0) - (a.importance || 0))[0]
              }
            }
            
            // For street queries, prefer roads or addresses
            if (query.type === 'street' || query.type === 'structured') {
              const addressResults = data.filter(result => 
                result.class === 'highway' || 
                result.class === 'place' ||
                result.type === 'road' ||
                result.type === 'residential'
              )
              if (addressResults.length > 0) {
                bestResult = addressResults[0]
              }
            }
            
            console.log(`Geocoding successful with ${query.type} query: "${query.description}"`, {
              result: bestResult,
              coordinates: { lon: bestResult.lon, lat: bestResult.lat },
              display_name: bestResult.display_name,
              importance: bestResult.importance
            })
            
            return {
              longitude: parseFloat(bestResult.lon),
              latitude: parseFloat(bestResult.lat),
              source: 'OpenStreetMap',
              accuracy: query.type === 'structured' ? 'address' : 
                       query.type === 'free-form' ? 'address' :
                       query.type === 'street' ? 'street' : 'city',
              display_name: bestResult.display_name,
              query_type: query.type
            }
          }
        } else {
          console.log(`Query ${i + 1} failed with status:`, response.status)
        }
      } catch (error) {
        console.log(`Query ${i + 1} failed:`, error.message)
        continue
      }
    }
    
    console.log('All geocoding queries failed')
    return null
    
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Form submission using new modular approach
const handleSubmit = async () => {
  console.log('handleSubmit called with formData:', formData)
  console.log('imageData:', imageData.value)
  
  isSubmitting.value = true
  submitError.value = ''

  try {
    // Ensure we have coordinates before processing
    if (!formData.locationCoordinates && formData.locationDetails?.city) {
      console.log('No coordinates found, attempting geocoding before submission...')
      await geocodeAddress()
    }
    
    // If still no coordinates after geocoding attempt, ensure fallback
    if (!formData.locationCoordinates) {
      console.log('Setting fallback coordinates before submission')
      formData.locationCoordinates = { longitude: 24.9668, latitude: 45.9432 } // Romania center
    }
    
    console.log('Final coordinates before processing:', formData.locationCoordinates)
    
    // Process the form data
    const processedData = processAnnouncementData(formData)
    console.log('processedData:', processedData)
    
    let response
    if (isEditing.value && props.announcement) {
      // For updates, use JSON instead of FormData since we're not editing images
      const updateData = createUpdateJsonData(processedData)
      console.log('Update JSON data:', updateData)
      console.log('Update JSON data stringified:', JSON.stringify(updateData, null, 2))
      console.log('Type of updateData:', typeof updateData)
      
      response = await updateAnnouncement(props.announcement.announcementId || props.announcement.id, updateData)
    } else {
      // For creation, use FormData with images
      const submissionFormData = createAnnouncementFormData(
        processedData, 
        imageData.value || [], 
        [] // Existing images - nu sunt files noi în acest caz
      )
      
      // Debug: Log FormData contents
      console.log('FormData contents:')
      for (let [key, value] of submissionFormData.entries()) {
        console.log(key, value)
      }
      
      response = await createAnnouncement(submissionFormData)
    }
    
    console.log('Announcement operation successful:', response)
    
    emit('success', response.announcement || response)
    emit('close')
    
  } catch (error) {
    console.error('Error submitting form:', error)
    submitError.value = error.message || 'Failed to submit announcement. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Any initialization logic can go here
})
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
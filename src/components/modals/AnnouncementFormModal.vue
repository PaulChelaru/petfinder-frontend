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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Location <span class="text-red-500">*</span>
          </label>
          <div class="flex space-x-2">
            <input
              v-model="formData.locationName"
              type="text"
              required
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter address (street, city, county) or use current location"
            />
            <button
              type="button"
              @click="getCurrentLocation"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              :disabled="loadingLocation"
            >
              <i v-if="loadingLocation" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-map-marker-alt"></i>
              <span class="hidden sm:inline">{{ loadingLocation ? 'Loading...' : 'Current' }}</span>
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">Enter a full address or click "Current" to use your location automatically</p>
        </div>

        <!-- Location Details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Address/Street
            </label>
            <input
              v-model="formData.locationDetails.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Street address"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              v-model="formData.locationDetails.city"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="City"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              State/County
            </label>
            <input
              v-model="formData.locationDetails.state"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="State or County"
            />
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

        <!-- Multi-Image Upload Component -->
        <MultiImageUpload
          v-model="imageData"
          :max-images="5"
          @files-changed="handleImageChange"
          @error="handleImageError"
        />                <!-- Error Display -->
        <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-red-600 text-sm">{{ submitError }}</p>
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
                v-for="option in dateOptions"
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
  createAnnouncement, 
  updateAnnouncement,
  getImageUrl 
} from '@/services/announcementService'

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
const imageData = ref({ files: [], urls: [], total: 0 })

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
    state: '',
    address: ''
  },
  contactInfo: {
    phone: '',
    email: ''
  },
  lastSeenDate: '',
  images: []
})

// Functions - defined before watchers to avoid initialization issues
const resetForm = () => {
  isEditing.value = false
  isSubmitting.value = false
  submitError.value = ''
  imageData.value = { files: [], urls: [], total: 0 }
  
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
      state: '',
      address: ''
    },
    contactInfo: {
      phone: '',
      email: ''
    },
    lastSeenDate: '',
    images: []
  })
}

// Watch for announcement prop changes (editing mode)
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement) {
    isEditing.value = true
    Object.assign(formData, {
      type: newAnnouncement.type || '',
      petName: newAnnouncement.petName || '',
      petType: newAnnouncement.petType || '',
      breed: newAnnouncement.breed || '',
      color: newAnnouncement.color || '',
      age: newAnnouncement.age || '',
      description: newAnnouncement.description || '',
      locationName: newAnnouncement.locationName || '',
      locationCoordinates: newAnnouncement.location?.coordinates || null,
      locationDetails: {
        city: newAnnouncement.locationDetails?.city || '',
        state: newAnnouncement.locationDetails?.state || '',
        address: newAnnouncement.locationDetails?.address || ''
      },
      contactInfo: {
        phone: newAnnouncement.contactInfo?.phone || '',
        email: newAnnouncement.contactInfo?.email || ''
      },
      lastSeenDate: newAnnouncement.lastSeenDate || '',
      images: newAnnouncement.images || []
    })
    
    // Load existing images for the upload component
    if (newAnnouncement.images && newAnnouncement.images.length > 0) {
      imageData.value = {
        files: [],
        urls: newAnnouncement.images.map(img => getImageUrl(img.url || img)),
        total: newAnnouncement.images.length
      }
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
    // Store coordinates for API (longitude first, then latitude)
    formData.locationCoordinates = [longitude, latitude]
    
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
      formData.locationDetails.address = address.road && address.house_number ? 
        `${address.road} ${address.house_number}` : (address.road || '')
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

// Form submission using new modular approach
const handleSubmit = async () => {
  console.log('handleSubmit called with formData:', formData)
  console.log('imageData:', imageData.value)
  
  isSubmitting.value = true
  submitError.value = ''

  try {
    // Process the form data
    const processedData = processAnnouncementData(formData)
    console.log('processedData:', processedData)
    
    // Create FormData with images
    const submissionFormData = createAnnouncementFormData(
      processedData, 
      imageData.value.files || [], 
      imageData.value.urls || []
    )
    
    // Debug: Log FormData contents
    console.log('FormData contents:')
    for (let [key, value] of submissionFormData.entries()) {
      console.log(key, value)
    }
    
    let response
    if (isEditing.value && props.announcement) {
      response = await updateAnnouncement(props.announcement.id, submissionFormData)
    } else {
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
  console.log('AnnouncementFormModal mounted')
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
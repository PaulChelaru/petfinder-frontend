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

        <!-- Image Upload -->
        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pet Photos (Max {{ maxImages }})
          </label>
          
          <!-- File Upload -->
          <div class="flex flex-col space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                @change="handleFileUpload"
                class="hidden"
              />
              <div class="space-y-2">
                <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                <div>
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Upload photos
                  </button>
                  <p class="text-gray-500 text-sm">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-400">JPEG, PNG, WebP up to 10MB each</p>
              </div>
            </div>
            
            <!-- URL Input -->
            <div class="flex space-x-2">
              <input
                v-model="urlInput"
                type="url"
                placeholder="Or add image URL"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                @keypress.enter.prevent="handleUrlAdd"
              />
              <button
                type="button"
                @click="handleUrlAdd"
                :disabled="!urlInput.trim()"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add URL
              </button>
            </div>
          </div>
          
          <!-- Image Counter -->
          <div class="mt-2 text-sm text-gray-600">
            {{ previewImages.length }} / {{ maxImages }} images
          </div>
          
          <!-- Image Preview -->
          <div v-if="previewImages.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="(image, index) in previewImages"
              :key="image.id"
              class="relative group"
            >
              <img
                :src="image.src"
                :alt="image.name"
                class="w-full h-24 object-cover rounded-lg border border-gray-200"
                @error="(e) => { e.target.src = '/placeholder-image.png'; e.target.onerror = null; }"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <!-- Type indicator -->
              <div class="absolute top-1 left-1 px-1 py-0.5 bg-black bg-opacity-60 text-white text-xs rounded">
                {{ image.type === 'file' ? 'FILE' : 'URL' }}
              </div>
              <!-- Image name -->
              <div class="absolute bottom-1 left-1 right-1 px-1 py-0.5 bg-black bg-opacity-60 text-white text-xs rounded truncate">
                {{ image.name }}
              </div>
            </div>
          </div>
        </div>        <!-- Date Last Seen (for lost pets) -->
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
import { announcementApi } from '@/api/announcements'

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
const previewImages = ref([])
const fileInput = ref(null)
const urlInput = ref('')
const selectedFiles = ref([])
const imageUrls = ref([])

const maxImages = 5

// Date options for quick selection
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const dateOptions = computed(() => {
  const now = new Date()
  return [
    {
      label: 'Today',
      value: new Date(now).toISOString().split('T')[0]
    },
    {
      label: 'Yesterday',
      value: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      label: '2 days ago',
      value: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      label: '3 days ago',
      value: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      label: '1 week ago',
      value: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      label: '2 weeks ago',
      value: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
  previewImages.value = []
  selectedFiles.value = []
  imageUrls.value = []
  urlInput.value = ''
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
    
    // Load existing images for preview
    if (newAnnouncement.images) {
      previewImages.value = [...newAnnouncement.images]
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

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  
  // Validate files
  const validFiles = files.filter(file => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!validTypes.includes(file.type)) {
      alert(`${file.name}: Invalid file type. Only JPEG, PNG, WebP are allowed.`)
      return false
    }
    
    if (file.size > maxSize) {
      alert(`${file.name}: File too large. Maximum 10MB allowed.`)
      return false
    }
    
    return true
  })
  
  // Check total image limit
  if (previewImages.value.length + validFiles.length > maxImages) {
    alert(`Maximum ${maxImages} images allowed total.`)
    return
  }
  
  // Add to selectedFiles array
  selectedFiles.value.push(...validFiles)
  
  // Generate previews
  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push({
        id: Date.now() + Math.random(),
        src: e.target.result,
        name: file.name,
        type: 'file',
        file: file
      })
    }
    reader.readAsDataURL(file)
  })

  // Clear the input
  event.target.value = ''
}

const handleUrlAdd = () => {
  const url = urlInput.value.trim()
  
  if (!url) return
  
  // Basic URL validation
  try {
    new URL(url)
  } catch {
    alert('Please enter a valid URL')
    return
  }
  
  // Check total image limit
  if (previewImages.value.length >= maxImages) {
    alert(`Maximum ${maxImages} images allowed total.`)
    return
  }
  
  // Check if URL already exists
  if (imageUrls.value.includes(url)) {
    alert('This URL is already added')
    return
  }
  
  imageUrls.value.push(url)
  previewImages.value.push({
    id: Date.now(),
    src: url,
    name: 'URL Image',
    type: 'url',
    url: url
  })
  
  urlInput.value = ''
}

const removeImage = (index) => {
  const imageToRemove = previewImages.value[index]
  
  if (imageToRemove.type === 'file') {
    // Remove from selectedFiles
    const fileIndex = selectedFiles.value.findIndex(file => file === imageToRemove.file)
    if (fileIndex > -1) {
      selectedFiles.value.splice(fileIndex, 1)
    }
  } else if (imageToRemove.type === 'url') {
    // Remove from imageUrls
    const urlIndex = imageUrls.value.findIndex(url => url === imageToRemove.url)
    if (urlIndex > -1) {
      imageUrls.value.splice(urlIndex, 1)
    }
  }
  
  // Remove from preview
  previewImages.value.splice(index, 1)
}

// Date selection functions
const setLastSeenDate = (date) => {
  formData.lastSeenDate = date
}

const isDateSelected = (date) => {
  return formData.lastSeenDate === date
}

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const handleSubmit = async () => {
  console.log('handleSubmit called with formData:', formData)
  isSubmitting.value = true

  try {
    // Create FormData for multipart upload
    const submissionFormData = new FormData()
    
    // Debug: log all data being sent
    console.log('Form data being prepared:', {
      type: formData.type,
      petName: formData.petName,
      petType: formData.petType,
      selectedFiles: selectedFiles.value.length,
      imageUrls: imageUrls.value.length
    })
    
    // Add all form fields
    submissionFormData.append('type', formData.type)
    submissionFormData.append('petName', formData.petName)
    submissionFormData.append('petType', formData.petType)
    submissionFormData.append('description', formData.description)
    
    // Add location as JSON string
    const locationData = {
      address: formData.locationName || formData.locationDetails.address || '',
      coordinates: {
        latitude: formData.locationCoordinates ? formData.locationCoordinates[1] : 0,
        longitude: formData.locationCoordinates ? formData.locationCoordinates[0] : 0
      }
    }
    submissionFormData.append('location', JSON.stringify(locationData))
    
    // Add contact info as JSON string
    const contactData = {
      phone: formData.contactInfo.phone || '',
      email: formData.contactInfo.email || '',
      preferredContact: formData.contactInfo.preferredContact || 'both'
    }
    submissionFormData.append('contactInfo', JSON.stringify(contactData))
    
    // Add lastSeenDate
    if (formData.lastSeenDate) {
      console.log('Adding lastSeenDate:', formData.lastSeenDate)
      submissionFormData.append('lastSeenDate', new Date(formData.lastSeenDate + 'T12:00:00.000Z').toISOString())
    } else {
      console.log('No lastSeenDate provided, type is:', formData.type)
    }
    
    // Add other optional fields
    if (formData.breed) submissionFormData.append('breed', formData.breed)
    if (formData.color) submissionFormData.append('color', formData.color)
    if (formData.age) submissionFormData.append('age', formData.age)
    
    // Add URL images as JSON array
    if (imageUrls.value.length > 0) {
      submissionFormData.append('images', JSON.stringify(imageUrls.value))
    }
    
    // Add file uploads
    selectedFiles.value.forEach(file => {
      submissionFormData.append('images', file)
    })

    // Submit using FormData (no JSON Content-Type header)
    const response = await fetch('http://127.0.0.1:3003/v1/announcements', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('auth_token')}`
        // Don't set Content-Type - let browser set it for FormData
      },
      body: submissionFormData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create announcement')
    }
    
    const result = await response.json()
    console.log('Announcement created:', result)
    
    emit('success', result.announcement)
    emit('close')
    
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to submit announcement. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Auto-fill contact info from user store if available
  // TODO: Get user info from auth store
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
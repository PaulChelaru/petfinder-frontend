<template>
  <BaseModal
    :is-visible="true"
    :title="announcement ? 'Edit Announcement' : 'Create New Announcement'"
    size="lg"
    @close="$emit('close')"
  >
    <!-- Form Content -->
    <form @submit.prevent="handleSubmit">
      <FormGroup>
        <!-- Type and Pet Type -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            v-model="formData.type"
            label="Announcement Type"
            :required="!announcement"
            :options="typeOptions"
            :error="!!fieldErrors.type"
            :error-message="fieldErrors.type"
            placeholder="Select type"
          />

          <FormSelect
            v-model="formData.petType"
            label="Pet Type"
            :required="!announcement"
            :options="petTypeOptions"
            :error="!!fieldErrors.petType"
            :error-message="fieldErrors.petType"
            placeholder="Select pet type"
          />
        </div>

        <!-- Pet Name -->
        <FormField
          v-model="formData.petName"
          label="Pet Name"
          :required="!announcement"
          :error="!!fieldErrors.petName"
          :error-message="fieldErrors.petName"
          placeholder="Enter pet name"
          help-text="The name your pet responds to"
        />

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description <span v-if="!announcement" class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.description"
            :required="!announcement"
            rows="4"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
              fieldErrors.description 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            ]"
            placeholder="Describe the pet or circumstances..."
          ></textarea>
          <p v-if="fieldErrors.description" class="text-red-500 text-sm mt-1">{{ fieldErrors.description }}</p>
          <p class="text-gray-500 text-sm mt-1">Provide as much detail as possible to help with identification</p>
        </div>

        <!-- Last Seen Date (for lost pets) -->
        <div v-if="formData.type === 'lost'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Last Seen Date
          </label>
          <div class="grid grid-cols-2 gap-4">
            <FormSelect
              v-model="formData.lastSeenOption"
              :options="lastSeenOptions"
              placeholder="Select timeframe"
              @update:modelValue="handleLastSeenOptionChange"
            />
            <FormField
              v-model="formData.lastSeenDate"
              type="date"
              :max="maxDate"
              :error="!!fieldErrors.lastSeenDate"
              :error-message="fieldErrors.lastSeenDate"
              placeholder="Specific date"
            />
          </div>
          <p class="text-gray-500 text-sm mt-1">When did you last see your pet?</p>
        </div>

        <!-- Found Date (for found pets) -->
        <div v-if="formData.type === 'found'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Found Date
          </label>
          <div class="grid grid-cols-2 gap-4">
            <FormSelect
              v-model="formData.lastSeenOption"
              :options="foundDateOptions"
              placeholder="Select timeframe"
              @update:modelValue="handleLastSeenOptionChange"
            />
            <FormField
              v-model="formData.lastSeenDate"
              type="date"
              :max="maxDate"
              :error="!!fieldErrors.lastSeenDate"
              :error-message="fieldErrors.lastSeenDate"
              placeholder="Specific date"
            />
          </div>
          <p class="text-gray-500 text-sm mt-1">When did you find this pet?</p>
        </div>

        <!-- Location with 3 separate fields -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Location <span v-if="!announcement" class="text-red-500">*</span>
          </label>
          
          <FormField
            v-model="formData.locationStreet"
            :error="!!fieldErrors.locationStreet"
            :error-message="fieldErrors.locationStreet"
            placeholder="Street address (optional)"
            class="mb-2"
          />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              v-model="formData.locationCity"
              :required="!announcement"
              :error="!!fieldErrors.locationCity"
              :error-message="fieldErrors.locationCity"
              placeholder="City"
            />
            <FormField
              v-model="formData.locationState"
              :required="!announcement"
              :error="!!fieldErrors.locationState"
              :error-message="fieldErrors.locationState"
              placeholder="State/Region"
            />
          </div>
          
          <div class="flex items-center gap-2 mt-2">
            <ActionButton
              type="button"
              @click="getCurrentLocationForForm"
              :loading="gettingLocationForForm"
              variant="outline"
              size="sm"
              icon="location"
            >
              {{ gettingLocationForForm ? 'Getting...' : 'Use Current Location' }}
            </ActionButton>
            <p v-if="locationStatusForForm" class="text-sm text-gray-600">{{ locationStatusForForm }}</p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <FormField
            v-model="formData.contactPhone"
            label="Phone Number"
            type="tel"
            :error="!!fieldErrors.contactPhone"
            :error-message="fieldErrors.contactPhone"
            placeholder="Enter your phone number"
            help-text="Primary contact method for inquiries"
          />

          <FormField
            v-model="formData.contactEmail"
            label="Email Address"
            type="email"
            :error="!!fieldErrors.contactEmail"
            :error-message="fieldErrors.contactEmail"
            placeholder="Enter your email address"
            help-text="Alternative contact method"
          />
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pet Photos
          </label>
          <FileUpload
            :multiple="true"
            accept="image/*"
            @files-selected="handleFilesSelected"
            button-text="Choose Photos"
            help-text="or drag and drop images here"
          />
          
          <!-- Display selected images -->
          <div v-if="selectedFiles.length > 0" class="mt-4">
            <p class="text-sm text-gray-600 mb-2">Selected files: {{ selectedFiles.length }}</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="relative group"
              >
                <img 
                  :src="getImagePreview(file)" 
                  :alt="`Preview ${index + 1}`"
                  class="w-full h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Display existing images (for edit mode) -->
          <div v-if="formData.images && formData.images.length > 0" class="mt-4">
            <p class="text-sm text-gray-600 mb-2">Current images:</p>
            <ImageGallery :images="formData.images" :editable="true" @remove-image="removeExistingImage" />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </FormGroup>
    </form>

    <!-- Footer Actions -->
    <template #footer>
      <ActionButton
        variant="secondary"
        @click="$emit('close')"
        :disabled="loading"
      >
        Cancel
      </ActionButton>
      
      <ActionButton
        variant="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ announcement ? 'Update Announcement' : 'Create Announcement' }}
      </ActionButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted } from 'vue'
import BaseModal from './BaseModal.vue'
import FormGroup from '../forms/FormGroup.vue'
import FormField from '../forms/FormField.vue'
import FormSelect from '../forms/FormSelect.vue'
import FileUpload from '../forms/FileUpload.vue'
import ImageGallery from '../ui/ImageGallery.vue'
import ActionButton from '../buttons/ActionButton.vue'
import { announcementApi } from '@/api/announcements'

const props = defineProps({
  announcement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

// Reactive data
const loading = ref(false)
const error = ref('')
const fieldErrors = ref({})
const selectedFiles = ref([])
const gettingLocationForForm = ref(false)
const locationStatusForForm = ref('')

// Form data
const formData = reactive({
  type: '',
  petType: '',
  petName: '',
  description: '',
  lastSeenDate: '',
  lastSeenOption: '',
  locationStreet: '',
  locationCity: '',
  locationState: '',
  contactPhone: '',
  contactEmail: '',
  images: []
})

// Options for selects
const typeOptions = [
  { value: 'lost', label: 'Lost Pet' },
  { value: 'found', label: 'Found Pet' }
]

const petTypeOptions = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' }
]

const lastSeenOptions = [
  { value: '', label: 'Select timeframe' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '2-days', label: '2 days ago' },
  { value: '3-days', label: '3 days ago' },
  { value: 'week', label: 'About a week ago' },
  { value: 'month', label: 'About a month ago' },
  { value: 'custom', label: 'Custom date' }
]

const foundDateOptions = [
  { value: '', label: 'Select timeframe' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '2-days', label: '2 days ago' },
  { value: '3-days', label: '3 days ago' },
  { value: 'week', label: 'About a week ago' },
  { value: 'custom', label: 'Custom date' }
]

// Computed
const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Initialize form data
if (props.announcement) {
  // Parse location if it exists
  let locationParts = { city: '', state: '', street: '' }
  
  // Handle different location formats
  let locationString = ''
  if (props.announcement.locationName) {
    // Use locationName if available (this is usually a string)
    locationString = props.announcement.locationName
  } else if (props.announcement.location && typeof props.announcement.location === 'string') {
    // Use location if it's a string
    locationString = props.announcement.location
  }
  
  // Only split if we have a valid string
  if (locationString && typeof locationString === 'string') {
    const parts = locationString.split(',').map(part => part.trim())
    
    if (parts.length >= 3) {
      locationParts.street = parts[0]
      locationParts.city = parts[1]
      locationParts.state = parts[2]
    } else if (parts.length === 2) {
      locationParts.city = parts[0]
      locationParts.state = parts[1]
    } else if (parts.length === 1) {
      locationParts.city = parts[0]
    }
  }
  
  // Check if locationDetails object exists (new format)
  if (props.announcement.locationDetails) {
    locationParts.city = props.announcement.locationDetails.city || locationParts.city
    locationParts.state = props.announcement.locationDetails.state || locationParts.state
    locationParts.street = props.announcement.locationDetails.address || props.announcement.locationDetails.street || locationParts.street
  }
  
  Object.assign(formData, {
    type: props.announcement.type || '',
    petType: props.announcement.petType || '',
    petName: props.announcement.petName || '',
    description: props.announcement.description || '',
    lastSeenDate: props.announcement.lastSeenDate ? 
      new Date(props.announcement.lastSeenDate).toISOString().split('T')[0] : '',
    lastSeenOption: '', // Reset for editing
    locationStreet: locationParts.street,
    locationCity: locationParts.city,
    locationState: locationParts.state,
    contactPhone: props.announcement.contactPhone || props.announcement.contactInfo?.phone || '',
    contactEmail: props.announcement.contactEmail || props.announcement.contactInfo?.email || '',
    images: props.announcement.images || []
  })
}

// Methods
const handleFilesSelected = (files) => {
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const removeExistingImage = (index) => {
  formData.images.splice(index, 1)
}

const getImagePreview = (file) => {
  return URL.createObjectURL(file)
}

const handleLastSeenOptionChange = (option) => {
  if (option && option !== 'custom') {
    const today = new Date()
    let targetDate = new Date()
    
    switch (option) {
      case 'today':
        targetDate = today
        break
      case 'yesterday':
        targetDate.setDate(today.getDate() - 1)
        break
      case '2-days':
        targetDate.setDate(today.getDate() - 2)
        break
      case '3-days':
        targetDate.setDate(today.getDate() - 3)
        break
      case 'week':
        targetDate.setDate(today.getDate() - 7)
        break
      case 'month':
        targetDate.setMonth(today.getMonth() - 1)
        break
    }
    
    formData.lastSeenDate = targetDate.toISOString().split('T')[0]
  }
}

const getCurrentLocationForForm = () => {
  if (!navigator.geolocation) {
    locationStatusForForm.value = 'Geolocation is not supported by this browser.'
    return
  }
  
  gettingLocationForForm.value = true
  locationStatusForForm.value = 'Getting precise location...'
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        console.log('Got high-precision position:', position.coords)
        console.log('Accuracy:', position.coords.accuracy, 'meters')
        
        // Store coordinates for precision tracking
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        // Try multiple geocoding services in parallel for best precision
        const geocodingResults = await Promise.allSettled([
          tryBigDataCloudDetailed(coords),
          tryNominatimDetailed(coords),
          tryMapboxGeocoding(coords)
        ])
        
        console.log('Geocoding results:', geocodingResults)
        
        // Process results and extract the most precise address
        await processPreciseGeocodingResults(geocodingResults, coords)
        
        locationStatusForForm.value = '✅ Precise location extracted successfully'
        
        // Clear status after 5 seconds
        setTimeout(() => {
          locationStatusForForm.value = ''
        }, 5000)
      } catch (error) {
        console.error('General geocoding error:', error)
        
        // Fallback to coordinates if everything fails
        formData.locationCity = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        formData.locationState = 'Coordinates'
        formData.locationStreet = `Accuracy: ${position.coords.accuracy}m`
        locationStatusForForm.value = '✅ High-precision coordinates filled'
        
        setTimeout(() => {
          locationStatusForForm.value = ''
        }, 5000)
      }
      
      gettingLocationForForm.value = false
    },
    (error) => {
      console.error('Geolocation error:', error)
      locationStatusForForm.value = '❌ Failed to get precise location. Please try again.'
      gettingLocationForForm.value = false
      
      setTimeout(() => {
        locationStatusForForm.value = ''
      }, 5000)
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 60000 // Shorter cache for more precision
    }
  )
}

// Enhanced geocoding service functions
const tryBigDataCloudDetailed = async (coords) => {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=en`
  )
  if (!response.ok) throw new Error('BigDataCloud API failed')
  const data = await response.json()
  return { service: 'BigDataCloud', data, success: true }
}

const tryNominatimDetailed = async (coords) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&accept-language=en&zoom=18`
  )
  if (!response.ok) throw new Error('Nominatim API failed')
  const data = await response.json()
  return { service: 'Nominatim', data, success: true }
}

const tryMapboxGeocoding = async (coords) => {
  // Using Mapbox's free tier geocoding (no API key needed for basic reverse geocoding)
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?types=address&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
  )
  if (!response.ok) throw new Error('Mapbox API failed')
  const data = await response.json()
  return { service: 'Mapbox', data, success: true }
}

const processPreciseGeocodingResults = async (results, coords) => {
  console.log('Processing precise geocoding results...')
  
  let bestStreet = ''
  let bestCity = ''
  let bestState = ''
  let addressComponents = []
  
  // Process each successful result
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.success) {
      const { service, data } = result.value
      console.log(`Processing ${service} result:`, data)
      
      let extracted = null
      
      if (service === 'BigDataCloud') {
        extracted = extractDetailedFromBigDataCloud(data)
      } else if (service === 'Nominatim') {
        extracted = extractDetailedFromNominatim(data)
      } else if (service === 'Mapbox') {
        extracted = extractDetailedFromMapbox(data)
      }
      
      if (extracted) {
        addressComponents.push({ service, ...extracted })
        
        // Use the most detailed street information
        if (extracted.street && (!bestStreet || extracted.street.length > bestStreet.length)) {
          bestStreet = extracted.street
        }
        
        // Use the most specific city
        if (extracted.city && (!bestCity || extracted.city.length > bestCity.length)) {
          bestCity = extracted.city
        }
        
        // Use the most detailed state
        if (extracted.state && (!bestState || extracted.state.length > bestState.length)) {
          bestState = extracted.state
        }
      }
    }
  }
  
  // Set the best available information
  if (bestStreet) {
    formData.locationStreet = bestStreet
    console.log('Set precise street:', bestStreet)
  }
  
  if (bestCity) {
    formData.locationCity = bestCity
    console.log('Set precise city:', bestCity)
  }
  
  if (bestState) {
    formData.locationState = bestState
    console.log('Set precise state:', bestState)
  }
  
  // Log all components for debugging
  console.log('All address components:', addressComponents)
  console.log('Final precise address:', {
    street: bestStreet,
    city: bestCity,
    state: bestState
  })
}

const extractDetailedFromBigDataCloud = (data) => {
  // Romanian address format: "Strada [Name] [Number]"
  let streetName = ''
  let streetNumber = ''
  
  // Extract street name first
  if (data.streetName) {
    streetName = data.streetName
  } else if (data.road && data.road.toLowerCase() !== 'unnamed road') {
    streetName = data.road
  } else if (data.street) {
    streetName = data.street
  } else if (data.neighbourhood && data.neighbourhood !== data.city && data.neighbourhood !== data.locality) {
    streetName = data.neighbourhood
  } else if (data.sublocality && data.sublocality !== data.city && data.sublocality !== data.locality) {
    streetName = data.sublocality
  }
  
  // Extract street number
  if (data.streetNumber) {
    streetNumber = data.streetNumber
  }
  
  // Format Romanian address: "Strada [Name] [Number]"
  let formattedStreet = ''
  if (streetName) {
    // Add "Strada" prefix if not already present
    if (!streetName.toLowerCase().startsWith('strada') && 
        !streetName.toLowerCase().startsWith('str.') &&
        !streetName.toLowerCase().startsWith('bulevardul') &&
        !streetName.toLowerCase().startsWith('bd.') &&
        !streetName.toLowerCase().startsWith('aleea') &&
        !streetName.toLowerCase().startsWith('calea') &&
        !streetName.toLowerCase().startsWith('piața')) {
      formattedStreet = `Strada ${streetName}`
    } else {
      formattedStreet = streetName
    }
    
    // Add number at the end (Romanian format)
    if (streetNumber) {
      formattedStreet += ` ${streetNumber}`
    }
  }
  
  // Enhanced city extraction
  let city = data.city || data.locality || data.municipalitySubdivision || data.municipality || ''
  
  // Enhanced state extraction  
  let state = data.principalSubdivision || data.countrySubdivision || data.countrySecondarySubdivision || ''
  
  return {
    street: formattedStreet,
    city: city,
    state: state,
    precision: 'high',
    components: { streetName, streetNumber, rawData: data }
  }
}

const extractDetailedFromNominatim = (data) => {
  if (!data.address) return null
  
  const addr = data.address
  
  // Romanian address format: "Strada [Name] [Number]"
  let streetName = ''
  let streetNumber = ''
  
  // Extract street number first (if available)
  if (addr.house_number) {
    streetNumber = addr.house_number
  }
  
  // Extract street name
  const roadField = addr.road || addr.street || addr.pedestrian || addr.footway || addr.path
  if (roadField && roadField.toLowerCase() !== 'unnamed road') {
    streetName = roadField
  } else if (addr.neighbourhood && addr.neighbourhood !== addr.city && addr.neighbourhood !== addr.town) {
    streetName = addr.neighbourhood
  } else if (addr.suburb && addr.suburb !== addr.city && addr.suburb !== addr.town) {
    streetName = addr.suburb
  }
  
  // Format Romanian address: "Strada [Name] [Number]"
  let formattedStreet = ''
  if (streetName) {
    // Add appropriate prefix if not already present
    if (!streetName.toLowerCase().startsWith('strada') && 
        !streetName.toLowerCase().startsWith('str.') &&
        !streetName.toLowerCase().startsWith('bulevardul') &&
        !streetName.toLowerCase().startsWith('bd.') &&
        !streetName.toLowerCase().startsWith('aleea') &&
        !streetName.toLowerCase().startsWith('calea') &&
        !streetName.toLowerCase().startsWith('piața')) {
      formattedStreet = `Strada ${streetName}`
    } else {
      formattedStreet = streetName
    }
    
    // Add number at the end (Romanian format)
    if (streetNumber) {
      formattedStreet += ` ${streetNumber}`
    }
  }
  
  // Enhanced city and state extraction
  const city = addr.city || addr.town || addr.municipality || addr.village || addr.hamlet || ''
  const state = addr.state || addr['ISO3166-2-lvl4'] || addr.region || ''
  
  return {
    street: formattedStreet,
    city: city,
    state: state,
    precision: 'high',
    components: { streetName, streetNumber, rawData: addr }
  }
}

const extractDetailedFromMapbox = (data) => {
  if (!data.features || data.features.length === 0) return null
  
  const feature = data.features[0]
  
  // Romanian address format: "Strada [Name] [Number]"
  let streetName = ''
  let streetNumber = ''
  
  // Extract from Mapbox feature text (usually contains street name)
  if (feature.text) {
    streetName = feature.text
  }
  
  // Extract address number from properties
  if (feature.properties && feature.properties.address) {
    // If properties.address contains a number, extract it
    const addressMatch = feature.properties.address.match(/\d+/)
    if (addressMatch) {
      streetNumber = addressMatch[0]
    }
  }
  
  // Format Romanian address: "Strada [Name] [Number]"
  let formattedStreet = ''
  if (streetName) {
    // Add appropriate prefix if not already present
    if (!streetName.toLowerCase().startsWith('strada') && 
        !streetName.toLowerCase().startsWith('str.') &&
        !streetName.toLowerCase().startsWith('bulevardul') &&
        !streetName.toLowerCase().startsWith('bd.') &&
        !streetName.toLowerCase().startsWith('aleea') &&
        !streetName.toLowerCase().startsWith('calea') &&
        !streetName.toLowerCase().startsWith('piața')) {
      formattedStreet = `Strada ${streetName}`
    } else {
      formattedStreet = streetName
    }
    
    // Add number at the end (Romanian format)
    if (streetNumber) {
      formattedStreet += ` ${streetNumber}`
    }
  }
  
  // Extract city and state from context
  let city = ''
  let state = ''
  
  if (feature.context) {
    for (const ctx of feature.context) {
      if (ctx.id.startsWith('place.')) {
        city = ctx.text
      } else if (ctx.id.startsWith('region.')) {
        state = ctx.text
      }
    }
  }
  
  return {
    street: formattedStreet,
    city: city,
    state: state,
    precision: 'medium',
    components: { streetName, streetNumber, rawData: feature }
  }
}

const validateForm = () => {
  fieldErrors.value = {}
  
  // Required field validation
  if (!formData.type?.trim()) {
    fieldErrors.value.type = 'Please select an announcement type'
  }
  
  if (!formData.petType?.trim()) {
    fieldErrors.value.petType = 'Please select a pet type'
  }
  
  if (!formData.petName?.trim()) {
    fieldErrors.value.petName = 'Please enter the pet name'
  }
  
  if (!formData.description?.trim()) {
    fieldErrors.value.description = 'Please provide a description'
  }
  
  if (!formData.locationCity?.trim()) {
    fieldErrors.value.locationCity = 'Please enter the city'
  }
  
  if (!formData.locationState?.trim()) {
    fieldErrors.value.locationState = 'Please enter the state/region'
  }
  
  // Email validation (if provided)
  if (formData.contactEmail?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail.trim())) {
    fieldErrors.value.contactEmail = 'Please enter a valid email address'
  }
  
  // At least one contact method required
  if (!formData.contactPhone?.trim() && !formData.contactEmail?.trim()) {
    fieldErrors.value.contactPhone = 'Please provide at least one contact method (phone or email)'
  }
  
  const isValid = Object.keys(fieldErrors.value).length === 0
  console.log('Form validation result:', isValid, fieldErrors.value)
  
  return isValid
}

const handleSubmit = async () => {
  console.log('=== FORM SUBMIT DEBUG ===')
  console.log('Form data:', formData)
  console.log('Field errors before validation:', fieldErrors.value)
  
  if (!validateForm()) {
    console.log('Form validation failed:', fieldErrors.value)
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // Prepare payload as a regular object, not FormData
    const payload = {}
    
    // Combine location fields for locationName
    const locationParts = []
    if (formData.locationStreet?.trim()) locationParts.push(formData.locationStreet.trim())
    if (formData.locationCity?.trim()) locationParts.push(formData.locationCity.trim())
    if (formData.locationState?.trim()) locationParts.push(formData.locationState.trim())
    const combinedLocation = locationParts.join(', ')
    
    console.log('Combined location:', combinedLocation)
    
    // Add basic form fields
    payload.type = formData.type || ''
    payload.petType = formData.petType || ''
    payload.petName = formData.petName || ''
    payload.description = formData.description || ''
    
    // lastSeenDate is required by schema - use current date as fallback
    if (formData.lastSeenDate) {
      payload.lastSeenDate = new Date(formData.lastSeenDate).toISOString()
    } else {
      payload.lastSeenDate = new Date().toISOString()
    }
    
    // Add locationName (simple string for display)
    if (combinedLocation) {
      payload.locationName = combinedLocation
    } else {
      payload.locationName = 'Unknown Location'
    }
    
    // Add locationDetails as object (not JSON string)
    const locationDetails = {}
    if (formData.locationStreet?.trim()) {
      locationDetails.address = formData.locationStreet.trim()
    }
    if (formData.locationCity?.trim()) {
      locationDetails.city = formData.locationCity.trim()
    }
    if (formData.locationState?.trim()) {
      locationDetails.state = formData.locationState.trim()
    }
    
    payload.locationDetails = locationDetails
    
    // Location structure expected by backend validation schema
    payload.location = {
      address: formData.locationStreet?.trim() || 'Unknown Address',
      city: formData.locationCity?.trim() || 'Unknown City', 
      state: formData.locationState?.trim() || 'Unknown State',
      coordinates: {
        latitude: 44.4268,  // Default Bucharest coordinates
        longitude: 26.1025
      }
    }
    
    // Add contact info as object (not JSON string)
    const contactInfo = {}
    if (formData.contactPhone?.trim()) {
      contactInfo.phone = formData.contactPhone.trim()
    }
    if (formData.contactEmail?.trim()) {
      contactInfo.email = formData.contactEmail.trim()
    }
    
    // Determine preferred contact method - backend only accepts "phone" or "email", not "both"
    if (contactInfo.phone && contactInfo.email) {
      contactInfo.preferredContact = 'email' // Default to email when both are available
    } else if (contactInfo.phone) {
      contactInfo.preferredContact = 'phone'
    } else if (contactInfo.email) {
      contactInfo.preferredContact = 'email'
    }
    
    payload.contactInfo = contactInfo
    
    
    // Handle images - use FormData only if there are files to upload
    let response
    if (selectedFiles.value.length > 0) {
      const formDataToSend = new FormData()
      
      // Add all payload fields to FormData
      Object.keys(payload).forEach(key => {
        if (typeof payload[key] === 'object') {
          formDataToSend.append(key, JSON.stringify(payload[key]))
        } else {
          formDataToSend.append(key, payload[key])
        }
      })
      
      // Add new files
      selectedFiles.value.forEach(file => {
        formDataToSend.append('images', file)
      })
      
      // Add existing images for editing
      if (formData.images && formData.images.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(formData.images))
      }
      
      console.log('FormData entries (with files):')
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }
      
      if (props.announcement) {
        console.log('Updating announcement:', props.announcement.id)
        response = await announcementApi.update(props.announcement.id, formDataToSend)
      } else {
        console.log('Creating new announcement with files')
        response = await announcementApi.create(formDataToSend)
      }
    } else {
      // No files - send as JSON
      console.log('Payload (no files):', payload)
      
      if (props.announcement) {
        console.log('Updating announcement:', props.announcement.id)
        response = await announcementApi.update(props.announcement.id, payload)
      } else {
        console.log('Creating new announcement without files')
        response = await announcementApi.create(payload)
      }
    }
    
    console.log('API Response:', response)
    emit('success', response.data)
    emit('close')
  } catch (err) {
    console.error('Form submission error:', err)
    console.error('Error response:', err.response?.data)
    
    let errorMessage = 'An error occurred while saving the announcement'
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    } else if (err.message) {
      errorMessage = err.message
    }
    
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}

// Clean up object URLs when component unmounts
onUnmounted(() => {
  selectedFiles.value.forEach(file => {
    if (file instanceof File) {
      URL.revokeObjectURL(getImagePreview(file))
    }
  })
})
</script>

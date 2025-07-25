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
        <FormField
          v-if="formData.type === 'lost'"
          v-model="formData.lastSeenDate"
          label="Last Seen Date"
          type="date"
          :error="!!fieldErrors.lastSeenDate"
          :error-message="fieldErrors.lastSeenDate"
          help-text="When did you last see your pet?"
        />

        <!-- Found Date (for found pets) -->
        <FormField
          v-if="formData.type === 'found'"
          v-model="formData.lastSeenDate"
          label="Found Date"
          type="date"
          :error="!!fieldErrors.lastSeenDate"
          :error-message="fieldErrors.lastSeenDate"
          help-text="When did you find this pet?"
        />

        <!-- Location -->
        <FormField
          v-model="formData.location"
          label="Location"
          :required="!announcement"
          :error="!!fieldErrors.location"
          :error-message="fieldErrors.location"
          placeholder="Enter location where pet was last seen or found"
          help-text="Be as specific as possible (street, neighborhood, landmarks)"
        />

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
import { createAnnouncement, updateAnnouncement } from '@/api/announcements'

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

// Form data
const formData = reactive({
  type: '',
  petType: '',
  petName: '',
  description: '',
  lastSeenDate: '',
  location: '',
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
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'other', label: 'Other' }
]

// Initialize form data
if (props.announcement) {
  Object.assign(formData, {
    type: props.announcement.type || '',
    petType: props.announcement.petType || '',
    petName: props.announcement.petName || '',
    description: props.announcement.description || '',
    lastSeenDate: props.announcement.lastSeenDate ? 
      new Date(props.announcement.lastSeenDate).toISOString().split('T')[0] : '',
    location: props.announcement.location || '',
    contactPhone: props.announcement.contactPhone || '',
    contactEmail: props.announcement.contactEmail || '',
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

const validateForm = () => {
  fieldErrors.value = {}
  
  if (!formData.type) {
    fieldErrors.value.type = 'Please select an announcement type'
  }
  
  if (!formData.petType) {
    fieldErrors.value.petType = 'Please select a pet type'
  }
  
  if (!formData.petName?.trim()) {
    fieldErrors.value.petName = 'Please enter the pet name'
  }
  
  if (!formData.description?.trim()) {
    fieldErrors.value.description = 'Please provide a description'
  }
  
  if (!formData.location?.trim()) {
    fieldErrors.value.location = 'Please enter the location'
  }
  
  if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    fieldErrors.value.contactEmail = 'Please enter a valid email address'
  }
  
  if (!formData.contactPhone?.trim() && !formData.contactEmail?.trim()) {
    fieldErrors.value.contactPhone = 'Please provide at least one contact method'
  }
  
  return Object.keys(fieldErrors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const formDataToSend = new FormData()
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && formData[key]) {
        formDataToSend.append(key, formData[key])
      }
    })
    
    // Add new files
    selectedFiles.value.forEach(file => {
      formDataToSend.append('images', file)
    })
    
    // Add existing images
    if (formData.images && formData.images.length > 0) {
      formDataToSend.append('existingImages', JSON.stringify(formData.images))
    }
    
    let response
    if (props.announcement) {
      response = await updateAnnouncement(props.announcement.id, formDataToSend)
    } else {
      response = await createAnnouncement(formDataToSend)
    }
    
    emit('success', response.data)
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while saving the announcement'
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

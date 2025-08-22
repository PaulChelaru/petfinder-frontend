<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit Announcement' : 'Create New Announcement' }}
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
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter announcement title"
          />
        </div>

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
            <option value="adoption">Pet for Adoption</option>
          </select>
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
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
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
              v-model="formData.location"
              type="text"
              required
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location or address"
            />
            <button
              type="button"
              @click="getCurrentLocation"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              :disabled="loadingLocation"
            >
              <i class="fas fa-crosshairs"></i>
            </button>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contact Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.contactName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.contactPhone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your phone number"
            />
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pet Photos
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
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
              <p class="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>
          
          <!-- Image Preview -->
          <div v-if="previewImages.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="(image, index) in previewImages"
              :key="index"
              class="relative"
            >
              <img
                :src="image"
                :alt="`Preview ${index + 1}`"
                class="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Date Last Seen (for lost pets) -->
        <div v-if="formData.type === 'lost'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date Last Seen
          </label>
          <input
            v-model="formData.lastSeenDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Additional Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            v-model="formData.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional information (optional)"
          ></textarea>
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
import { ref, reactive, watch, onMounted } from 'vue'
import BaseButton from '../buttons/BaseButton.vue'

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

const emit = defineEmits(['close', 'submit'])

const isEditing = ref(false)
const isSubmitting = ref(false)
const loadingLocation = ref(false)
const previewImages = ref([])
const fileInput = ref(null)

const formData = reactive({
  title: '',
  type: '',
  petType: '',
  description: '',
  location: '',
  contactName: '',
  contactPhone: '',
  lastSeenDate: '',
  notes: '',
  images: []
})

// Watch for announcement prop changes (editing mode)
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement) {
    isEditing.value = true
    Object.assign(formData, {
      title: newAnnouncement.title || '',
      type: newAnnouncement.type || '',
      petType: newAnnouncement.petType || '',
      description: newAnnouncement.description || '',
      location: newAnnouncement.location || '',
      contactName: newAnnouncement.contactName || '',
      contactPhone: newAnnouncement.contactPhone || '',
      lastSeenDate: newAnnouncement.lastSeenDate || '',
      notes: newAnnouncement.notes || '',
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

const resetForm = () => {
  isEditing.value = false
  isSubmitting.value = false
  previewImages.value = []
  Object.assign(formData, {
    title: '',
    type: '',
    petType: '',
    description: '',
    location: '',
    contactName: '',
    contactPhone: '',
    lastSeenDate: '',
    notes: '',
    images: []
  })
}

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
        // TODO: Implement reverse geocoding to get address from coordinates
        formData.location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        console.log('Location:', { latitude, longitude })
      } catch (error) {
        console.error('Error getting location:', error)
      } finally {
        loadingLocation.value = false
      }
    },
    (error) => {
      console.error('Error getting location:', error)
      alert('Unable to get your location. Please enter it manually.')
      loadingLocation.value = false
    }
  )
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push(e.target.result)
      formData.images.push(file)
    }
    reader.readAsDataURL(file)
  })

  // Clear the input
  event.target.value = ''
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
  formData.images.splice(index, 1)
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // Prepare form data for submission
    const submissionData = {
      ...formData,
      id: props.announcement?.id || null
    }

    // Emit the form data to parent component
    emit('submit', submissionData)
    
    // Close modal after successful submission
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    // TODO: Show error message to user
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
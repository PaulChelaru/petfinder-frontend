<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <p class="text-gray-600 mb-4">
          {{ message }}
        </p>
        
        <!-- Resolution Date Input -->
        <div v-if="showDateInput" class="mb-4">
          <label for="resolvedDate" class="block text-sm font-medium text-gray-700 mb-2">
            {{ dateLabel }}
          </label>
          <input
            id="resolvedDate"
            v-model="resolvedDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Additional Notes -->
        <div v-if="showNotesInput" class="mb-4">
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            v-model="notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional information..."
          ></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <ActionButton
          variant="outline"
          @click="handleCancel"
        >
          Cancel
        </ActionButton>
        <ActionButton
          :variant="confirmVariant"
          @click="handleConfirm"
          :loading="loading"
        >
          {{ confirmText }}
        </ActionButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActionButton from '../buttons/ActionButton.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  announcement: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  showDateInput: {
    type: Boolean,
    default: true
  },
  showNotesInput: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'confirm'])

// Local state
const resolvedDate = ref(new Date().toISOString().split('T')[0])
const notes = ref('')

// Computed properties
const title = computed(() => {
  if (!props.announcement) return 'Resolve Announcement'
  
  const type = props.announcement.type || props.announcement.announcementType
  switch (type) {
    case 'lost':
      return 'Mark Pet as Found'
    case 'found':
      return 'Mark as Reunited'
    case 'adoption':
      return 'Mark as Adopted'
    default:
      return 'Resolve Announcement'
  }
})

const message = computed(() => {
  if (!props.announcement) return 'Are you sure you want to resolve this announcement?'
  
  const type = props.announcement.type || props.announcement.announcementType
  const petName = props.announcement.title || 'this pet'
  
  switch (type) {
    case 'lost':
      return `Great news! Have you found ${petName}? This will mark the announcement as resolved and notify interested users.`
    case 'found':
      return `Wonderful! Has ${petName} been reunited with their owner? This will close the announcement.`
    case 'adoption':
      return `Congratulations! Has ${petName} found their forever home? This will mark the adoption as complete.`
    default:
      return 'Are you sure you want to resolve this announcement?'
  }
})

const confirmText = computed(() => {
  if (!props.announcement) return 'Resolve'
  
  const type = props.announcement.type || props.announcement.announcementType
  switch (type) {
    case 'lost':
      return 'Mark as Found'
    case 'found':
      return 'Mark as Reunited'
    case 'adoption':
      return 'Mark as Adopted'
    default:
      return 'Resolve'
  }
})

const confirmVariant = computed(() => {
  if (!props.announcement) return 'primary'
  
  const type = props.announcement.type || props.announcement.announcementType
  switch (type) {
    case 'lost':
      return 'success'
    case 'found':
      return 'primary'
    case 'adoption':
      return 'success'
    default:
      return 'primary'
  }
})

const dateLabel = computed(() => {
  if (!props.announcement) return 'Resolution Date'
  
  const type = props.announcement.type || props.announcement.announcementType
  switch (type) {
    case 'lost':
      return 'Date Found'
    case 'found':
      return 'Reunion Date'
    case 'adoption':
      return 'Adoption Date'
    default:
      return 'Resolution Date'
  }
})

// Methods
const handleCancel = () => {
  // Reset form
  resolvedDate.value = new Date().toISOString().split('T')[0]
  notes.value = ''
  emit('close')
}

const handleConfirm = () => {
  const data = {
    announcement: props.announcement,
    resolvedDate: resolvedDate.value,
    notes: notes.value.trim() || null
  }
  
  emit('confirm', data)
}
</script>

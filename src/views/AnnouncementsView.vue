<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <NavBar />
    
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Pet Announcements</h1>
          <p class="text-gray-600">Find lost pets, report found pets, or browse adoption opportunities</p>
        </div>
        <ActionButton 
          v-if="authStore.isAuthenticated"
          @click="handleCreateClick"
          variant="primary"
          class="mt-4 sm:mt-0"
        >
          Create Announcement
        </ActionButton>
      </div>

      <!-- Search and Filters -->
      <AnnouncementFilters 
        :filters="filters"
        :loading="loading"
        @update:filters="updateFilters"
        @reset="handleResetFilters"
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Results -->
      <div v-else>
        <!-- Results Header -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            {{ announcements.length > 0 ? `Showing ${announcements.length} of ${pagination.total} results` : 'No announcements found' }}
          </p>
        </div>

        <!-- Announcements Grid -->
        <div v-if="announcements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnnouncementCard
            v-for="announcement in announcements"
            :key="announcement.id"
            :announcement="announcement"
            @view="handleViewAnnouncement"
            @edit="handleEditAnnouncement"
            @resolve="handleResolveAnnouncement"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fas fa-search w-16 h-16 text-gray-400 mx-auto mb-4 text-6xl"></i>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <ActionButton @click="handleResetFilters" variant="outline" icon="refresh">
            Clear Filters
          </ActionButton>
        </div>

        <!-- Pagination removed as requested -->
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AnnouncementFormModal
      v-if="showCreateModal || editingAnnouncement"
      :is-open="showCreateModal || !!editingAnnouncement"
      :announcement="editingAnnouncement"
      @close="handleCloseModal"
      @success="handleAnnouncementSaved"
    />

    <!-- View Modal -->
    <AnnouncementDetailModal
      v-if="viewingAnnouncement"
      :announcement="viewingAnnouncement"
      @close="viewingAnnouncement = null"
      @edit="handleEditAnnouncement"
      @resolve="handleResolveAnnouncement"
    />

    <!-- Resolve Modal -->
    <ResolveAnnouncementModal
      v-if="resolvingAnnouncement"
      :announcement="resolvingAnnouncement"
      @close="resolvingAnnouncement = null"
      @success="handleAnnouncementResolved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { announcementApi } from '@/api/announcements'
import { getAnnouncementMatches } from '@/api/matches'

import NavBar from '@/layouts/NavBar.vue'
import ActionButton from '@/components/buttons/ActionButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AnnouncementCard from '@/components/cards/AnnouncementCard.vue'
import AnnouncementFilters from '@/components/forms/AnnouncementFilters.vue'
import AnnouncementFormModal from '@/components/modals/AnnouncementFormModal.vue'
import AnnouncementDetailModal from '@/components/modals/AnnouncementDetailModal.vue'
import ResolveAnnouncementModal from '@/components/modals/ResolveAnnouncementModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

// State
const loading = ref(false)
const announcements = ref([])
const deletingAnnouncement = ref(null)
const pagination = reactive({
  page: 1,
  limit: 50, // Increased limit since pagination is removed
  total: 0
})

// Request management
let currentRequest = null

const filters = reactive({
  petType: '',
  type: '',
  longitude: null,
  latitude: null,
  maxDistance: null,
  postedSince: null,
  dateRange: ''
})

// Modals
const showCreateModal = ref(false)
const editingAnnouncement = ref(null)
const viewingAnnouncement = ref(null)
const resolvingAnnouncement = ref(null)

// Methods
const loadAnnouncements = async () => {
  try {
    // Cancel previous request if still pending
    if (currentRequest) {
      currentRequest.abort()
    }

    // Create new abort controller for this request
    const abortController = new AbortController()
    currentRequest = abortController

    loading.value = true
    console.log('🔍 Loading announcements with filters:', filters)
    
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      petType: filters.petType,
      type: filters.type,
      longitude: filters.longitude,
      latitude: filters.latitude,
      maxDistance: filters.maxDistance,
      postedSince: filters.postedSince
    }

    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await announcementApi.list(params, abortController.signal)
    
    // Only update if this request wasn't aborted
    if (!abortController.signal.aborted) {
      announcements.value = response.data.announcements || []
      pagination.total = response.data.pagination?.total || 0
      pagination.page = response.data.pagination?.page || 1
      
      // Load matches for each announcement
      await loadMatchesForAnnouncements()
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was aborted')
      return
    }
    console.error('Error loading announcements:', error)
    toastStore.showError('Failed to load announcements. Please try again.')
  } finally {
    // Only set loading to false if this request wasn't aborted
    if (currentRequest && !currentRequest.signal.aborted) {
      loading.value = false
      currentRequest = null
    }
  }
}

// Load matches for all announcements
const loadMatchesForAnnouncements = async () => {
  console.log('Loading matches for', announcements.value.length, 'announcements')
  
  for (const announcement of announcements.value) {
    try {
      const matchesResponse = await getAnnouncementMatches(announcement.announcementId)
      if (matchesResponse.success && matchesResponse.data.length > 0) {
        // Add matches info to announcement
        announcement.matches = matchesResponse.data
        announcement.matchCount = matchesResponse.data.length
        announcement.topMatch = matchesResponse.data[0] // Best match
        console.log(`Loaded ${matchesResponse.data.length} matches for announcement ${announcement.announcementId}`)
      } else {
        announcement.matches = []
        announcement.matchCount = 0
        announcement.topMatch = null
      }
    } catch (error) {
      console.warn(`Failed to load matches for announcement ${announcement.announcementId}:`, error)
      announcement.matches = []
      announcement.matchCount = 0
      announcement.topMatch = null
    }
  }
}

const updateFilters = (newFilters) => {
  // Check if filters actually changed
  const hasChanged = Object.keys(newFilters).some(key => {
    return filters[key] !== newFilters[key]
  })
  
  if (hasChanged) {
    Object.assign(filters, newFilters)
    
    // Auto-search when filters change
    pagination.page = 1
    loadAnnouncements()
  }
}

const handleResetFilters = () => {
  Object.assign(filters, {
    petType: '',
    type: '',
    longitude: null,
    latitude: null,
    maxDistance: null,
    postedSince: null,
    dateRange: ''
  })
  pagination.page = 1
  loadAnnouncements()
}

const handleViewAnnouncement = (announcement) => {
  console.log('AnnouncementsView - setting viewingAnnouncement:', announcement)
  viewingAnnouncement.value = announcement
}

const handleEditAnnouncement = (announcement) => {
  // Don't allow editing resolved announcements
  if (announcement.status === 'resolved') {
    return
  }
  
  if (viewingAnnouncement.value) {
    viewingAnnouncement.value = null
  }
  editingAnnouncement.value = announcement
}

const handleResolveAnnouncement = (announcement) => {
  if (viewingAnnouncement.value) {
    viewingAnnouncement.value = null
  }
  resolvingAnnouncement.value = announcement
}

const handleDeleteAnnouncement = (announcement) => {
  deletingAnnouncement.value = announcement
}

const confirmDelete = async () => {
  if (!deletingAnnouncement.value) return
  
  try {
    await announcementApi.delete(deletingAnnouncement.value.id)
    
    toastStore.showSuccess('Announcement deleted successfully.')
    
    viewingAnnouncement.value = null
    await loadAnnouncements()
    
  } catch (error) {
    console.error('Error deleting announcement:', error)
    
    let errorMessage = 'Failed to delete announcement. Please try again.'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 403) {
      errorMessage = 'You do not have permission to delete this announcement.'
    } else if (error.response?.status === 404) {
      errorMessage = 'Announcement not found or already deleted.'
    }
    
    toastStore.showError(errorMessage)
    
    throw error // Re-throw to be handled by the modal
  }
}

const handleCloseModal = () => {
  showCreateModal.value = false
  editingAnnouncement.value = null
}

const handleCreateClick = () => {
  console.log('Create button clicked!')
  console.log('showCreateModal before:', showCreateModal.value)
  console.log('editingAnnouncement before:', editingAnnouncement.value)
  showCreateModal.value = true
  console.log('showCreateModal after:', showCreateModal.value)
}

const handleAnnouncementSaved = () => {
  handleCloseModal()
  loadAnnouncements()
  
  toastStore.showSuccess(
    editingAnnouncement.value ? 'Announcement updated successfully.' : 'Announcement created successfully.'
  )
}

const handleAnnouncementResolved = () => {
  resolvingAnnouncement.value = null
  loadAnnouncements()
  
  toastStore.showSuccess('Announcement resolved successfully.')
}

// Lifecycle
onMounted(() => {
  loadAnnouncements()
})

onUnmounted(() => {
  // Cancel any pending request when component is unmounted
  if (currentRequest) {
    currentRequest.abort()
    currentRequest = null
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <NavBar />
    
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">My Announcements</h1>
          <p class="text-gray-600">Manage your pet announcements and track their status</p>
        </div>
        <ActionButton 
          @click="showCreateModal = true"
          variant="primary"
          icon="add"
          class="mt-4 sm:mt-0"
        >
          Create New Announcement
        </ActionButton>
      </div>

      <!-- Filters -->
      <MyAnnouncementFilters 
        :filters="filters"
        :loading="loading"
        @update:filters="updateFilters"
        @reset="resetFilters"
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Results -->
      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6 stats-card">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="fas fa-file-alt w-6 h-6 text-blue-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.total }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6 stats-card">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="fas fa-check-circle w-6 h-6 text-green-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Active</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.active }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6 stats-card">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <i class="fas fa-check w-6 h-6 text-purple-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Resolved</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.resolved }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Header -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            {{ announcements.length > 0 ? `Showing ${announcements.length} of ${pagination.total} announcements` : 'No announcements found' }}
          </p>
        </div>

        <!-- Announcements Grid -->
        <div v-if="announcements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnnouncementCard
            v-for="announcement in announcements"
            :key="announcement.id"
            :announcement="{ ...announcement, isOwner: true }"
            @view="handleViewAnnouncement"
            @edit="handleEditAnnouncement"
            @resolve="handleResolveAnnouncement"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fas fa-file-alt w-16 h-16 text-gray-400 mx-auto mb-4 text-6xl"></i>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
          <p class="text-gray-600 mb-4">You haven't created any announcements yet, or no announcements match your current filters.</p>
        </div>

        <!-- Pagination removed as requested -->
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AnnouncementFormModal
      v-if="showCreateModal || editingAnnouncement"
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
      @delete="handleDeleteAnnouncement"
    />

    <!-- Resolve Modal -->
    <ResolveAnnouncementModal
      v-if="resolvingAnnouncement"
      :announcement="resolvingAnnouncement"
      @close="resolvingAnnouncement = null"
      @success="handleAnnouncementResolved"
    />
    <!-- Confirmation Modal for Delete -->
    <ConfirmationModal
      v-if="deletingAnnouncement"
      title="Delete Announcement"
      :message="`Are you sure you want to delete the announcement for ${deletingAnnouncement.petName || 'this pet'}?`"
      description="This action cannot be undone and will permanently remove the announcement."
      confirm-text="Delete"
      :on-confirm="executeDelete"
      @cancel="deletingAnnouncement = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { announcementApi } from '@/api/announcements'

import NavBar from '@/layouts/NavBar.vue'
import ActionButton from '@/components/buttons/ActionButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AnnouncementCard from '@/components/cards/AnnouncementCard.vue'
import AnnouncementFormModal from '@/components/modals/AnnouncementFormModal.vue'
import AnnouncementDetailModal from '@/components/modals/AnnouncementDetailModal.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import ResolveAnnouncementModal from '@/components/modals/ResolveAnnouncementModal.vue'
import MyAnnouncementFilters from '@/components/forms/MyAnnouncementFilters.vue'

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

const filters = reactive({
  type: '',
  status: '',
  petType: '',
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

// Computed
const stats = computed(() => {
  return {
    total: announcements.value.length,
    active: announcements.value.filter(a => a.status === 'active').length,
    resolved: announcements.value.filter(a => a.status === 'resolved').length
  }
})

// Methods
const updateFilters = (newFilters) => {
  // Check if filters actually changed
  const hasChanged = Object.keys(newFilters).some(key => {
    return filters[key] !== newFilters[key]
  })
  
  if (hasChanged) {
    Object.assign(filters, newFilters)
    
    // Auto-reload when filters change
    pagination.page = 1
    loadAnnouncements()
  }
}

const loadAnnouncements = async () => {
  try {
    loading.value = true
    
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    }

    // Remove empty values (but keep empty status as it means "all statuses")
    Object.keys(params).forEach(key => {
      if (key === 'status') {
        // Keep status even if empty string (means "all statuses")
        return;
      }
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    
    const response = await announcementApi.getUserAnnouncements(params)
    
    
    if (response.data.announcements && response.data.announcements.length > 0) {
      
      // Check for all possible ID fields
      const firstAnnouncement = response.data.announcements[0];
    }
    
    announcements.value = response.data.announcements || []
    
    // TEMPORARY FIX: Map announcements to include proper ID based on known data
    announcements.value = announcements.value.map((announcement, index) => {
      // If announcement doesn't have announcementId, generate one based on user ID and index
      if (!announcement.announcementId && !announcement.id && !announcement._id) {
        // Create a deterministic ID based on announcement data
        const tempId = `temp-${announcement.userId}-${announcement.petName.replace(/\s+/g, '-').toLowerCase()}-${index}`;
        return { ...announcement, announcementId: tempId };
      }
      
      // If has other ID fields, use them as announcementId  
      if (!announcement.announcementId) {
        const id = announcement.id || announcement._id || announcement.objectId || announcement.uuid;
        if (id) {
          return { ...announcement, announcementId: id };
        }
      }
      
      return announcement;
    });
    
    pagination.total = response.data.pagination?.total || 0
    pagination.page = response.data.pagination?.page || 1
    
    
  } catch (error) {
    console.error('Error loading user announcements:', error)
    toastStore.error({
      title: 'Error',
      message: 'Failed to load your announcements. Please try again.'
    })
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  Object.assign(filters, {
    type: '',
    status: '',
    petType: '',
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

const executeDelete = async () => {
  
  if (!deletingAnnouncement.value) {
    return;
  }
  
  try {
    
    // Get the ID - try all possible fields (announcementId first as that's what backend returns)
    const announcementId = deletingAnnouncement.value.announcementId || 
                          deletingAnnouncement.value.id || 
                          deletingAnnouncement.value._id ||
                          deletingAnnouncement.value.objectId ||
                          deletingAnnouncement.value.uuid;
                          
    
    if (!announcementId) {
      throw new Error('No valid ID found for announcement');
    }
    
    // Call the API
    const response = await announcementApi.delete(announcementId);
    
    // Success - show toast
    toastStore.success({
      title: 'Success',
      message: 'Announcement deleted successfully.'
    });
    
    // Close all modals - this is critical for proper cleanup
    viewingAnnouncement.value = null;  // Close detail modal
    editingAnnouncement.value = null;  // Close edit modal (if open)
    resolvingAnnouncement.value = null; // Close resolve modal (if open)
    deletingAnnouncement.value = null; // This will close confirmation modal
    
    // Reload announcements to reflect the deletion
    await loadAnnouncements();
    
  } catch (error) {
    console.error('🚀 Error deleting:', error);
    
    toastStore.error({
      title: 'Error',
      message: 'Failed to delete announcement. Please try again.'
    });
    
    throw error; // Re-throw to be handled by modal
  }
}

const handleDeleteConfirmed = () => {
  deletingAnnouncement.value = null;
}

const handleCloseModal = () => {
  showCreateModal.value = false
  editingAnnouncement.value = null
}

const handleAnnouncementSaved = () => {
  handleCloseModal()
  loadAnnouncements()
  
  toastStore.success({
    title: 'Success',
    message: editingAnnouncement.value ? 'Announcement updated successfully.' : 'Announcement created successfully.'
  })
}

const handleAnnouncementResolved = () => {
  resolvingAnnouncement.value = null
  loadAnnouncements()
  
  toastStore.success({
    title: 'Success',
    message: 'Announcement resolved successfully.'
  })
}

// Lifecycle
onMounted(() => {
  if (authStore.isAuthenticated) {
    loadAnnouncements()
  }
})
</script>

<style scoped>
/* Filter transition effects */
.filter-enter-active, .filter-leave-active {
  transition: all 0.3s ease;
}

.filter-enter-from, .filter-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Stats card animations */
.stats-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Grid animation */
.grid-enter-active {
  transition: all 0.3s ease;
}

.grid-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

/* Loading spinner improvements */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Better focus styles for accessibility */
.focus\:ring-2:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for main content */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

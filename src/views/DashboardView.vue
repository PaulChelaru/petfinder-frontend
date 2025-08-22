<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <NavBar />
    
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <WelcomeSection 
        :title="`Welcome back, ${user?.firstName || 'User'}!`"
        subtitle="Manage your pet adoption journey from here"
      />

      <!-- User Profile Card -->
      <div class="mb-8">
        <ProfileCard 
          :user="user"
          :loading="loading"
          :update-loading="updateLoading"
          @update:profile="handleUpdateProfile"
          @refresh="refreshUserData"
        />
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          icon="add"
          title="Browse Announcements"
          description="Find lost pets or pets for adoption"
          button-text="Browse Pets"
          button-variant="primary"
          @click="handleBrowseAnnouncements"
        />
        <QuickActionCard
          icon="search"
          title="My Announcements"
          description="Manage your pet announcements"
          button-text="View My Announcements"
          button-variant="secondary"
          @click="handleMyAnnouncements"
        />
        <QuickActionCard
          icon="announcement"
          title="Create Announcement"
          description="Post a lost pet, found pet, or adoption"
          button-text="Create Announcement"
          button-variant="outline"
          @click="handleCreateAnnouncement"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { userAPI } from '@/api/user'
import NavBar from '@/layouts/NavBar.vue'
import WelcomeSection from '@/components/sections/WelcomeSection.vue'
import ProfileCard from '@/components/cards/ProfileCard.vue'
import QuickActionCard from '@/components/cards/QuickActionCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const user = computed(() => authStore.user)
const loading = ref(false)
const updateLoading = ref(false)

const handleUpdateProfile = async (formData) => {
  if (!user.value?.id) {
    toastStore.showError('User not found')
    return
  }

  updateLoading.value = true
  try {
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      city: formData.city,
      phoneNumber: formData.phoneNumber || undefined,
      notifyByEmail: formData.notifyByEmail,
      notifyBySms: formData.notifyBySms
    }

    // Immediately update the UI with form values for instant feedback
    authStore.updateUserProfile(updateData)

    // Make the API call in the background
    const response = await userAPI.updateUserById(user.value.id, updateData)

    // Update with the confirmed server response (in case server modified any values)
    authStore.updateUserProfile(response.data)
    
    toastStore.showSuccess('Profile updated successfully!')
    
  } catch (error) {
    // If API call fails, revert to original values and show error
    await authStore.fetchUserDetails() // Reload original data
    
    const message = error.response?.data?.message || 'Failed to update profile'
    toastStore.showError(message)
  } finally {
    updateLoading.value = false
  }
}

const refreshUserData = async () => {
  loading.value = true
  try {
    await authStore.fetchUserDetails()
  } catch (error) {
    console.error('Error refreshing user data:', error)
  } finally {
    loading.value = false
  }
}

const handleBrowseAnnouncements = () => {
  router.push('/announcements')
}

const handleMyAnnouncements = () => {
  router.push('/my-announcements')
}

const handleCreateAnnouncement = () => {
  router.push('/announcements')
}

onMounted(async () => {
  // Only fetch user data if we don't have complete user details
  if (user.value?.id && (!user.value.firstName || !user.value.email)) {
    await refreshUserData()
  }
})
</script>



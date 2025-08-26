<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <NavBar />
    
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p class="text-gray-600">View and manage your account information</p>
      </div>

      <!-- Profile Content -->
      <BaseCard variant="glass" class="shadow-xl">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Personal Information</h2>
            <div class="flex space-x-2">
              <ActionButton
                v-if="!isEditMode"
                variant="primary"
                size="sm"
                @click="enterEditMode"
                icon="edit"
                class="whitespace-nowrap"
              >
                Edit Profile
              </ActionButton>
              <template v-else>
                <ActionButton
                  variant="outline"
                  size="sm"
                  @click="cancelEdit"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="primary"
                  size="sm"
                  :loading="loading"
                  @click="handleUpdateProfile"
                >
                  Save Changes
                </ActionButton>
              </template>
            </div>
          </div>
        </template>

        <div class="space-y-6">
          <!-- User Avatar Section -->
          <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-700 font-bold text-2xl">
                {{ userInitials }}
              </span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ user?.firstName }} {{ user?.lastName }}
              </h3>
              <p class="text-gray-600">@{{ user?.username }}</p>
              <p class="text-sm text-gray-500">{{ user?.role || 'User' }}</p>
            </div>
          </div>

          <!-- Basic Information - Inline Edit -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <div v-if="!isEditMode" class="px-3 py-2 text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
                {{ user?.firstName || 'Not provided' }}
              </div>
              <input
                v-else
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :class="{ 'border-red-500': errors.firstName }"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <div v-if="!isEditMode" class="px-3 py-2 text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
                {{ user?.lastName || 'Not provided' }}
              </div>
              <input
                v-else
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :class="{ 'border-red-500': errors.lastName }"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
            </div>

            <!-- Username -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div v-if="!isEditMode" class="px-3 py-2 text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
                {{ user?.username || 'Not provided' }}
              </div>
              <input
                v-else
                id="username"
                v-model="form.username"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :class="{ 'border-red-500': errors.username }"
              />
              <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div v-if="!isEditMode" class="px-3 py-2 text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
                {{ user?.email || 'Not provided' }}
              </div>
              <input
                v-else
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <div v-if="!isEditMode" class="px-3 py-2 text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
                {{ user?.city || 'Not provided' }}
              </div>
              <input
                v-else
                id="city"
                v-model="form.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :class="{ 'border-red-500': errors.city }"
              />
              <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div v-if="!isEditMode" class="px-3 py-2 text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
                {{ user?.phoneNumber || 'Not provided' }}
              </div>
              <div v-else>
                <input
                  id="phoneNumber"
                  v-model="form.phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  :class="{ 'border-red-500': errors.phoneNumber }"
                />
                <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">{{ errors.phoneNumber }}</p>
                <p class="text-xs text-gray-500 mt-1">Format: +[country code][number] (e.g., +1234567890)</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="!isEditMode" class="flex justify-center pt-6 border-t">
            <ActionButton
              variant="outline"
              @click="$router.push('/announcements')"
            >
              View Announcements
            </ActionButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { userAPI } from '@/api/user'
import NavBar from '@/layouts/NavBar.vue'
import BaseCard from '@/components/cards/BaseCard.vue'
import ActionButton from '@/components/buttons/ActionButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)
const errors = ref({})
const isEditMode = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  city: '',
  phoneNumber: '',
  notifyByEmail: true,
  notifyBySms: false
})

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (user.value?.firstName && user.value?.lastName) {
    return (user.value.firstName.charAt(0) + user.value.lastName.charAt(0)).toUpperCase()
  } else if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
})

// Load user data into form
const loadUserData = () => {
  if (user.value) {
    Object.keys(form).forEach(key => {
      if (user.value[key] !== undefined) {
        form[key] = user.value[key]
      }
    })
  }
}

// Watch for changes in user data to update form
watch(user, (newUser) => {
  if (newUser) {
    loadUserData()
  }
}, { deep: true, immediate: true })

const enterEditMode = () => {
  loadUserData()
  isEditMode.value = true
}

const cancelEdit = () => {
  errors.value = {}
  isEditMode.value = false
  loadUserData() // Reset form to original values
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.firstName.trim()) {
    errors.value.firstName = 'First name is required'
  }
  
  if (!form.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
  }
  
  if (!form.username.trim()) {
    errors.value.username = 'Username is required'
  } else if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) {
    errors.value.username = 'Username can only contain letters, numbers, underscores, and hyphens'
  }
  
  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (!form.city.trim()) {
    errors.value.city = 'City is required'
  }
  
  if (form.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(form.phoneNumber)) {
    errors.value.phoneNumber = 'Please enter a valid phone number in E.164 format'
  }
  
  if (form.notifyBySms && !form.phoneNumber) {
    errors.value.phoneNumber = 'Phone number is required for SMS notifications'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleUpdateProfile = async () => {
  if (!validateForm()) {
    toastStore.showError('Please fix the errors in the form')
    return
  }

  if (!user.value?.id) {
    toastStore.showError('User not found')
    return
  }

  loading.value = true
  try {
    const updateData = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      city: form.city,
      phoneNumber: form.phoneNumber || undefined,
      notifyByEmail: form.notifyByEmail,
      notifyBySms: form.notifyBySms
    }

    // Immediately update the UI with form values for instant feedback
    authStore.updateUserProfile(updateData)
    isEditMode.value = false // Exit edit mode immediately

    // Make the API call in the background
    const response = await userAPI.updateUserById(user.value.id, updateData)

    // Update with the confirmed server response (in case server modified any values)
    authStore.updateUserProfile(response.data)
    
    toastStore.showSuccess('Profile updated successfully!')
    
  } catch (error) {
    // If API call fails, revert to original values and show error
    await authStore.fetchUserDetails() // Reload original data
    loadUserData() // Update form with reverted data
    
    const message = error.response?.data?.message || 'Failed to update profile'
    toastStore.showError(message)
    
    // Re-enter edit mode so user can try again
    isEditMode.value = true
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Only fetch user data if we don't have complete user details
  if (user.value?.id && (!user.value.firstName || !user.value.email)) {
    await authStore.fetchUserDetails()
  }
  loadUserData()
})
</script>

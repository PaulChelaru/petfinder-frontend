<template>
  <BaseCard variant="glass" class="shadow-xl">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Your Profile</h2>
        <div class="flex space-x-2">
          <BaseButton
            v-if="!isEditMode"
            variant="primary"
            size="sm"
            @click="enterEditMode"
            class="whitespace-nowrap"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Profile</span>
            </div>
          </BaseButton>
          <template v-else>
            <BaseButton
              variant="outline"
              size="sm"
              @click="cancelEdit"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              :loading="updateLoading"
              @click="handleSave"
            >
              Save Changes
            </BaseButton>
          </template>
          <BaseButton variant="outline" size="sm" @click="$emit('refresh')" v-if="!isEditMode">
            <svg class="w-4 h-4 mr-2" :class="{'animate-spin': loading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </BaseButton>
        </div>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else class="space-y-6">
      <!-- Basic Info - Inline Edit -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- First Name -->
        <div>
          <label class="text-sm font-medium text-gray-500 mb-2 block">First Name *</label>
          <div v-if="!isEditMode" class="px-3 py-2 text-lg text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
            {{ user?.firstName || 'Not provided' }}
          </div>
          <BaseInput
            v-else
            v-model="form.firstName"
            type="text"
            required
            :error="errors.firstName"
            class="transition-all duration-200"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="text-sm font-medium text-gray-500 mb-2 block">Last Name *</label>
          <div v-if="!isEditMode" class="px-3 py-2 text-lg text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
            {{ user?.lastName || 'Not provided' }}
          </div>
          <BaseInput
            v-else
            v-model="form.lastName"
            type="text"
            required
            :error="errors.lastName"
            class="transition-all duration-200"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="text-sm font-medium text-gray-500 mb-2 block">Username *</label>
          <div v-if="!isEditMode" class="px-3 py-2 text-lg text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
            {{ user?.username || 'Not set' }}
          </div>
          <BaseInput
            v-else
            v-model="form.username"
            type="text"
            required
            :error="errors.username"
            class="transition-all duration-200"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="text-sm font-medium text-gray-500 mb-2 block">Email Address *</label>
          <div v-if="!isEditMode" class="px-3 py-2 text-lg text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
            {{ user?.email }}
          </div>
          <BaseInput
            v-else
            v-model="form.email"
            type="email"
            required
            :error="errors.email"
            class="transition-all duration-200"
          />
        </div>

        <!-- City -->
        <div>
          <label class="text-sm font-medium text-gray-500 mb-2 block">Location</label>
          <div v-if="!isEditMode" class="px-3 py-2 text-lg text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
            {{ user?.city || 'Not specified' }}
          </div>
          <BaseInput
            v-else
            v-model="form.city"
            type="text"
            required
            :error="errors.city"
            class="transition-all duration-200"
          />
        </div>

        <!-- Phone Number -->
        <div>
          <label class="text-sm font-medium text-gray-500 mb-2 block">Phone</label>
          <div v-if="!isEditMode" class="px-3 py-2 text-lg text-gray-900 min-h-[2.5rem] flex items-center bg-gray-50 rounded-md border border-gray-200">
            {{ user?.phoneNumber || 'Not provided' }}
          </div>
          <div v-else>
            <BaseInput
              v-model="form.phoneNumber"
              type="tel"
              placeholder="+1234567890"
              :error="errors.phoneNumber"
              class="transition-all duration-200"
            />
            <p class="text-xs text-gray-500 mt-1">Format: +[country code][number] (e.g., +1234567890)</p>
          </div>
        </div>

        <!-- Role (read-only) -->
        <div class="md:col-span-2">
          <label class="text-sm font-medium text-gray-500 mb-2 block">Role</label>
          <div class="flex items-center">
            <RoleBadge :role="user?.role" />
          </div>
        </div>
      </div>

      <!-- Notification Preferences -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div class="space-y-4">
          <NotificationPreference
            icon="email"
            title="Email notifications"
            description="Receive updates via email"
            :enabled="user?.notifyByEmail"
            :edit-mode="isEditMode"
            v-model="form.notifyByEmail"
          />
          <NotificationPreference
            icon="sms"
            title="SMS notifications"
            description="Receive updates via text message"
            :enabled="user?.notifyBySms"
            :edit-mode="isEditMode"
            v-model="form.notifyBySms"
          />
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import RoleBadge from './RoleBadge.vue'
import NotificationPreference from './NotificationPreference.vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  updateLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:profile', 'refresh'])

const isEditMode = ref(false)
const errors = ref({})

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

// Load user data into form
const loadUserData = () => {
  if (props.user) {
    Object.keys(form).forEach(key => {
      if (props.user[key] !== undefined) {
        form[key] = props.user[key]
      }
    })
  }
}

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

const handleSave = () => {
  if (!validateForm()) {
    return
  }
  
  emit('update:profile', { ...form })
  isEditMode.value = false
}

// Watch for user changes to reload data
watch(() => props.user, loadUserData, { immediate: true })
</script>

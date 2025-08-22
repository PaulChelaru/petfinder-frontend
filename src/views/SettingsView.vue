<template>
  <PageLayout>
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p class="text-gray-600 mt-2">Manage your account preferences and security</p>
        </div>

        <!-- Settings Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Navigation -->
          <div class="lg:col-span-1">
            <nav class="space-y-2">
              <button
                v-for="section in sections"
                :key="section.id"
                @click="activeSection = section.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center',
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <i :class="section.icon + ' mr-3'"></i>
                {{ section.name }}
              </button>
            </nav>
          </div>

          <!-- Content -->
          <div class="lg:col-span-2">
            <div class="bg-white shadow-xl rounded-lg overflow-hidden">
              <!-- Account Settings -->
              <div v-if="activeSection === 'account'" class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
                
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input 
                      v-model="settings.username"
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      v-model="settings.email"
                      type="email" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select 
                      v-model="settings.language"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="ro">Română</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Notification Settings -->
              <div v-if="activeSection === 'notifications'" class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p class="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        v-model="settings.emailNotifications" 
                        type="checkbox" 
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">Push Notifications</h3>
                      <p class="text-sm text-gray-500">Receive push notifications</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        v-model="settings.pushNotifications" 
                        type="checkbox" 
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">New Announcements</h3>
                      <p class="text-sm text-gray-500">Get notified of new announcements in your area</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        v-model="settings.newAnnouncementNotifications" 
                        type="checkbox" 
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Privacy Settings -->
              <div v-if="activeSection === 'privacy'" class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                
                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 mb-2">Profile Visibility</h3>
                    <select 
                      v-model="settings.profileVisibility"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">Show Contact Information</h3>
                      <p class="text-sm text-gray-500">Allow others to see your contact info</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        v-model="settings.showContactInfo" 
                        type="checkbox" 
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div class="pt-4 border-t border-gray-200">
                    <BaseButton 
                      variant="danger" 
                      size="md"
                      @click="showDeleteConfirmation = true"
                      class="flex items-center"
                    >
                      <i class="fas fa-trash mr-2"></i>
                      Delete Account
                    </BaseButton>
                  </div>
                </div>
              </div>

              <!-- Security Settings -->
              <div v-if="activeSection === 'security'" class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Security</h2>
                
                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                    <div class="space-y-4">
                      <input 
                        v-model="passwordData.current"
                        type="password" 
                        placeholder="Current password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                      <input 
                        v-model="passwordData.new"
                        type="password" 
                        placeholder="New password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                      <input 
                        v-model="passwordData.confirm"
                        type="password" 
                        placeholder="Confirm new password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                      <BaseButton 
                        variant="primary" 
                        size="md"
                        @click="changePassword"
                        class="flex items-center"
                      >
                        <i class="fas fa-key mr-2"></i>
                        Change Password
                      </BaseButton>
                    </div>
                  </div>

                  <div class="pt-4 border-t border-gray-200">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p class="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <BaseButton 
                        variant="outline" 
                        size="sm"
                        @click="setup2FA"
                      >
                        {{ settings.twoFactorEnabled ? 'Disable' : 'Enable' }}
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                <BaseButton 
                  variant="outline" 
                  size="md"
                  @click="resetSettings"
                >
                  Reset
                </BaseButton>
                <BaseButton 
                  variant="primary" 
                  size="md"
                  @click="saveSettings"
                  class="flex items-center"
                >
                  <i class="fas fa-save mr-2"></i>
                  Save Changes
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <BaseButton 
            variant="outline" 
            size="md"
            @click="showDeleteConfirmation = false"
          >
            Cancel
          </BaseButton>
          <BaseButton 
            variant="danger" 
            size="md"
            @click="deleteAccount"
          >
            Delete Account
          </BaseButton>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import PageLayout from '../layouts/PageLayout.vue'
import BaseButton from '../components/buttons/BaseButton.vue'

const authStore = useAuthStore()
const activeSection = ref('account')
const showDeleteConfirmation = ref(false)

const sections = [
  { id: 'account', name: 'Account', icon: 'fas fa-user' },
  { id: 'notifications', name: 'Notifications', icon: 'fas fa-bell' },
  { id: 'privacy', name: 'Privacy', icon: 'fas fa-shield-alt' },
  { id: 'security', name: 'Security', icon: 'fas fa-lock' }
]

const settings = reactive({
  username: '',
  email: '',
  language: 'en',
  emailNotifications: true,
  pushNotifications: false,
  newAnnouncementNotifications: true,
  profileVisibility: 'public',
  showContactInfo: true,
  twoFactorEnabled: false
})

const passwordData = reactive({
  current: '',
  new: '',
  confirm: ''
})

onMounted(() => {
  // Load user settings
  const user = authStore.user
  if (user) {
    settings.username = user.name || ''
    settings.email = user.email || ''
  }
})

const saveSettings = async () => {
  try {
    // TODO: Implement settings save API call
    console.log('Saving settings:', settings)
    // Show success message
  } catch (error) {
    console.error('Error saving settings:', error)
    // Show error message
  }
}

const resetSettings = () => {
  // Reset to default values
  Object.assign(settings, {
    emailNotifications: true,
    pushNotifications: false,
    newAnnouncementNotifications: true,
    profileVisibility: 'public',
    showContactInfo: true,
    twoFactorEnabled: false
  })
}

const changePassword = async () => {
  if (passwordData.new !== passwordData.confirm) {
    // Show error: passwords don't match
    return
  }
  
  try {
    // TODO: Implement password change API call
    console.log('Changing password')
    // Clear password fields
    Object.assign(passwordData, { current: '', new: '', confirm: '' })
    // Show success message
  } catch (error) {
    console.error('Error changing password:', error)
    // Show error message
  }
}

const setup2FA = async () => {
  try {
    // TODO: Implement 2FA setup
    settings.twoFactorEnabled = !settings.twoFactorEnabled
    console.log('2FA toggled:', settings.twoFactorEnabled)
  } catch (error) {
    console.error('Error setting up 2FA:', error)
  }
}

const deleteAccount = async () => {
  try {
    // TODO: Implement account deletion API call
    console.log('Deleting account')
    showDeleteConfirmation.value = false
    // Logout and redirect
    await authStore.logout()
  } catch (error) {
    console.error('Error deleting account:', error)
  }
}
</script>

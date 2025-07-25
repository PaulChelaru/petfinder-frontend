<template>
  <PageLayout>
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Enhanced Alerts Demo</h1>
          <p class="text-lg text-gray-600">
            Showcase of the improved toast notification system with various features
          </p>
        </div>

        <!-- Demo Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Basic Toasts -->
          <GenericCard title="Basic Alerts">
            <div class="space-y-3">
              <ActionButton 
                @click="showBasicSuccess"
                variant="primary"
                size="sm"
                class="w-full"
              >
                Success Alert
              </ActionButton>
              <ActionButton 
                @click="showBasicError"
                variant="danger"
                size="sm"
                class="w-full"
              >
                Error Alert
              </ActionButton>
              <ActionButton 
                @click="showBasicWarning"
                variant="warning"
                size="sm"
                class="w-full"
              >
                Warning Alert
              </ActionButton>
              <ActionButton 
                @click="showBasicInfo"
                variant="info"
                size="sm"
                class="w-full"
              >
                Info Alert
              </ActionButton>
            </div>
          </GenericCard>

          <!-- Toasts with Actions -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">With Actions</h3>
            <div class="space-y-3">
              <BaseButton 
                @click="showActionSuccess"
                variant="primary"
                size="sm"
                class="w-full"
              >
                Success with Action
              </BaseButton>
              <BaseButton 
                @click="showActionError"
                variant="outline"
                size="sm"
                class="w-full text-red-600 border-red-600 hover:bg-red-50"
              >
                Error with Retry
              </BaseButton>
              <BaseButton 
                @click="showMultipleActions"
                variant="outline"
                size="sm"
                class="w-full text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                Multiple Actions
              </BaseButton>
            </div>
          </div>

          <!-- Persistent Toasts -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Persistent Alerts</h3>
            <div class="space-y-3">
              <BaseButton 
                @click="showCriticalError"
                variant="outline"
                size="sm"
                class="w-full text-red-600 border-red-600 hover:bg-red-50"
              >
                Critical Error
              </BaseButton>
              <BaseButton 
                @click="showPersistentInfo"
                variant="outline"
                size="sm"
                class="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Persistent Info
              </BaseButton>
              <BaseButton 
                @click="clearAllToasts"
                variant="outline"
                size="sm"
                class="w-full text-gray-600 border-gray-600 hover:bg-gray-50"
              >
                Clear All
              </BaseButton>
            </div>
          </div>

          <!-- Long Duration -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Custom Duration</h3>
            <div class="space-y-3">
              <BaseButton 
                @click="showQuickToast"
                variant="outline"
                size="sm"
                class="w-full text-green-600 border-green-600 hover:bg-green-50"
              >
                Quick (2s)
              </BaseButton>
              <BaseButton 
                @click="showLongToast"
                variant="outline"
                size="sm"
                class="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                Long (10s)
              </BaseButton>
            </div>
          </div>

          <!-- Complex Examples -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Real-world Examples</h3>
            <div class="space-y-3">
              <BaseButton 
                @click="showFileUpload"
                variant="primary"
                size="sm"
                class="w-full"
              >
                File Upload Success
              </BaseButton>
              <BaseButton 
                @click="showConnectionError"
                variant="outline"
                size="sm"
                class="w-full text-red-600 border-red-600 hover:bg-red-50"
              >
                Connection Error
              </BaseButton>
              <BaseButton 
                @click="showUpdateAvailable"
                variant="outline"
                size="sm"
                class="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50"
              >
                Update Available
              </BaseButton>
            </div>
          </div>

          <!-- Stress Test -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Stress Test</h3>
            <div class="space-y-3">
              <BaseButton 
                @click="showMultipleToasts"
                variant="outline"
                size="sm"
                class="w-full text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                Show 5 Toasts
              </BaseButton>
              <BaseButton 
                @click="showSequentialToasts"
                variant="outline"
                size="sm"
                class="w-full text-teal-600 border-teal-600 hover:bg-teal-50"
              >
                Sequential Toasts
              </BaseButton>
            </div>
          </div>

        </div>

        <!-- Features List -->
        <div class="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Enhanced Features</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-900">✨ Visual Enhancements</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Beautiful glassmorphism design</li>
                <li>• Progress bar indicators</li>
                <li>• Smooth animations</li>
                <li>• Modern icons</li>
                <li>• Hover effects</li>
              </ul>
            </div>
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-900">⚡ Functionality</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Action buttons</li>
                <li>• Persistent alerts</li>
                <li>• Custom durations</li>
                <li>• Auto-dismiss</li>
                <li>• Stacking system</li>
              </ul>
            </div>
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-900">♿ Accessibility</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• ARIA attributes</li>
                <li>• Screen reader support</li>
                <li>• Keyboard navigation</li>
                <li>• Focus management</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/layout/PageLayout.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

// Basic toast examples
const showBasicSuccess = () => {
  toastStore.success('Pet successfully registered!')
}

const showBasicError = () => {
  toastStore.error('Failed to load pet data')
}

const showBasicWarning = () => {
  toastStore.warning('Your session will expire in 5 minutes')
}

const showBasicInfo = () => {
  toastStore.info('New pets available for adoption')
}

// Toasts with actions
const showActionSuccess = () => {
  toastStore.success({
    title: 'Pet Profile Updated',
    message: 'Your pet\'s information has been successfully saved.',
    actions: [
      {
        label: 'View Profile',
        primary: true,
        handler: () => console.log('Navigate to profile')
      }
    ]
  })
}

const showActionError = () => {
  toastStore.error({
    title: 'Upload Failed',
    message: 'Could not upload pet photo. Please try again.',
    actions: [
      {
        label: 'Retry',
        primary: true,
        handler: () => showBasicSuccess()
      },
      {
        label: 'Cancel',
        primary: false,
        handler: () => console.log('Upload cancelled')
      }
    ]
  })
}

const showMultipleActions = () => {
  toastStore.info({
    title: 'New Match Found!',
    message: 'We found a potential match for your lost pet.',
    actions: [
      {
        label: 'View Match',
        primary: true,
        handler: () => console.log('View match')
      },
      {
        label: 'Contact Owner',
        primary: false,
        handler: () => console.log('Contact owner')
      },
      {
        label: 'Dismiss',
        primary: false,
        handler: () => console.log('Dismissed')
      }
    ]
  })
}

// Persistent toasts
const showCriticalError = () => {
  toastStore.critical({
    title: 'System Error',
    message: 'A critical error occurred. Please contact support if this persists.',
    actions: [
      {
        label: 'Contact Support',
        primary: true,
        handler: () => console.log('Contact support')
      },
      {
        label: 'Reload Page',
        primary: false,
        handler: () => window.location.reload()
      }
    ]
  })
}

const showPersistentInfo = () => {
  toastStore.add({
    type: 'info',
    title: 'Maintenance Notice',
    message: 'Scheduled maintenance will begin in 30 minutes.',
    persistent: true,
    actions: [
      {
        label: 'Learn More',
        primary: false,
        handler: () => console.log('Learn more')
      },
      {
        label: 'Dismiss',
        primary: false
      }
    ]
  })
}

// Custom duration
const showQuickToast = () => {
  toastStore.success({
    message: 'Quick notification!',
    duration: 2000
  })
}

const showLongToast = () => {
  toastStore.warning({
    title: 'Extended Warning',
    message: 'This notification will stay for 10 seconds.',
    duration: 10000
  })
}

// Real-world examples
const showFileUpload = () => {
  toastStore.success({
    title: 'Photo Uploaded Successfully',
    message: 'Your pet\'s photo has been added to their profile.',
    actions: [
      {
        label: 'View Gallery',
        primary: true,
        handler: () => console.log('View gallery')
      }
    ]
  })
}

const showConnectionError = () => {
  toastStore.error({
    title: 'Connection Lost',
    message: 'Unable to connect to the server. Please check your internet connection.',
    persistent: true,
    actions: [
      {
        label: 'Retry Connection',
        primary: true,
        handler: () => {
          toastStore.removeMessage
          toastStore.info('Attempting to reconnect...')
        }
      },
      {
        label: 'Work Offline',
        primary: false,
        handler: () => console.log('Work offline')
      }
    ]
  })
}

const showUpdateAvailable = () => {
  toastStore.info({
    title: 'Update Available',
    message: 'A new version of PetFinder is available with improved features.',
    actions: [
      {
        label: 'Update Now',
        primary: true,
        handler: () => console.log('Update app')
      },
      {
        label: 'Later',
        primary: false,
        handler: () => console.log('Update later')
      }
    ]
  })
}

// Stress tests
const showMultipleToasts = () => {
  const types = ['success', 'error', 'warning', 'info']
  const messages = [
    'First notification',
    'Second notification', 
    'Third notification',
    'Fourth notification',
    'Fifth notification'
  ]
  
  messages.forEach((message, index) => {
    setTimeout(() => {
      const type = types[index % types.length]
      toastStore[type](message)
    }, index * 200)
  })
}

const showSequentialToasts = () => {
  toastStore.info('Step 1: Starting process...')
  
  setTimeout(() => {
    toastStore.info('Step 2: Processing data...')
  }, 1500)
  
  setTimeout(() => {
    toastStore.warning('Step 3: Validating...')
  }, 3000)
  
  setTimeout(() => {
    toastStore.success('Step 4: Process completed!')
  }, 4500)
}

const clearAllToasts = () => {
  toastStore.clearAll()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Notification Preferences</h3>
      <ActionButton
        v-if="!isEditing"
        variant="outline"
        size="sm"
        @click="startEditing"
      >
        Edit
      </ActionButton>
    </div>

    <div class="space-y-4">
      <!-- Email Notifications -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-gray-700">Email Notifications</label>
          <p class="text-xs text-gray-500">Receive updates about your announcements via email</p>
        </div>
        <div class="flex items-center">
          <input
            v-model="localPreferences.email"
            type="checkbox"
            :disabled="!isEditing"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Push Notifications -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-gray-700">Push Notifications</label>
          <p class="text-xs text-gray-500">Get instant notifications in your browser</p>
        </div>
        <div class="flex items-center">
          <input
            v-model="localPreferences.push"
            type="checkbox"
            :disabled="!isEditing"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
        </div>
      </div>

      <!-- SMS Notifications -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-gray-700">SMS Notifications</label>
          <p class="text-xs text-gray-500">Receive text messages for important updates</p>
        </div>
        <div class="flex items-center">
          <input
            v-model="localPreferences.sms"
            type="checkbox"
            :disabled="!isEditing"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Marketing Emails -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-gray-700">Marketing Emails</label>
          <p class="text-xs text-gray-500">Receive tips and news about pet care</p>
        </div>
        <div class="flex items-center">
          <input
            v-model="localPreferences.marketing"
            type="checkbox"
            :disabled="!isEditing"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
        </div>
      </div>
    </div>

    <!-- Action buttons when editing -->
    <div v-if="isEditing" class="flex justify-end space-x-2 pt-4 border-t">
      <ActionButton
        variant="outline"
        size="sm"
        @click="cancelEditing"
        :disabled="saving"
      >
        Cancel
      </ActionButton>
      <ActionButton
        variant="primary"
        size="sm"
        @click="savePreferences"
        :loading="saving"
      >
        Save Changes
      </ActionButton>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import ActionButton from '../buttons/ActionButton.vue'

const props = defineProps({
  preferences: {
    type: Object,
    default: () => ({
      email: true,
      push: true,
      sms: false,
      marketing: false
    })
  }
})

const emit = defineEmits(['update', 'save'])

// Local state
const isEditing = ref(false)
const saving = ref(false)
const localPreferences = reactive({ ...props.preferences })

// Watch for prop changes
watch(() => props.preferences, (newPreferences) => {
  Object.assign(localPreferences, newPreferences)
}, { deep: true })

// Methods
const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  // Reset to original values
  Object.assign(localPreferences, props.preferences)
  isEditing.value = false
}

const savePreferences = async () => {
  saving.value = true
  
  try {
    // Emit the save event with new preferences
    emit('save', { ...localPreferences })
    emit('update', { ...localPreferences })
    isEditing.value = false
  } catch (error) {
    console.error('Failed to save preferences:', error)
    // Could emit an error event here
  } finally {
    saving.value = false
  }
}
</script>

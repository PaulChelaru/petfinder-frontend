<template>
  <BaseCard variant="elevated" class="profile-card">
    <template #header>
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <i class="fas fa-user text-blue-600 text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ user?.name || 'User' }}</h3>
          <p class="text-gray-600">{{ user?.email || 'user@example.com' }}</p>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ stats.announcements }}</div>
          <div class="text-sm text-gray-600">Announcements</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">{{ stats.resolved }}</div>
          <div class="text-sm text-gray-600">Resolved</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-600">{{ stats.helped }}</div>
          <div class="text-sm text-gray-600">Pets Helped</div>
        </div>
      </div>

      <!-- Member Since -->
      <div class="text-center pt-4 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Member since {{ formatDate(user?.createdAt) }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex space-x-2">
        <button
          @click="$emit('edit-profile')"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </button>
        <button
          @click="$emit('view-profile')"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from './BaseCard.vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  stats: {
    type: Object,
    default: () => ({
      announcements: 0,
      resolved: 0,
      helped: 0
    })
  }
})

defineEmits(['edit-profile', 'view-profile'])

const formatDate = (dateString) => {
  if (!dateString) return '2024'
  const date = new Date(dateString)
  return date.getFullYear()
}
</script>
<template>
  <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm border role-badge"
        :class="roleClass">
    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
      <path v-if="role === 'admin'" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      <path v-else-if="role === 'volunteer'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      <path v-else d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
    {{ roleDisplayName }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: {
    type: String,
    default: 'user'
  }
})

const roleClass = computed(() => {
  switch (props.role) {
    case 'admin':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'volunteer':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    default:
      return 'bg-green-50 text-green-700 border-green-200'
  }
})

const roleDisplayName = computed(() => {
  switch (props.role) {
    case 'admin':
      return 'Administrator'
    case 'volunteer':
      return 'Volunteer'
    default:
      return 'User'
  }
})
</script>

<style scoped>
/* Role badge animation */
.role-badge {
  transition: all 0.2s ease-in-out;
}

.role-badge:hover {
  transform: scale(1.02);
}
</style>

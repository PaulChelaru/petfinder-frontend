<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <LoadingSpinner :size="spinnerSize" />
        <p v-if="text" class="mt-4 text-gray-600">{{ text }}</p>
      </div>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  spinnerSize: {
    type: String,
    default: 'w-8 h-8'
  }
})
</script>

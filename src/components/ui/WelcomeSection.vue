<template>
  <div class="text-center mb-12">
    <div class="w-24 h-24 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
      <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
    <h1 class="text-4xl font-bold text-gray-900 mb-2">
      {{ title }}
    </h1>
    <p class="text-lg text-gray-600">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})
</script>

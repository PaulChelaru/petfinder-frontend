<template>
  <div class="text-center mb-12">
    <div class="w-24 h-24 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
      <i class="fas fa-user w-12 h-12 text-white text-5xl"></i>
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

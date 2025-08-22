<template>
  <div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <i :class="iconClass" class="mr-3 text-lg"></i>
    <div class="flex-1">
      <div class="text-sm font-medium text-gray-900">{{ label }}</div>
      <a 
        :href="href" 
        class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ value }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['phone', 'email'].includes(value)
  },
  value: {
    type: String,
    required: true
  }
})

const iconClass = computed(() => {
  return props.type === 'phone' ? 'fas fa-phone text-green-600' : 'fas fa-envelope text-blue-600'
})

const label = computed(() => {
  return props.type === 'phone' ? 'Phone' : 'Email'
})

const href = computed(() => {
  return props.type === 'phone' ? `tel:${props.value}` : `mailto:${props.value}`
})
</script>

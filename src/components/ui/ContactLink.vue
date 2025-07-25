<template>
  <div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
    <component :is="icon" class="w-5 h-5 text-gray-500 mr-3" />
    <a :href="href" class="text-blue-600 hover:text-blue-800 font-semibold flex-1">
      {{ value }}
    </a>
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
  },
  icon: {
    type: [String, Object],
    required: true
  }
})

const href = computed(() => {
  return props.type === 'phone' ? `tel:${props.value}` : `mailto:${props.value}`
})
</script>

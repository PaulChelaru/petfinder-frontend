<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Header with icon and title -->
    <div class="flex items-center mb-4">
      <div :class="iconBgClass" class="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
        <component :is="icon" :class="iconClass" class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    </div>
    
    <!-- Content slot -->
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: [String, Object],
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'red', 'purple', 'yellow', 'gray'].includes(value)
  }
})

const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
    yellow: 'bg-yellow-50',
    gray: 'bg-gray-50'
  }
  return colors[props.color]
})

const iconClass = computed(() => {
  const colors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    gray: 'text-gray-500'
  }
  return colors[props.color]
})
</script>

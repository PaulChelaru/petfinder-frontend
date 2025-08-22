<template>
  <BaseCard variant="elevated" class="quick-action-card hover:scale-105 transition-all cursor-pointer">
    <div @click="$emit('click')" class="text-center p-6">
      <div class="mb-4">
        <div :class="iconClasses" class="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
          <i :class="icon + ' text-2xl'"></i>
        </div>
      </div>
      
      <h3 class="font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ description }}</p>
      
      <div v-if="badge" class="mt-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ badge }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from './BaseCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'red', 'yellow', 'purple'].includes(value)
  },
  badge: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const iconClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }
  return colors[props.color]
})
</script>
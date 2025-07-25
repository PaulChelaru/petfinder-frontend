<template>
  <BaseCard variant="elevated" class="hover:shadow-lg transition-shadow duration-200">
    <div class="p-6 text-center">
      <div class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" :class="iconClass">
        <svg class="w-6 h-6" :class="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="icon === 'add'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          <path v-else-if="icon === 'search'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-500 mb-4">{{ description }}</p>
      <BaseButton 
        :variant="buttonVariant" 
        size="sm" 
        full-width
        @click="$emit('click')"
      >
        {{ buttonText }}
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
    validator: (value) => ['add', 'search', 'action'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  buttonVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  }
})

defineEmits(['click'])

const iconClass = computed(() => {
  switch (props.icon) {
    case 'add':
      return 'bg-primary-100'
    case 'search':
      return 'bg-green-100'
    default:
      return 'bg-blue-100'
  }
})

const iconColorClass = computed(() => {
  switch (props.icon) {
    case 'add':
      return 'text-primary-600'
    case 'search':
      return 'text-green-600'
    default:
      return 'text-blue-600'
  }
})
</script>

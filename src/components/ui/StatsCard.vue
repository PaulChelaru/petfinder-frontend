<template>
  <GenericCard :variant="variant" :custom-classes="customClasses">
    <template #header v-if="$slots.header">
      <slot name="header" />
    </template>

    <div class="flex items-center">
      <!-- Icon/Avatar -->
      <div v-if="icon || avatar" class="flex-shrink-0 mr-4">
        <div v-if="avatar" class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <img v-if="avatar.src" :src="avatar.src" :alt="avatar.alt" class="w-12 h-12 rounded-full object-cover" />
          <span v-else class="text-lg font-semibold text-gray-600">{{ avatar.initials }}</span>
        </div>
        <div v-else-if="icon" :class="iconClasses">
          <component :is="icon" class="w-6 h-6" />
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div>
            <p v-if="title" :class="titleClasses">{{ title }}</p>
            <p v-if="subtitle" :class="subtitleClasses">{{ subtitle }}</p>
          </div>
          <div v-if="value || $slots.value" class="text-right">
            <slot name="value">
              <span :class="valueClasses">{{ value }}</span>
            </slot>
          </div>
        </div>
        
        <p v-if="description" :class="descriptionClasses">{{ description }}</p>
        
        <!-- Progress bar if needed -->
        <div v-if="progress !== null" class="mt-2">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer actions -->
    <template #actions v-if="$slots.actions">
      <slot name="actions" />
    </template>
  </GenericCard>
</template>

<script setup>
import { computed } from 'vue'
import GenericCard from '../cards/GenericCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  icon: {
    type: [String, Object],
    default: null
  },
  avatar: {
    type: Object,
    default: null,
    validator: (value) => {
      if (!value) return true
      return typeof value === 'object' && (value.src || value.initials)
    }
  },
  progress: {
    type: Number,
    default: null,
    validator: (value) => value === null || (value >= 0 && value <= 100)
  },
  customClasses: {
    type: String,
    default: ''
  }
})

const iconClasses = computed(() => {
  const variants = {
    default: 'w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600',
    success: 'w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600',
    warning: 'w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600',
    danger: 'w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600',
    info: 'w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'
  }
  return variants[props.variant]
})

const titleClasses = computed(() => {
  return 'text-lg font-semibold text-gray-900'
})

const subtitleClasses = computed(() => {
  return 'text-sm text-gray-500'
})

const descriptionClasses = computed(() => {
  return 'text-sm text-gray-600 mt-1'
})

const valueClasses = computed(() => {
  const variants = {
    default: 'text-2xl font-bold text-gray-900',
    success: 'text-2xl font-bold text-green-600',
    warning: 'text-2xl font-bold text-yellow-600',
    danger: 'text-2xl font-bold text-red-600',
    info: 'text-2xl font-bold text-blue-600'
  }
  return variants[props.variant]
})
</script>

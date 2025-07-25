<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClasses,
      sizeClasses
    ]"
  >
    <component v-if="icon" :is="icon" :class="iconClasses" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'lost', 'found', 'resolved', 'primary', 'secondary', 'success', 'warning', 'danger', 'orange'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: {
    type: [String, Object],
    default: null
  }
})

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    lost: 'bg-red-100 text-red-800',
    found: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800'
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  return sizes[props.size]
})

const iconClasses = computed(() => {
  const sizes = {
    sm: 'w-3 h-3 mr-1',
    md: 'w-3 h-3 mr-1.5',
    lg: 'w-4 h-4 mr-1.5'
  }
  return sizes[props.size]
})
</script>

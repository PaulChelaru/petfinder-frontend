<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses,
      sizeClasses,
      {
        'opacity-50 cursor-not-allowed': disabled,
        'hover:scale-105 active:scale-95': !disabled && !loading
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div class="flex items-center justify-center gap-2">
      <LoadingSpinner v-if="loading" :size="iconSize" />
      <component v-else-if="icon" :is="icon" :class="iconClasses" />
      <span v-if="$slots.default"><slot /></span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [String, Object],
    default: null
  }
})

defineEmits(['click'])

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  return sizes[props.size]
})

const iconSize = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizes[props.size]
})

const iconClasses = computed(() => {
  return iconSize.value
})
</script>

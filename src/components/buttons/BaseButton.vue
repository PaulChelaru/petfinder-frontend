<template>
  <button
    :class="[
      'btn',
      'flex items-center justify-center',
      variantClass,
      sizeClass,
      {
        'opacity-50 cursor-not-allowed': disabled,
        'w-full': fullWidth
      }
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="animate-spin mr-2">⟳</span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning', 'outline', 'outline-white'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])

const variantClass = computed(() => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning',
    outline: 'btn-outline',
    'outline-white': 'btn-outline-white'
  }
  return variants[props.variant]
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md', 
    lg: 'btn-lg',
    xl: 'btn-xl'
  }
  return sizes[props.size]
})
</script>

<style scoped>
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.btn-md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.btn-xl {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  border-radius: 0.75rem;
}
</style>

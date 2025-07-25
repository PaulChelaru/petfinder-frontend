<template>
  <div :class="[
    'card transition-all duration-300 ease-in-out',
    variantClass,
    {
      'card-hover transform hover:scale-105 hover:shadow-xl cursor-pointer': hoverable,
      'backdrop-blur-sm bg-white/95': variant === 'glass'
    }
  ]">
    <div v-if="$slots.header" class="card-header border-b border-gray-100 bg-gray-50/50">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer border-t border-gray-100 bg-gray-50/50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'elevated', 'glass'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})

const variantClass = computed(() => {
  const variants = {
    default: 'card-default',
    bordered: 'card-bordered',
    elevated: 'card-elevated shadow-lg',
    glass: 'card-glass shadow-xl border border-white/20'
  }
  return variants[props.variant]
})
</script>

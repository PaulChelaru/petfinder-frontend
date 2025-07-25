<template>
  <div :class="sectionClasses">
    <div class="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <!-- Main Content -->
      <div class="space-y-8">
        <h2 :class="titleClasses">
          {{ title }}
        </h2>
        <p :class="descriptionClasses">
          {{ description }}
        </p>
        
        <!-- Action Button -->
        <div class="flex justify-center">
          <BaseButton 
            :variant="buttonVariant" 
            size="xl"
            class="transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
          >
            <slot>
              {{ buttonText }}
            </slot>
          </BaseButton>
        </div>
        
        <!-- Additional Info -->
        <div v-if="showSubtext" :class="subtextClasses">
          <slot name="subtext">
            {{ subtext }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '../buttons/BaseButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Every Second Counts for Lost Pets'
  },
  description: {
    type: String,
    default: 'Join our community of pet lovers dedicated to reuniting families and saving lives through adoption.'
  },
  buttonText: {
    type: String,
    default: 'Start Helping Pets Today'
  },
  buttonVariant: {
    type: String,
    default: 'secondary'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'dark'].includes(value)
  },
  subtext: {
    type: String,
    default: ''
  },
  showSubtext: {
    type: Boolean,
    default: false
  }
})

const sectionClasses = computed(() => {
  const baseClasses = 'py-20'
  const variantClasses = {
    primary: 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900',
    secondary: 'bg-gradient-to-br from-gray-900 to-gray-800',
    dark: 'bg-gray-900'
  }
  return `${baseClasses} ${variantClasses[props.variant]}`
})

const titleClasses = computed(() => {
  return props.variant === 'primary' || props.variant === 'secondary' || props.variant === 'dark'
    ? 'text-4xl md:text-5xl font-bold text-white mb-6'
    : 'text-4xl md:text-5xl font-bold text-gray-900 mb-6'
})

const descriptionClasses = computed(() => {
  return props.variant === 'primary' || props.variant === 'secondary' || props.variant === 'dark'
    ? 'text-xl md:text-2xl text-white/90 max-w-3xl mx-auto'
    : 'text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto'
})

const subtextClasses = computed(() => {
  return props.variant === 'primary' || props.variant === 'secondary' || props.variant === 'dark'
    ? 'text-sm text-white/70'
    : 'text-sm text-gray-500'
})
</script>

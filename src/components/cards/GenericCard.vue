<template>
  <div
    :class="[
      'relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
      {
        'border-l-4 border-red-500': variant === 'lost',
        'border-l-4 border-yellow-500': variant === 'found',
        'border-l-4 border-green-500': variant === 'resolved',
        'border-l-4 border-blue-500': variant === 'default'
      },
      customClasses
    ]"
  >
    <!-- Header slot cu background colorat -->
    <div 
      v-if="$slots.header"
      :class="[
        'px-4 py-3 text-white font-medium',
        {
          'bg-red-500': variant === 'lost',
          'bg-yellow-500': variant === 'found', 
          'bg-green-500': variant === 'resolved',
          'bg-blue-500': variant === 'default'
        }
      ]"
    >
      <slot name="header" />
    </div>

    <!-- Content principal -->
    <div class="p-4">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <slot name="footer" />
    </div>

    <!-- Actions slot -->
    <div v-if="$slots.actions" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <div class="flex justify-end space-x-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'lost', 'found', 'resolved'].includes(value)
  },
  customClasses: {
    type: String,
    default: ''
  }
})
</script>

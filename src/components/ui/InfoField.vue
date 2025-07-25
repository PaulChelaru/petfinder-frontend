<template>
  <div v-if="value" :class="containerClass" class="flex flex-col">
    <span class="text-sm text-gray-500 mb-1">{{ label }}</span>
    <span class="font-semibold text-gray-900" :class="valueClass">{{ formattedValue }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number, Boolean],
    default: null
  },
  span: {
    type: Number,
    default: 1,
    validator: (value) => [1, 2].includes(value)
  },
  capitalize: {
    type: Boolean,
    default: false
  }
})

const containerClass = computed(() => {
  return props.span === 2 ? 'col-span-2' : ''
})

const valueClass = computed(() => {
  return props.capitalize ? 'capitalize' : ''
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) return ''
  return String(props.value)
})
</script>

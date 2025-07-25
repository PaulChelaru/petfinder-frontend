<template>
  <div class="relative">
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :class="[
        'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
        {
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !error,
          'border-red-500 focus:border-red-500 focus:ring-red-500': error,
          'bg-gray-100 cursor-not-allowed': disabled,
          'bg-gray-50': readonly
        },
        sizeClasses,
        customClasses
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @keydown="$emit('keydown', $event)"
    />
    
    <!-- Icon slot -->
    <div v-if="$slots.icon" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <slot name="icon" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  customClasses: {
    type: String,
    default: ''
  }
})

const inputId = computed(() => {
  return `input-${Math.random().toString(36).substr(2, 9)}`
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  }
  return sizes[props.size]
})

defineEmits(['update:modelValue', 'blur', 'focus', 'keydown'])
</script>

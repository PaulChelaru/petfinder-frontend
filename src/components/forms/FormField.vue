<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="inputId"
      :class="[
        'block text-sm font-medium',
        {
          'text-gray-700': !error,
          'text-red-700': error
        }
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <FormInput
      :id="inputId"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :error="error"
      :size="size"
      :autocomplete="autocomplete"
      :custom-classes="customClasses"
      @update:model-value="$emit('update:modelValue', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @keydown="$emit('keydown', $event)"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>
    </FormInput>
    
    <p v-if="error && errorMessage" class="text-red-600 text-xs mt-1">
      {{ errorMessage }}
    </p>
    
    <p v-if="helpText && !error" class="text-gray-500 text-xs mt-1">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FormInput from './FormInput.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
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
  errorMessage: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
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
  return `field-${Math.random().toString(36).substr(2, 9)}`
})

defineEmits(['update:modelValue', 'blur', 'focus', 'keydown'])
</script>

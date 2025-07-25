<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="relative mt-1">
      <input
        :id="id"
        v-model="inputValue"
        :class="[
          'form-input transition-all duration-200',
          {
            'form-input-error border-red-300 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500': hasError,
            'form-input-success border-green-300 focus:ring-green-500 focus:border-green-500': !hasError && inputValue && touched,
            'pl-10': hasIcon,
            'pr-10': hasError || (!hasError && inputValue && touched)
          }
        ]"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
      />
      <!-- Left icon -->
      <div v-if="hasIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <div :class="[
          'transition-colors duration-200',
          hasError ? 'text-red-400' : (!hasError && inputValue && touched ? 'text-green-400' : 'text-gray-400')
        ]">
          <slot name="icon" />
        </div>
      </div>
      <!-- Right status icon -->
      <div v-if="hasError || (!hasError && inputValue && touched)" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <!-- Error icon -->
        <svg v-if="hasError" class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <!-- Success icon -->
        <svg v-else-if="!hasError && inputValue && touched" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <div v-if="error" class="form-error flex items-center mt-2">
      <svg class="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div>
    <p v-else-if="hint" class="form-hint mt-2 flex items-center">
      <svg class="h-4 w-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed, useSlots, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
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
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'input'])

const slots = useSlots()
const touched = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const hasError = computed(() => !!props.error)
const hasIcon = computed(() => !!slots.icon)

const handleBlur = (event) => {
  touched.value = true
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleInput = (event) => {
  emit('input', event)
}
</script>

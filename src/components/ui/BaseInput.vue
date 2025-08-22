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
        <i v-if="hasError" class="fas fa-exclamation-circle h-5 w-5 text-red-500"></i>
        <!-- Success icon -->
        <i v-else-if="!hasError && inputValue && touched" class="fas fa-check-circle h-5 w-5 text-green-500"></i>
      </div>
    </div>
    <div v-if="error" class="form-error flex items-center mt-2">
      <i class="fas fa-exclamation-circle h-4 w-4 text-red-500 mr-1"></i>
      {{ error }}
    </div>
    <p v-else-if="hint" class="form-hint mt-2 flex items-center">
      <i class="fas fa-info-circle h-4 w-4 text-gray-400 mr-1"></i>
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

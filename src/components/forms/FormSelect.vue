<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="selectId"
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
    
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full px-3 py-2 pr-10 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none bg-white',
          {
            'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400': !error,
            'border-red-500 focus:border-red-500 focus:ring-red-500': error,
            'bg-gray-100 cursor-not-allowed opacity-50': disabled
          },
          sizeClasses,
          customClasses
        ]"
        @change="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Custom dropdown icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <i class="fas fa-chevron-down w-4 h-4 text-gray-400"></i>
      </div>
    </div>
    
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

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(option => 
        typeof option === 'object' && 
        'value' in option && 
        'label' in option
      )
    }
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
  customClasses: {
    type: String,
    default: ''
  }
})

const selectId = computed(() => {
  return `select-${Math.random().toString(36).substr(2, 9)}`
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  }
  return sizes[props.size]
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

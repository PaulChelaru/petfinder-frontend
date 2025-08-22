<template>
  <div class="info-field" :class="containerClasses">
    <div v-if="icon || $slots.icon" class="info-field-icon" :class="iconClasses">
      <slot name="icon">
        <i :class="icon" v-if="icon"></i>
      </slot>
    </div>
    
    <div class="info-field-content">
      <div v-if="label" class="info-field-label" :class="labelClasses">
        {{ label }}
      </div>
      
      <div class="info-field-value" :class="valueClasses">
        <slot>
          {{ value || emptyText }}
        </slot>
      </div>
      
      <div v-if="description" class="info-field-description" :class="descriptionClasses">
        {{ description }}
      </div>
    </div>
    
    <div v-if="$slots.action" class="info-field-action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'bordered', 'highlighted'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  emptyText: {
    type: String,
    default: 'Not specified'
  },
  copyable: {
    type: Boolean,
    default: false
  }
})

const containerClasses = computed(() => {
  const base = 'info-field'
  const variants = {
    default: 'flex items-start space-x-3',
    compact: 'flex items-center space-x-2',
    bordered: 'flex items-start space-x-3 p-4 border border-gray-200 rounded-lg',
    highlighted: 'flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg'
  }
  
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})

const iconClasses = computed(() => {
  const variants = {
    default: 'text-gray-500 mt-0.5',
    compact: 'text-gray-500',
    bordered: 'text-blue-600 mt-0.5',
    highlighted: 'text-blue-600 mt-0.5'
  }
  
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return `${variants[props.variant]} ${sizes[props.size]}`
})

const labelClasses = computed(() => {
  const base = 'font-medium'
  const variants = {
    default: 'text-gray-700',
    compact: 'text-gray-600',
    bordered: 'text-gray-800',
    highlighted: 'text-blue-800'
  }
  
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})

const valueClasses = computed(() => {
  const variants = {
    default: 'text-gray-900',
    compact: 'text-gray-800',
    bordered: 'text-gray-900',
    highlighted: 'text-gray-900'
  }
  
  const emptyClass = (!props.value && props.value !== 0) ? 'text-gray-400 italic' : ''
  
  return `${variants[props.variant]} ${emptyClass}`
})

const descriptionClasses = computed(() => {
  const variants = {
    default: 'text-gray-500',
    compact: 'text-gray-400',
    bordered: 'text-gray-600',
    highlighted: 'text-blue-700'
  }
  
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  return `${variants[props.variant]} ${sizes[props.size]} mt-1`
})

const copyToClipboard = () => {
  if (props.copyable && props.value) {
    navigator.clipboard.writeText(String(props.value)).then(() => {
      // TODO: Show success toast
      console.log('Copied to clipboard:', props.value)
    }).catch(err => {
      console.error('Failed to copy:', err)
    })
  }
}
</script>

<style scoped>
.info-field {
  transition: all 0.2s ease-in-out;
}

.info-field-content {
  flex: 1;
  min-width: 0; /* Allows text truncation if needed */
}

.info-field-value {
  word-break: break-word;
}

/* Hover effects for bordered and highlighted variants */
.info-field.bordered:hover,
.info-field.highlighted:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Copyable field styles */
.info-field.copyable {
  cursor: pointer;
}

.info-field.copyable:hover .info-field-value {
  text-decoration: underline;
}
</style>
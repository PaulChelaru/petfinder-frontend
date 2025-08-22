<template>
  <div class="loading-spinner" :class="sizeClasses">
    <div class="spinner" :class="colorClasses">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <p v-if="message" class="loading-message" :class="textColorClasses">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'gray'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400'
  }
  return colors[props.color]
})

const textColorClasses = computed(() => {
  const colors = {
    primary: 'text-gray-600',
    secondary: 'text-gray-500',
    white: 'text-white',
    gray: 'text-gray-400'
  }
  return colors[props.color]
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.spinner > div {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  display: inline-block;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

.spinner.text-blue-600 > div {
  background-color: #2563eb;
}

.spinner.text-gray-600 > div {
  background-color: #4b5563;
}

.spinner.text-white > div {
  background-color: #ffffff;
}

.spinner.text-gray-400 > div {
  background-color: #9ca3af;
}

.loading-message {
  margin-top: 0.5rem;
  font-weight: 500;
  text-align: center;
}

/* Size variations */
.text-sm .spinner > div {
  width: 6px;
  height: 6px;
}

.text-lg .spinner > div {
  width: 10px;
  height: 10px;
}

.text-xl .spinner > div {
  width: 12px;
  height: 12px;
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}

/* Overlay styles */
.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  backdrop-filter: blur(2px);
}
</style>
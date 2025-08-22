<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="closeModal"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    
    <!-- Modal container -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        :class="[
          'relative bg-white rounded-lg shadow-xl w-full transition-all',
          sizeClasses
        ]"
        @click.stop
      >
        <!-- Header -->
        <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center">
            <slot name="header">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            </slot>
          </div>
          <button
            v-if="closable"
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times w-6 h-6"></i>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6">
          <slot />
        </div>
        
        <!-- Footer -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  return sizes[props.size]
})

const closeModal = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}

// Previne scroll-ul în background când modalul este deschis
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Cleanup la unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

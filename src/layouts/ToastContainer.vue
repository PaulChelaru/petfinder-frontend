<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast" tag="div" class="space-y-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast',
            toastTypeClass(toast.type),
            toast.persistent ? 'toast-persistent' : ''
          ]"
          :role="toast.type === 'error' ? 'alert' : 'status'"
          :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
          :aria-labelledby="`toast-title-${toast.id}`"
          :aria-describedby="`toast-message-${toast.id}`"
        >
          <!-- Progress bar for non-persistent toasts -->
          <div 
            v-if="!toast.persistent" 
            class="toast-progress" 
            :class="`toast-progress-${toast.type}`"
            :style="{ animationDuration: `${toast.duration || 5000}ms` }"
          ></div>
          
          <div class="flex items-start p-4">
            <!-- Icon -->
            <div class="flex-shrink-0 toast-icon">
              <!-- Success Icon -->
              <div v-if="toast.type === 'success'" class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <!-- Error Icon -->
              <div v-else-if="toast.type === 'error'" class="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <!-- Warning Icon -->
              <div v-else-if="toast.type === 'warning'" class="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <!-- Info Icon -->
              <div v-else class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <!-- Content -->
            <div class="ml-3 flex-1 min-w-0">
              <p 
                v-if="toast.title" 
                :id="`toast-title-${toast.id}`"
                class="text-sm font-semibold leading-5"
              >
                {{ toast.title }}
              </p>
              <p 
                :id="`toast-message-${toast.id}`"
                class="text-sm leading-5 mt-1"
                :class="toast.title ? 'text-gray-600' : 'font-medium'"
              >
                {{ toast.message }}
              </p>
              
              <!-- Action buttons -->
              <div v-if="toast.actions && toast.actions.length" class="mt-3 flex space-x-2">
                <button
                  v-for="action in toast.actions"
                  :key="action.label"
                  @click="handleAction(action, toast.id)"
                  class="text-xs font-medium px-3 py-1.5 rounded-md transition-colors duration-200"
                  :class="action.primary ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            
            <!-- Close button -->
            <div class="ml-4 flex-shrink-0">
              <button
                @click="removeToast(toast.id)"
                class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                :class="closeButtonClass(toast.type)"
                :aria-label="'Close notification'"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const toasts = computed(() => toastStore.messages)

const removeToast = (id) => {
  toastStore.removeMessage(id)
}

const handleAction = (action, toastId) => {
  if (action.handler) {
    action.handler()
  }
  if (action.closeOnClick !== false) {
    removeToast(toastId)
  }
}

const toastTypeClass = (type) => {
  const classes = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: 'toast-info'
  }
  return classes[type] || classes.info
}

const closeButtonClass = (type) => {
  const classes = {
    success: 'text-green-400 hover:text-green-500 focus:ring-green-500',
    error: 'text-red-400 hover:text-red-500 focus:ring-red-500',
    warning: 'text-yellow-400 hover:text-yellow-500 focus:ring-yellow-500',
    info: 'text-blue-400 hover:text-blue-500 focus:ring-blue-500'
  }
  return classes[type] || classes.info
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  max-width: 420px;
  width: 100%;
}

.toast {
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 0.75rem;
  pointer-events: auto;
  overflow: hidden;
  backdrop-filter: blur(4px);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.75rem;
}

.toast-persistent {
  border-left-width: 4px;
}

.toast-success {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: rgba(34, 197, 94, 0.2);
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04);
}

.toast-success.toast-persistent {
  border-left-color: #10b981;
}

.toast-error {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: rgba(239, 68, 68, 0.2);
  box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04);
}

.toast-error.toast-persistent {
  border-left-color: #ef4444;
}

.toast-warning {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: rgba(245, 158, 11, 0.2);
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04);
}

.toast-warning.toast-persistent {
  border-left-color: #f59e0b;
}

.toast-info {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04);
}

.toast-info.toast-persistent {
  border-left-color: #3b82f6;
}

/* Progress bar */
.toast-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  transform-origin: left;
  animation: toast-progress linear forwards;
}

.toast-progress-success {
  background-color: #10b981;
}

.toast-progress-error {
  background-color: #ef4444;
}

.toast-progress-warning {
  background-color: #f59e0b;
}

.toast-progress-info {
  background-color: #3b82f6;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Toast animations */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Icon hover effects */
.toast-icon {
  transition: transform 0.2s ease;
}

.toast:hover .toast-icon {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    top: 1rem;
    max-width: none;
  }
  
  .toast {
    font-size: 0.875rem;
  }
}
</style>

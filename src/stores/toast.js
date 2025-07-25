import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const messages = ref([])

  const addMessage = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type,
      duration,
      visible: true
    }
    
    messages.value.push(toast)
    
    // Auto remove after duration (unless persistent)
    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id)
      }, duration)
    }
    
    return id
  }

  const removeMessage = (id) => {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  const showSuccess = (message, duration = 4000) => {
    return addMessage(message, 'success', duration)
  }

  const showError = (message, duration = 6000) => {
    return addMessage(message, 'error', duration)
  }

  const showWarning = (message, duration = 5000) => {
    return addMessage(message, 'warning', duration)
  }

  const showInfo = (message, duration = 5000) => {
    return addMessage(message, 'info', duration)
  }

  const clearAll = () => {
    messages.value = []
  }

  // Enhanced add method that accepts an object with more options
  const add = ({ 
    type = 'info', 
    title, 
    message, 
    duration = 5000,
    persistent = false,
    actions = [],
    sound = false
  }) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      title,
      message,
      type,
      duration: persistent ? 0 : duration,
      persistent,
      actions,
      visible: true
    }
    
    messages.value.push(toast)
    
    // Play sound if enabled
    if (sound && typeof window !== 'undefined' && window.Audio) {
      try {
        // You can add sound files to your public folder
        const audio = new Audio('/sounds/notification.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {
          // Ignore audio play errors (user interaction required, etc.)
        })
      } catch (error) {
        // Ignore audio errors
      }
    }
    
    // Auto remove after duration (unless persistent)
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeMessage(id)
      }, duration)
    }
    
    return id
  }

  // Convenience methods with better defaults
  const success = (options) => {
    if (typeof options === 'string') {
      return add({ message: options, type: 'success', duration: 4000 })
    }
    return add({ ...options, type: 'success', duration: options.duration || 4000 })
  }

  const error = (options) => {
    if (typeof options === 'string') {
      return add({ message: options, type: 'error', duration: 7000 })
    }
    return add({ ...options, type: 'error', duration: options.duration || 7000 })
  }

  const warning = (options) => {
    if (typeof options === 'string') {
      return add({ message: options, type: 'warning', duration: 5000 })
    }
    return add({ ...options, type: 'warning', duration: options.duration || 5000 })
  }

  const info = (options) => {
    if (typeof options === 'string') {
      return add({ message: options, type: 'info', duration: 5000 })
    }
    return add({ ...options, type: 'info', duration: options.duration || 5000 })
  }

  // Special method for critical errors that need user attention
  const critical = (options) => {
    if (typeof options === 'string') {
      return add({ 
        message: options, 
        type: 'error', 
        persistent: true,
        actions: [
          { label: 'Dismiss', primary: false }
        ]
      })
    }
    return add({ 
      ...options, 
      type: 'error', 
      persistent: true,
      actions: options.actions || [
        { label: 'Dismiss', primary: false }
      ]
    })
  }

  return {
    messages,
    add,
    addMessage,
    removeMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    success,
    error,
    warning,
    info,
    critical,
    clearAll
  }
})

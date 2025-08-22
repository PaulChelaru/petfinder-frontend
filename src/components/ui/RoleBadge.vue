<template>
  <span :class="badgeClasses">
    <i v-if="icon" :class="icon + ' mr-1'"></i>
    <slot>{{ displayText }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (value) => ['admin', 'moderator', 'user', 'premium', 'verified'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'solid',
    validator: (value) => ['solid', 'outline', 'subtle'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const roleConfig = computed(() => {
  const configs = {
    admin: {
      text: 'Admin',
      icon: 'fas fa-crown',
      colors: {
        solid: 'bg-red-600 text-white',
        outline: 'border-2 border-red-600 text-red-600 bg-transparent',
        subtle: 'bg-red-100 text-red-800'
      }
    },
    moderator: {
      text: 'Moderator',
      icon: 'fas fa-shield-alt',
      colors: {
        solid: 'bg-purple-600 text-white',
        outline: 'border-2 border-purple-600 text-purple-600 bg-transparent',
        subtle: 'bg-purple-100 text-purple-800'
      }
    },
    user: {
      text: 'User',
      icon: 'fas fa-user',
      colors: {
        solid: 'bg-gray-600 text-white',
        outline: 'border-2 border-gray-600 text-gray-600 bg-transparent',
        subtle: 'bg-gray-100 text-gray-800'
      }
    },
    premium: {
      text: 'Premium',
      icon: 'fas fa-star',
      colors: {
        solid: 'bg-yellow-600 text-white',
        outline: 'border-2 border-yellow-600 text-yellow-600 bg-transparent',
        subtle: 'bg-yellow-100 text-yellow-800'
      }
    },
    verified: {
      text: 'Verified',
      icon: 'fas fa-check-circle',
      colors: {
        solid: 'bg-green-600 text-white',
        outline: 'border-2 border-green-600 text-green-600 bg-transparent',
        subtle: 'bg-green-100 text-green-800'
      }
    }
  }
  
  return configs[props.role] || configs.user
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200'
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  const colorClasses = roleConfig.value.colors[props.variant]
  
  return `${baseClasses} ${sizeClasses[props.size]} ${colorClasses}`
})

const displayText = computed(() => {
  return roleConfig.value.text
})

const icon = computed(() => {
  return props.showIcon ? roleConfig.value.icon : null
})
</script>

<style scoped>
/* Hover effects */
.role-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Pulse animation for premium badges */
.bg-yellow-600 {
  animation: subtle-pulse 2s infinite;
}

@keyframes subtle-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}
</style>
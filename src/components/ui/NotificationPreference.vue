<template>
  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 notification-card">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconClass">
        <i class="text-lg" :class="[iconFaClass, iconColorClass]"></i>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-900">{{ title }}</p>
        <p class="text-xs text-gray-500">{{ description }}</p>
      </div>
    </div>
    <div v-if="!editMode">
      <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border" 
            :class="enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'">
        <div class="w-2 h-2 rounded-full mr-2" :class="enabled ? 'bg-green-400' : 'bg-gray-400'"></div>
        {{ enabled ? 'Enabled' : 'Disabled' }}
      </span>
    </div>
    <label v-else class="relative inline-flex items-center cursor-pointer">
      <input
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        type="checkbox"
        class="sr-only peer"
      />
      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
    validator: (value) => ['email', 'sms', 'notification'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  editMode: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const iconClass = computed(() => {
  switch (props.icon) {
    case 'email':
      return 'bg-blue-100'
    case 'sms':
      return 'bg-green-100'
    default:
      return 'bg-gray-100'
  }
})

const iconFaClass = computed(() => {
  switch (props.icon) {
    case 'email':
      return 'fas fa-envelope'
    case 'sms':
      return 'fas fa-sms'
    default:
      return 'fas fa-bell'
  }
})

const iconColorClass = computed(() => {
  switch (props.icon) {
    case 'email':
      return 'text-blue-600'
    case 'sms':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
})
</script>

<style scoped>
/* Custom toggle switch styles */
.peer:checked + div {
  background-color: #2563eb;
}

.peer:focus + div {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}

.peer:checked + div:after {
  transform: translateX(100%);
  border-color: white;
}

/* Animation for notification cards */
.notification-card {
  transition: all 0.2s ease-in-out;
}

.notification-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

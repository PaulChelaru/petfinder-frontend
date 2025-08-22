<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger -->
    <div @click="toggle" @keydown.enter="toggle" @keydown.space.prevent="toggle" tabindex="0">
      <slot name="trigger" :is-open="isOpen" :toggle="toggle">
        <ActionButton :variant="triggerVariant" :size="triggerSize">
          {{ triggerText }}
          <i 
            :class="[
              'fas fa-chevron-down ml-2 w-4 h-4 transition-transform duration-200',
              { 'rotate-180': isOpen }
            ]"
          ></i>
        </ActionButton>
      </slot>
    </div>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        :class="menuClasses"
        role="menu"
        aria-orientation="vertical"
      >
        <div v-if="$slots.header" class="px-4 py-3 border-b border-gray-100">
          <slot name="header" />
        </div>

        <div class="py-1">
          <slot name="items" :close="close">
            <button
              v-for="item in items"
              :key="item.id || item.label"
              type="button"
              :class="getItemClasses(item)"
              :disabled="item.disabled"
              @click="handleItemClick(item)"
              role="menuitem"
            >
              <component v-if="item.icon" :is="item.icon" class="w-4 h-4 mr-3" />
              <span class="flex-1 text-left">{{ item.label }}</span>
              <StatusBadge 
                v-if="item.badge" 
                :variant="item.badge.variant || 'default'" 
                size="sm"
              >
                {{ item.badge.text }}
              </StatusBadge>
            </button>
          </slot>
        </div>

        <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-100">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ActionButton from '../buttons/ActionButton.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => [
      'bottom-left', 'bottom-right', 'top-left', 'top-right',
      'left', 'right'
    ].includes(value)
  },
  width: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  triggerText: {
    type: String,
    default: 'Options'
  },
  triggerVariant: {
    type: String,
    default: 'outline'
  },
  triggerSize: {
    type: String,
    default: 'md'
  },
  closeOnClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['item-click', 'open', 'close'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const menuClasses = computed(() => {
  const positions = {
    'bottom-left': 'absolute left-0 top-full mt-2',
    'bottom-right': 'absolute right-0 top-full mt-2',
    'top-left': 'absolute left-0 bottom-full mb-2',
    'top-right': 'absolute right-0 bottom-full mb-2',
    'left': 'absolute right-full top-0 mr-2',
    'right': 'absolute left-full top-0 ml-2'
  }
  
  const widths = {
    auto: 'w-auto min-w-48',
    sm: 'w-48',
    md: 'w-56',
    lg: 'w-64',
    xl: 'w-72',
    full: 'w-full'
  }
  
  return [
    'z-50 bg-white rounded-lg shadow-lg border border-gray-200',
    positions[props.position],
    widths[props.width]
  ].join(' ')
})

const getItemClasses = (item) => {
  const baseClasses = 'flex items-center w-full px-4 py-2 text-sm text-left transition-colors duration-150'
  
  if (item.disabled) {
    return `${baseClasses} text-gray-400 cursor-not-allowed`
  }
  
  if (item.danger) {
    return `${baseClasses} text-red-600 hover:bg-red-50 hover:text-red-700`
  }
  
  return `${baseClasses} text-gray-700 hover:bg-gray-50 hover:text-gray-900`
}

const toggle = () => {
  isOpen.value = !isOpen.value
  emit(isOpen.value ? 'open' : 'close')
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleItemClick = (item) => {
  if (item.disabled) return
  
  emit('item-click', item)
  
  if (props.closeOnClick) {
    close()
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    close()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

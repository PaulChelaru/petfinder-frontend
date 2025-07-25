<template>
  <div>
    <!-- Tab Headers -->
    <div :class="headerClasses">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="getTabClasses(tab)"
          :aria-selected="activeTab === tab.id"
          @click="setActiveTab(tab.id)"
        >
          <component v-if="tab.icon" :is="tab.icon" class="w-5 h-5 mr-2" />
          {{ tab.label }}
          <StatusBadge 
            v-if="tab.badge" 
            :variant="tab.badge.variant || 'default'" 
            size="sm" 
            class="ml-2"
          >
            {{ tab.badge.text }}
          </StatusBadge>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div :class="contentClasses">
      <slot :name="activeTab" :active-tab="activeTab">
        <div v-for="tab in tabs" :key="tab.id" v-show="activeTab === tab.id">
          <slot :name="`tab-${tab.id}`" :tab="tab">
            <div class="text-center py-8 text-gray-500">
              <p>Content for {{ tab.label }}</p>
            </div>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => {
      return tabs.every(tab => 
        typeof tab === 'object' && 
        'id' in tab && 
        'label' in tab
      )
    }
  },
  defaultTab: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'pills', 'minimal'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['tab-change'])

const activeTab = ref(props.defaultTab || props.tabs[0]?.id)

const headerClasses = computed(() => {
  const variants = {
    default: 'border-b border-gray-200 bg-white',
    pills: 'bg-gray-100 p-1 rounded-lg inline-flex',
    minimal: ''
  }
  
  const sizes = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4'
  }
  
  return `${variants[props.variant]} ${sizes[props.size]}`
})

const contentClasses = computed(() => {
  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return sizes[props.size]
})

const getTabClasses = (tab) => {
  const isActive = activeTab.value === tab.id
  
  const baseClasses = 'flex items-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
  
  const variants = {
    default: isActive 
      ? 'border-b-2 border-blue-500 text-blue-600 pb-2'
      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 pb-2',
    pills: isActive
      ? 'bg-white text-gray-900 rounded-md px-3 py-2 shadow-sm'
      : 'text-gray-500 hover:text-gray-700 rounded-md px-3 py-2',
    minimal: isActive
      ? 'text-blue-600 border-b-2 border-blue-500 pb-1'
      : 'text-gray-500 hover:text-gray-700 pb-1'
  }
  
  const sizes = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  }
  
  return `${baseClasses} ${variants[props.variant]} ${sizes[props.size]}`
}

const setActiveTab = (tabId) => {
  if (activeTab.value !== tabId) {
    activeTab.value = tabId
    emit('tab-change', tabId)
  }
}

// Watch for default tab changes
watch(() => props.defaultTab, (newTab) => {
  if (newTab && newTab !== activeTab.value) {
    activeTab.value = newTab
  }
})
</script>

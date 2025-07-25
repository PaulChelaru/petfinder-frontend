<template>
  <div class="space-y-2">
    <h3 v-if="title" class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="items.length === 0" class="text-center py-8">
      <slot name="empty">
        <div class="text-gray-500">
          <p class="text-lg font-medium">{{ emptyMessage }}</p>
          <p class="text-sm mt-1">{{ emptyDescription }}</p>
        </div>
      </slot>
    </div>
    
    <div v-else class="space-y-2">
      <div
        v-for="(item, index) in items"
        :key="item.id || index"
        :class="[
          'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200',
          {
            'cursor-pointer hover:border-gray-300': clickable
          }
        ]"
        @click="handleItemClick(item, index)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1 min-w-0">
            <!-- Icon/Avatar -->
            <div v-if="showIcon" class="flex-shrink-0 mr-3">
              <slot name="icon" :item="item" :index="index">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <component v-if="item.icon" :is="item.icon" class="w-5 h-5 text-gray-600" />
                  <span v-else class="text-sm font-medium text-gray-600">{{ getItemInitials(item) }}</span>
                </div>
              </slot>
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <slot name="item" :item="item" :index="index">
                <div class="flex items-center justify-between">
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ getItemTitle(item) }}
                    </p>
                    <p v-if="getItemSubtitle(item)" class="text-sm text-gray-500 truncate">
                      {{ getItemSubtitle(item) }}
                    </p>
                  </div>
                  <div v-if="getItemValue(item)" class="ml-4 flex-shrink-0">
                    <span class="text-sm font-medium text-gray-900">{{ getItemValue(item) }}</span>
                  </div>
                </div>
                
                <div v-if="getItemDescription(item)" class="mt-1">
                  <p class="text-xs text-gray-600">{{ getItemDescription(item) }}</p>
                </div>
                
                <!-- Status badge -->
                <div v-if="getItemStatus(item)" class="mt-2">
                  <StatusBadge :variant="getItemStatus(item).variant">
                    {{ getItemStatus(item).text }}
                  </StatusBadge>
                </div>
              </slot>
            </div>
          </div>
          
          <!-- Actions -->
          <div v-if="$slots.actions" class="ml-4 flex-shrink-0">
            <slot name="actions" :item="item" :index="index" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Load more -->
    <div v-if="showLoadMore" class="text-center py-4">
      <ActionButton
        variant="outline"
        @click="$emit('load-more')"
        :loading="loadingMore"
      >
        Load More
      </ActionButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import StatusBadge from './StatusBadge.vue'
import ActionButton from '../buttons/ActionButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  showLoadMore: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  emptyMessage: {
    type: String,
    default: 'No items found'
  },
  emptyDescription: {
    type: String,
    default: 'There are no items to display at the moment.'
  },
  titleField: {
    type: String,
    default: 'title'
  },
  subtitleField: {
    type: String,
    default: 'subtitle'
  },
  descriptionField: {
    type: String,
    default: 'description'
  },
  valueField: {
    type: String,
    default: 'value'
  },
  statusField: {
    type: String,
    default: 'status'
  }
})

const emit = defineEmits(['item-click', 'load-more'])

const getItemTitle = (item) => {
  return item[props.titleField] || item.name || item.title || ''
}

const getItemSubtitle = (item) => {
  return item[props.subtitleField] || item.subtitle || ''
}

const getItemDescription = (item) => {
  return item[props.descriptionField] || item.description || ''
}

const getItemValue = (item) => {
  return item[props.valueField] || item.value || ''
}

const getItemStatus = (item) => {
  const status = item[props.statusField] || item.status
  if (!status) return null
  
  if (typeof status === 'string') {
    return { variant: status, text: status }
  }
  
  return status
}

const getItemInitials = (item) => {
  const title = getItemTitle(item)
  return title.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()
}

const handleItemClick = (item, index) => {
  if (props.clickable) {
    emit('item-click', { item, index })
  }
}
</script>

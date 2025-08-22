<template>
  <BaseCard :variant="variant" class="detail-card">
    <template #header v-if="title">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <slot name="header-actions" />
      </div>
    </template>

    <div class="space-y-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-start justify-between py-2"
        :class="{ 'border-b border-gray-200': index < items.length - 1 }"
      >
        <div class="flex items-start space-x-3">
          <div v-if="item.icon" class="mt-0.5">
            <i :class="item.icon + ' text-gray-500'"></i>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-700">{{ item.label }}</dt>
            <dd class="text-sm text-gray-900 mt-1">
              <slot :name="`item-${index}`" :item="item">
                {{ item.value || 'Not specified' }}
              </slot>
            </dd>
          </div>
        </div>
        
        <div v-if="item.action" class="ml-4">
          <slot :name="`action-${index}`" :item="item">
            <button
              @click="$emit('action', item)"
              class="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              {{ item.action }}
            </button>
          </slot>
        </div>
      </div>
    </div>

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  variant: {
    type: String,
    default: 'default'
  }
})

defineEmits(['action'])
</script>
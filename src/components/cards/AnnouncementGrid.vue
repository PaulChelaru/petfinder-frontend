<template>
  <div>
    <div v-if="announcements.length > 0" class="grid gap-4" :class="gridClasses">
      <AnnouncementCard
        v-for="announcement in announcements"
        :key="announcement._id"
        :announcement="announcement"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @resolve="$emit('resolve', $event)"
        @view-announcement="$emit('view-announcement', $event)"
        @refresh-matches="$emit('refresh-matches', $event)"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="mb-4">
        <i class="fas fa-bullhorn mx-auto h-16 w-16 text-gray-400 text-6xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ emptyTitle }}</h3>
      <p class="text-gray-500">{{ emptyDescription }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AnnouncementCard from '../cards/AnnouncementCard.vue'

const props = defineProps({
  announcements: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 3,
    validator: (value) => [1, 2, 3, 4].includes(value)
  },
  emptyTitle: {
    type: String,
    default: 'No announcements found'
  },
  emptyDescription: {
    type: String,
    default: 'Try adjusting your search criteria or filters.'
  }
})

defineEmits(['view', 'edit', 'resolve', 'view-announcement', 'refresh-matches'])

const gridClasses = computed(() => {
  const classes = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
  return classes[props.columns]
})
</script>

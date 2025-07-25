<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <FormField
      v-model="localSearchTerm"
      label="Search pets"
      placeholder="Search by pet name, description, or location..."
      @update:model-value="$emit('update:searchTerm', $event)"
    >
      <template #icon>
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </template>
    </FormField>

    <!-- Filter Controls -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Type Filter -->
      <FormSelect
        v-model="localFilters.type"
        label="Pet Type"
        placeholder="All types"
        :options="typeOptions"
        @update:model-value="updateFilters"
      />

      <!-- Announcement Type Filter -->
      <FormSelect
        v-model="localFilters.announcementType"
        label="Announcement Type"
        placeholder="All announcements"
        :options="announcementTypeOptions"
        @update:model-value="updateFilters"
      />

      <!-- Status Filter -->
      <FormSelect
        v-model="localFilters.status"
        label="Status"
        placeholder="All statuses"
        :options="statusOptions"
        @update:model-value="updateFilters"
      />
    </div>

    <!-- Date Range Filter -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        v-model="localFilters.dateFrom"
        type="date"
        label="From Date"
        @update:model-value="updateFilters"
      />
      <FormField
        v-model="localFilters.dateTo"
        type="date"
        label="To Date"
        @update:model-value="updateFilters"
      />
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Active filters:</span>
      <StatusBadge
        v-for="filter in activeFilters"
        :key="filter.key"
        variant="secondary"
        class="cursor-pointer"
        @click="removeFilter(filter.key)"
      >
        {{ filter.label }} ×
      </StatusBadge>
      <ActionButton
        variant="outline"
        size="sm"
        @click="clearAllFilters"
      >
        Clear All
      </ActionButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FormField from './FormField.vue'
import FormSelect from './FormSelect.vue'
import StatusBadge from '../ui/StatusBadge.vue'
import ActionButton from '../buttons/ActionButton.vue'

const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  filters: {
    type: Object,
    default: () => ({
      type: '',
      announcementType: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    })
  }
})

const emit = defineEmits(['update:searchTerm', 'update:filters'])

const localSearchTerm = ref(props.searchTerm)
const localFilters = ref({ ...props.filters })

const typeOptions = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'bird', label: 'Bird' },
  { value: 'other', label: 'Other' }
]

const announcementTypeOptions = [
  { value: 'lost', label: 'Lost Pets' },
  { value: 'found', label: 'Found Pets' }
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' }
]

const activeFilters = computed(() => {
  const filters = []
  if (localFilters.value.type) {
    filters.push({
      key: 'type',
      label: `Type: ${typeOptions.find(o => o.value === localFilters.value.type)?.label}`
    })
  }
  if (localFilters.value.announcementType) {
    filters.push({
      key: 'announcementType',
      label: `Type: ${announcementTypeOptions.find(o => o.value === localFilters.value.announcementType)?.label}`
    })
  }
  if (localFilters.value.status) {
    filters.push({
      key: 'status',
      label: `Status: ${statusOptions.find(o => o.value === localFilters.value.status)?.label}`
    })
  }
  if (localFilters.value.dateFrom) {
    filters.push({
      key: 'dateFrom',
      label: `From: ${localFilters.value.dateFrom}`
    })
  }
  if (localFilters.value.dateTo) {
    filters.push({
      key: 'dateTo',
      label: `To: ${localFilters.value.dateTo}`
    })
  }
  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const updateFilters = () => {
  emit('update:filters', { ...localFilters.value })
}

const removeFilter = (filterKey) => {
  localFilters.value[filterKey] = ''
  updateFilters()
}

const clearAllFilters = () => {
  localFilters.value = {
    type: '',
    announcementType: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  }
  updateFilters()
}

// Watch for external changes
watch(() => props.searchTerm, (newValue) => {
  localSearchTerm.value = newValue
})

watch(() => props.filters, (newValue) => {
  localFilters.value = { ...newValue }
}, { deep: true })
</script>

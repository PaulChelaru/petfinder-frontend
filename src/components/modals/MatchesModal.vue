<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full" @click.stop>
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">
              <i class="fas fa-search-plus mr-2"></i>
              {{ matches.length }} Matches Found
            </h3>
            <button 
              @click="closeModal"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          <p class="text-blue-100 text-sm mt-1">
            Click on any match to view full details
          </p>
        </div>

        <!-- Matches List -->
        <div class="max-h-[70vh] overflow-y-auto p-6">
          <div v-if="sortedMatches.length === 0" class="text-center py-8">
            <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-500">No matches found</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="(match, index) in sortedMatches" 
              :key="match.id || match.announcementId"
              class="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 transform hover:scale-[1.01]"
              @click="viewMatchDetails(match)"
            >
              <div class="flex items-start justify-between gap-4">
                <!-- Match Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <!-- Rank Badge -->
                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      #{{ index + 1 }}
                    </div>
                    
                    <!-- Pet Name -->
                    <h4 class="font-semibold text-gray-900 text-lg">{{ match.petName || 'Unknown Pet' }}</h4>
                    
                    <!-- Type Badge -->
                    <span 
                      :class="match.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                      class="px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {{ match.type === 'lost' ? '🔍 Lost' : '🏠 Found' }}
                    </span>
                  </div>
                  
                  <!-- Details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <div v-if="match.breed" class="flex items-center">
                      <i class="fas fa-dog text-gray-400 mr-2"></i>
                      <span>{{ match.breed }}</span>
                    </div>
                    <div v-if="match.locationName || match.location" class="flex items-center">
                      <i class="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                      <span class="truncate">{{ match.locationName || (typeof match.location === 'string' ? match.location : match.location?.address || 'Unknown location') }}</span>
                    </div>
                    <div v-if="match.contactInfo" class="flex items-center">
                      <i class="fas fa-phone text-gray-400 mr-2"></i>
                      <span>{{ typeof match.contactInfo === 'string' ? match.contactInfo : match.contactInfo?.phone || match.contactInfo?.email || 'Contact available' }}</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-calendar text-gray-400 mr-2"></i>
                      <span>{{ formatDate(match.lastSeenDate || match.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <!-- Description -->
                  <p v-if="match.description" class="text-gray-700 text-sm line-clamp-2">
                    {{ match.description }}
                  </p>
                </div>

                <!-- Score Display -->
                <div class="flex flex-col items-center gap-2 flex-shrink-0">
                  <div 
                    :class="getScoreIndicatorColor(getMatchScore(match))"
                    class="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span class="text-white font-bold text-lg">
                      {{ getMatchScoreDisplay(getMatchScore(match)) }}%
                    </span>
                  </div>
                  <span 
                    :class="getMatchScoreColor(getMatchScore(match))"
                    class="text-xs font-medium"
                  >
                    {{ getScoreLabel(getMatchScore(match)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button 
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  matches: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'view-announcement'])

const closeModal = () => {
  emit('close')
}

const viewMatchDetails = (matchObject) => {
  emit('view-announcement', matchObject)
  // Don't close modal here - let parent handle navigation
}

// Sort matches by score descending
const sortedMatches = computed(() => {
  return [...props.matches].sort((a, b) => {
    const scoreA = getMatchScore(a)
    const scoreB = getMatchScore(b)
    return scoreB - scoreA
  })
})

// Helper functions
const getMatchScore = (match) => {
  return match.matchScore || match.score || (match.confidence && match.confidence * 100) || 0
}

const getMatchScoreDisplay = (score) => {
  const numScore = Number(score)
  return isNaN(numScore) ? 0 : Math.round(numScore)
}

const getMatchScoreColor = (score) => {
  const numScore = Number(score) || 0
  if (numScore >= 80) return 'text-emerald-600'
  if (numScore >= 60) return 'text-yellow-600'
  if (numScore >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const getScoreIndicatorColor = (score) => {
  const numScore = Number(score) || 0
  if (numScore >= 80) return 'bg-emerald-500'
  if (numScore >= 60) return 'bg-yellow-500'
  if (numScore >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

const getScoreLabel = (score) => {
  const numScore = Number(score) || 0
  if (numScore >= 80) return 'Excellent'
  if (numScore >= 60) return 'Good'
  if (numScore >= 40) return 'Fair'
  return 'Low'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return 'Unknown'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

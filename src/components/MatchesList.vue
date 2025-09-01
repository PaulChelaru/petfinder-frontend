<template>
    <div class="matches-container">
        <div v-if="loading" class="loading-state">
            <LoadingSpinner />
            <p class="text-gray-600 mt-2">Se caută potriviri...</p>
        </div>
        
        <div v-else-if="error" class="error-state p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600">{{ error }}</p>
        </div>
        
        <div v-else-if="matches.length === 0" class="no-matches p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p class="text-gray-600 text-center">Nu s-au găsit potriviri pentru acest anunț.</p>
        </div>
        
        <div v-else class="matches-list space-y-4">
            <div class="matches-header mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                    Potriviri găsite ({{ matches.length }})
                </h3>
                <p class="text-sm text-gray-600">
                    Anunțuri care ar putea fi relevante pentru animalul dvs.
                </p>
            </div>
            
            <div 
                v-for="match in matches" 
                :key="match.matchId"
                class="match-card bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                @click="$emit('selectMatch', match)"
            >
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h4 class="font-semibold text-gray-900">
                                {{ match.matchedAnnouncement.petName }}
                            </h4>
                            <span 
                                :class="getTypeClass(match.matchedAnnouncement.type)"
                                class="px-2 py-1 rounded-full text-xs font-medium"
                            >
                                {{ getTypeLabel(match.matchedAnnouncement.type) }}
                            </span>
                        </div>
                        
                        <p class="text-gray-600 text-sm mb-2 line-clamp-2">
                            {{ match.matchedAnnouncement.description }}
                        </p>
                        
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                                </svg>
                                {{ match.matchedAnnouncement.locationName }}
                            </span>
                            <span>
                                {{ formatDate(match.matchedAnnouncement.lastSeenDate) }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="ml-4 text-right">
                        <div class="confidence-score mb-2">
                            <div class="text-lg font-bold" :class="getConfidenceColor(match.matchScore || match.confidence)">
                                {{ match.matchScore || Math.round((match.confidence || 0) * 100) }}%
                            </div>
                            <div class="text-xs text-gray-500">potrivire</div>
                        </div>
                        
                        <div class="match-factors">
                            <div 
                                v-for="factor in getTopFactors(match.factors)" 
                                :key="factor.type"
                                class="text-xs text-gray-500 mb-1"
                            >
                                {{ getFactorLabel(factor.type) }}: {{ Math.round(factor.score * 100) }}%
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="match.matchedAnnouncement.images && match.matchedAnnouncement.images.length > 0" class="mt-3">
                    <img 
                        :src="getImageUrl(match.matchedAnnouncement.images[0].url)"
                        :alt="match.matchedAnnouncement.images[0].alt || 'Imagine animal'"
                        class="w-16 h-16 object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { LoadingSpinner } from '../components/index.js';

export default {
    name: 'MatchesList',
    components: {
        LoadingSpinner,
    },
    props: {
        matches: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        error: {
            type: String,
            default: null,
        },
    },
    emits: ['selectMatch'],
    methods: {
        getTypeClass(type) {
            const classes = {
                lost: 'bg-red-100 text-red-800',
                found: 'bg-green-100 text-green-800',
            };
            return classes[type] || 'bg-gray-100 text-gray-800';
        },
        
        getTypeLabel(type) {
            const labels = {
                lost: 'Pierdut',
                found: 'Găsit',
            };
            return labels[type] || type;
        },
        
        getConfidenceColor(confidence) {
            // Convert matchScore (0-100) to confidence (0-1) format for comparison
            const normalizedConfidence = confidence > 1 ? confidence / 100 : confidence;
            if (normalizedConfidence >= 0.8) return 'text-green-600';
            if (normalizedConfidence >= 0.6) return 'text-yellow-600';
            return 'text-red-600';
        },
        
        getTopFactors(factors) {
            return Object.entries(factors)
                .map(([type, score]) => ({ type, score }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);
        },
        
        getFactorLabel(type) {
            const labels = {
                species: 'Specie',
                breed: 'Rasă',
                location: 'Locație',
                time: 'Timp',
                color: 'Culoare',
                size: 'Mărime',
            };
            return labels[type] || type;
        },
        
        getImageUrl(url) {
            if (url.startsWith('http')) {
                return url;
            }
            return `http://localhost:3003${url}`;
        },
        
        formatDate(dateString) {
            if (!dateString) return '';
            
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) return 'ieri';
            if (diffDays <= 7) return `acum ${diffDays} zile`;
            if (diffDays <= 30) return `acum ${Math.floor(diffDays / 7)} săptămâni`;
            
            return date.toLocaleDateString('ro-RO', {
                day: 'numeric',
                month: 'short',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
            });
        },
    },
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.match-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

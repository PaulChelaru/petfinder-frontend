import { ref, computed } from 'vue';
import { getAnnouncementMatches, getAllMatches } from '../api/matches.js';

export function useMatches() {
    const matches = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const pagination = ref({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
    });

    // Computed properties
    const hasMatches = computed(() => matches.value.length > 0);
    const highConfidenceMatches = computed(() => 
        matches.value.filter(match => match.confidence >= 0.7)
    );
    const mediumConfidenceMatches = computed(() => 
        matches.value.filter(match => match.confidence >= 0.5 && match.confidence < 0.7)
    );
    const lowConfidenceMatches = computed(() => 
        matches.value.filter(match => match.confidence < 0.5)
    );

    /**
     * Fetch matches for a specific announcement
     * @param {string} announcementId - The announcement ID
     */
    const fetchAnnouncementMatches = async (announcementId) => {
        console.log('fetchAnnouncementMatches called with:', announcementId);
        
        if (!announcementId) {
            error.value = 'ID anunț lipsește';
            console.log('No announcement ID provided');
            return;
        }

        loading.value = true;
        error.value = null;
        console.log('Loading matches...');

        try {
            const response = await getAnnouncementMatches(announcementId);
            console.log('Matches response:', response);
            
            if (response.success) {
                matches.value = response.data || [];
                pagination.value = response.pagination || pagination.value;
                console.log('Matches loaded:', matches.value);
            } else {
                error.value = response.message || 'Eroare la obținerea potrivirilor';
                matches.value = [];
                console.log('Error from response:', error.value);
            }
        } catch (err) {
            console.error('Error fetching announcement matches:', err);
            error.value = 'Nu s-au putut încărca potrivirile. Serviciul de matching nu este disponibil.';
            matches.value = [];
        } finally {
            loading.value = false;
            console.log('Loading finished. Final state:', { 
                matches: matches.value, 
                loading: loading.value, 
                error: error.value 
            });
        }
    };

    /**
     * Fetch all matches with pagination
     * @param {Object} params - Query parameters
     */
    const fetchAllMatches = async (params = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await getAllMatches(params);
            
            if (response.success) {
                matches.value = response.data || [];
                pagination.value = response.pagination || pagination.value;
            } else {
                error.value = response.message || 'Eroare la obținerea potrivirilor';
                matches.value = [];
            }
        } catch (err) {
            console.error('Error fetching all matches:', err);
            error.value = 'Nu s-au putut încărca potrivirile. Serviciul de matching nu este disponibil.';
            matches.value = [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * Clear matches and reset state
     */
    const clearMatches = () => {
        matches.value = [];
        error.value = null;
        pagination.value = {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0,
        };
    };

    /**
     * Get match confidence level description
     * @param {number} confidence - Confidence score (0-1)
     * @returns {string} Confidence description
     */
    const getConfidenceDescription = (confidence) => {
        if (confidence >= 0.8) return 'Potrivire foarte bună';
        if (confidence >= 0.6) return 'Potrivire bună';
        if (confidence >= 0.4) return 'Potrivire moderată';
        return 'Potrivire slabă';
    };

    /**
     * Sort matches by confidence (highest first)
     */
    const sortMatchesByConfidence = () => {
        matches.value.sort((a, b) => b.confidence - a.confidence);
    };

    /**
     * Filter matches by minimum confidence threshold
     * @param {number} threshold - Minimum confidence (0-1)
     */
    const filterByConfidence = (threshold = 0.5) => {
        return matches.value.filter(match => match.confidence >= threshold);
    };

    return {
        // State
        matches,
        loading,
        error,
        pagination,
        
        // Computed
        hasMatches,
        highConfidenceMatches,
        mediumConfidenceMatches,
        lowConfidenceMatches,
        
        // Actions
        fetchAnnouncementMatches,
        fetchAllMatches,
        clearMatches,
        sortMatchesByConfidence,
        filterByConfidence,
        
        // Utilities
        getConfidenceDescription,
    };
}

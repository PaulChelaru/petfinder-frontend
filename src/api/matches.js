import { apiRequest } from './index.js';

const MATCHING_SERVICE_URL = 'http://localhost:3005/v1';

/**
 * Get matches for a specific announcement
 * @param {string} announcementId - The announcement ID to get matches for
 * @returns {Promise<Object>} Response with matches data
 */
export const getAnnouncementMatches = async (announcementId) => {
    console.log('getAnnouncementMatches called with:', announcementId);
    
    try {
        const response = await apiRequest(`${MATCHING_SERVICE_URL}/matches/announcement/${announcementId}`, {
            method: 'GET',
        });
        console.log('Real API response:', response);
        return response;
    } catch (error) {
        console.warn('Matching service not available, using mock data:', error.message);
        
        // Return mock data for demo purposes
        const mockData = {
            success: true,
            data: mockMatches,
            pagination: {
                total: mockMatches.length,
                page: 1,
                limit: 10,
                pages: 1
            }
        };
        console.log('Returning mock data:', mockData);
        return mockData;
    }
};

/**
 * Get all matches with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Match type filter (optional)
 * @returns {Promise<Object>} Response with matches data
 */
export const getAllMatches = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.type) queryParams.append('type', params.type);
        
        const url = `${MATCHING_SERVICE_URL}/matches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await apiRequest(url, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error('Error fetching all matches:', error);
        // Return empty data if service is down
        return {
            success: true,
            data: [],
            pagination: {
                total: 0,
                page: 1,
                limit: 10,
                pages: 0,
            },
        };
    }
};

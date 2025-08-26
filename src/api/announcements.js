/**
 * Announcement Service API Client
 */
import api from './index.js';

const ANNOUNCEMENT_BASE_URL = '/announcements';

export const announcementApi = {
  /**
   * List announcements with filters and pagination
   */
  async list(params = {}, signal = null) {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Add filter params (only backend-supported ones)
    if (params.search) queryParams.append('search', params.search);
    if (params.petType) queryParams.append('petType', params.petType);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    
    // Add date range filters
    if (params.postedSince) queryParams.append('postedSince', params.postedSince);
    
    // Add location params
    if (params.longitude) queryParams.append('longitude', params.longitude);
    if (params.latitude) queryParams.append('latitude', params.latitude);
    if (params.maxDistance) queryParams.append('maxDistance', params.maxDistance);
    
    const url = queryParams.toString() 
      ? `${ANNOUNCEMENT_BASE_URL}?${queryParams.toString()}`
      : ANNOUNCEMENT_BASE_URL;
      
    const config = signal ? { signal } : {};
    return api.get(url, config);
  },

  /**
   * Get announcement by ID
   */
  async getById(id) {
    return api.get(`${ANNOUNCEMENT_BASE_URL}/${id}`);
  },

  /**
   * Get user's own announcements
   */
  async getUserAnnouncements(params = {}, signal = null) {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Add filter params (same as list method)
    if (params.search) queryParams.append('search', params.search);
    if (params.petType) queryParams.append('petType', params.petType);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    
    // Add date range filters
    if (params.postedSince) queryParams.append('postedSince', params.postedSince);
    
    // Add location params
    if (params.longitude) queryParams.append('longitude', params.longitude);
    if (params.latitude) queryParams.append('latitude', params.latitude);
    if (params.maxDistance) queryParams.append('maxDistance', params.maxDistance);
    
    const url = queryParams.toString() 
      ? `/my-announcements?${queryParams.toString()}`
      : `/my-announcements`;

    const config = signal ? { signal } : {};
    return api.get(url, config);
  },

  /**
   * Create new announcement
   */
  async create(announcementData) {
    return api.post(ANNOUNCEMENT_BASE_URL, announcementData);
  },

  /**
   * Update announcement
   */
  async update(id, updateData) {
    return api.put(`${ANNOUNCEMENT_BASE_URL}/${id}`, updateData);
  },

  /**
   * Delete announcement
   */
  async delete(id) {
    
    const response = await api.delete(`${ANNOUNCEMENT_BASE_URL}/${id}`);
    return response;
  },

  /**
   * Resolve announcement (mark as found/adopted)
   */
  async resolve(id, resolveData = {}) {
    return api.put(`${ANNOUNCEMENT_BASE_URL}/${id}`, {
      status: 'resolved',
      resolvedNote: resolveData.note || resolveData.resolvedNote || '',
      ...(resolveData.matchedWith && { matchedWith: resolveData.matchedWith })
    });
  }
};

export default announcementApi;

/**
 * Modular service for handling announcement operations
 * Includes image upload, form data processing, and API communication
 */

const API_BASE_URL = 'http://127.0.0.1:3003/v1'

// Helper function to get auth token
const getAuthToken = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  return getCookie('auth_token')
}

// Helper function to make authenticated API calls
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken()
  
  const config = {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    }
  }
  
  // Don't set Content-Type for FormData, let browser set it
  if (options.body && !(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, config)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

/**
 * Process form data for announcement submission
 * @param {Object} formData - Raw form data from component
 * @returns {Object} - Processed data ready for API submission
 */
export const processAnnouncementData = (formData) => {
  const processed = { ...formData }
  
  // Process location data
  if (processed.locationCoordinates && Array.isArray(processed.locationCoordinates)) {
    processed.location = {
      address: processed.locationName || processed.locationDetails?.address || '',
      coordinates: {
        latitude: processed.locationCoordinates[1] || 0,
        longitude: processed.locationCoordinates[0] || 0
      }
    }
    delete processed.locationCoordinates
  }
  
  // Ensure contact info is properly structured
  if (processed.contactInfo && typeof processed.contactInfo === 'object') {
    processed.contactInfo = {
      phone: processed.contactInfo.phone || '',
      email: processed.contactInfo.email || '',
      preferredContact: processed.contactInfo.preferredContact || 'both'
    }
  }
  
  // Process lastSeenDate for lost pets
  if (processed.type === 'lost' && processed.lastSeenDate) {
    try {
      const date = new Date(processed.lastSeenDate + 'T12:00:00.000Z')
      processed.lastSeenDate = date.toISOString()
    } catch (error) {
      console.warn('Invalid lastSeenDate format:', processed.lastSeenDate)
      delete processed.lastSeenDate
    }
  }
  
  return processed
}

/**
 * Create FormData object for multipart submission
 * @param {Object} announcementData - Processed announcement data
 * @param {Array} files - Array of File objects to upload
 * @param {Array} existingImages - Array of existing image URLs
 * @returns {FormData} - Ready for submission
 */
export const createAnnouncementFormData = (announcementData, files = [], existingImages = []) => {
  const formData = new FormData()
  
  // Add form fields
  Object.entries(announcementData).forEach(([key, value]) => {
    if (key !== 'images' && value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    }
  })
  
  // Add new image files
  files.forEach(file => {
    formData.append('images', file)
  })
  
  // Add existing images as JSON
  if (existingImages.length > 0) {
    formData.append('images', JSON.stringify(existingImages))
  }
  
  return formData
}

/**
 * Create a new announcement
 * @param {FormData} formData - Form data with images and announcement details
 * @returns {Promise<Object>} - API response
 */
export const createAnnouncement = async (formData) => {
  return apiRequest('/announcements', {
    method: 'POST',
    body: formData
  })
}

/**
 * Update an existing announcement
 * @param {string} announcementId - ID of announcement to update
 * @param {FormData} formData - Updated form data
 * @returns {Promise<Object>} - API response
 */
export const updateAnnouncement = async (announcementId, formData) => {
  return apiRequest(`/announcements/${announcementId}`, {
    method: 'PUT',
    body: formData
  })
}

/**
 * Get announcement by ID
 * @param {string} announcementId - ID of announcement to fetch
 * @returns {Promise<Object>} - Announcement data
 */
export const getAnnouncement = async (announcementId) => {
  return apiRequest(`/announcements/${announcementId}`)
}

/**
 * Delete announcement
 * @param {string} announcementId - ID of announcement to delete
 * @returns {Promise<Object>} - API response
 */
export const deleteAnnouncement = async (announcementId) => {
  return apiRequest(`/announcements/${announcementId}`, {
    method: 'DELETE'
  })
}

/**
 * Get announcements list with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - List of announcements
 */
export const getAnnouncements = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const url = queryString ? `/announcements?${queryString}` : '/announcements'
  return apiRequest(url)
}

/**
 * Get current user's announcements
 * @returns {Promise<Object>} - User's announcements
 */
export const getMyAnnouncements = async () => {
  return apiRequest('/announcements/my')
}

/**
 * Resolve announcement (mark as found/solved)
 * @param {string} announcementId - ID of announcement to resolve
 * @returns {Promise<Object>} - API response
 */
export const resolveAnnouncement = async (announcementId) => {
  return apiRequest(`/announcements/${announcementId}/resolve`, {
    method: 'PUT'
  })
}

/**
 * Get image URL for display - handles all image formats from server
 * @param {string|Object} image - Image path/URL from server or image object
 * @returns {string} - Full image URL
 */
export const getImageUrl = (image) => {
  if (!image) return null
  
  // If image is an object, get the url property
  const imagePath = typeof image === 'object' ? image.url : image
  
  if (!imagePath || typeof imagePath !== 'string') return null
  
  // If it's already a full URL (external images), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath
  }
  
  // If it's a server path starting with /api/v1/images/, construct full URL
  if (imagePath.startsWith('/api/v1/images/')) {
    return `http://127.0.0.1:3003${imagePath}`
  }
  
  // If it's just a filename, construct full path
  return `http://127.0.0.1:3003/api/v1/images/${imagePath}`
}

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid
 * @throws {Error} - If validation fails
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error(`${file.name}: Invalid file type. Only JPEG, PNG, WebP are allowed.`)
  }
  
  if (file.size > maxSize) {
    throw new Error(`${file.name}: File too large. Maximum 10MB allowed.`)
  }
  
  return true
}

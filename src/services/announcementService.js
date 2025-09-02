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
  
  // Handle body serialization
  if (options.body) {
    if (options.body instanceof FormData) {
      // Don't set Content-Type for FormData, let browser set it with boundary
    } else if (typeof options.body === 'object') {
      // JSON object - stringify and set content type
      config.body = JSON.stringify(options.body)
      config.headers['Content-Type'] = 'application/json'
    } else {
      // Already a string or other primitive
      config.headers['Content-Type'] = 'application/json'
    }
  }
  
  console.log('Making API request:', {
    url: `${API_BASE_URL}${url}`,
    method: config.method || 'GET',
    headers: config.headers,
    bodyType: config.body ? (config.body instanceof FormData ? 'FormData' : typeof config.body) : 'none',
    bodyPreview: config.body instanceof FormData ? 'FormData content' : 
                 typeof config.body === 'string' ? config.body.substring(0, 200) + '...' : 
                 config.body
  })
  
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
  
  console.log('Processing announcement data:', JSON.stringify(processed, null, 2))
  
  // Process location data to match backend validation schema
  if (processed.locationCoordinates && 
      (Array.isArray(processed.locationCoordinates) || 
       (typeof processed.locationCoordinates === 'object' && 
        processed.locationCoordinates.longitude !== undefined && 
        processed.locationCoordinates.latitude !== undefined))) {
    
    console.log('Found coordinates:', processed.locationCoordinates)
    
    let longitude, latitude
    
    // Handle both array format [lng, lat] and object format {longitude, latitude}
    if (Array.isArray(processed.locationCoordinates)) {
      longitude = processed.locationCoordinates[0]
      latitude = processed.locationCoordinates[1]
    } else {
      longitude = processed.locationCoordinates.longitude
      latitude = processed.locationCoordinates.latitude
    }
    
    // Backend expects location with coordinates.latitude and coordinates.longitude
    processed.location = {
      address: processed.locationDetails?.address || processed.locationName || '',
      coordinates: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude)
      }
    }
    
    // Add city and state as separate fields if available
    if (processed.locationDetails?.city) {
      processed.location.city = processed.locationDetails.city
    }
    if (processed.locationDetails?.state) {
      processed.location.state = processed.locationDetails.state
    }
    
    delete processed.locationCoordinates
    delete processed.locationDetails
    delete processed.locationName
  } else {
    console.error('Missing or invalid coordinates:', processed.locationCoordinates)
    console.log('LocationDetails:', processed.locationDetails)
    
    // FALLBACK: If no coordinates but we have city/state, use Romania center
    if (processed.locationDetails?.city && processed.locationDetails?.state) {
      console.log('Creating fallback coordinates for Romania center')
      processed.location = {
        address: processed.locationDetails?.address || processed.locationName || '',
        coordinates: {
          longitude: 24.9668,  // Romania center longitude
          latitude: 45.9432    // Romania center latitude
        }
      }
      
      if (processed.locationDetails?.city) {
        processed.location.city = processed.locationDetails.city
      }
      if (processed.locationDetails?.state) {
        processed.location.state = processed.locationDetails.state
      }
      
      delete processed.locationCoordinates
      delete processed.locationDetails
      delete processed.locationName
    } else {
      console.error('Cannot create announcement without location data')
      throw new Error('Location coordinates are required. Please use current location or enter a valid address.')
    }
  }
  
  // Ensure contact info is properly structured and valid
  if (processed.contactInfo && typeof processed.contactInfo === 'object') {
    const contactInfo = {
      phone: processed.contactInfo.phone || '',
      email: processed.contactInfo.email || '',
      preferredContact: processed.contactInfo.preferredContact || 'phone'
    }
    
    // Clean up contactInfo based on backend validation rules
    // Remove empty email if present (backend validates email format)
    if (!contactInfo.email || contactInfo.email.trim() === '') {
      delete contactInfo.email
    }
    
    // Remove empty phone if present
    if (!contactInfo.phone || contactInfo.phone.trim() === '') {
      delete contactInfo.phone
    }
    
    // Ensure preferredContact is valid (phone or email, not "both")
    if (contactInfo.preferredContact === 'both') {
      // If both phone and email are present, default to phone
      if (contactInfo.phone && contactInfo.email) {
        contactInfo.preferredContact = 'phone'
      } else if (contactInfo.phone) {
        contactInfo.preferredContact = 'phone'
      } else if (contactInfo.email) {
        contactInfo.preferredContact = 'email'
      } else {
        contactInfo.preferredContact = 'phone'
      }
    }
    
    // Ensure we have at least one contact method (backend requires anyOf phone or email)
    if (!contactInfo.phone && !contactInfo.email) {
      // Don't include contactInfo if no valid contact method
      delete processed.contactInfo
    } else {
      processed.contactInfo = contactInfo
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
  
  console.log('processAnnouncementData result:', JSON.stringify(processed, null, 2))
  return processed
}

/**
 * Create FormData object for multipart submission
 * @param {Object} announcementData - Processed announcement data
 * @param {Array} files - Array of File objects to upload
 * @param {Array} existingImages - Array of existing image URLs
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {FormData} - Ready for submission
 */
export const createAnnouncementFormData = (announcementData, files = [], existingImages = [], isUpdate = false) => {
  const formData = new FormData()
  
  // Define allowed fields for update operations based on backend schema
  const allowedUpdateFields = [
    'petName', 'breed', 'color', 'age', 'description', 'lastSeenDate', 
    'location', 'contactInfo', 'images', 'status', 'resolvedNote', 'matchedWith'
  ]
  
  // Add form fields
  Object.entries(announcementData).forEach(([key, value]) => {
    if (key !== 'images' && value !== null && value !== undefined && value !== '') {
      // For updates, only include allowed fields
      if (isUpdate && !allowedUpdateFields.includes(key)) {
        console.log(`Skipping field '${key}' for update operation as it's not allowed by schema`)
        return
      }
      
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
 * @param {Object|FormData} updateData - Updated data (JSON for simple updates, FormData for image updates)
 * @returns {Promise<Object>} - API response
 */
export const updateAnnouncement = async (announcementId, updateData) => {
  return apiRequest(`/announcements/${announcementId}`, {
    method: 'PUT',
    body: updateData
  })
}

/**
 * Helper to create JSON data specifically for updates (no image changes)
 * @param {Object} announcementData - Processed announcement data
 * @returns {Object} - JSON data ready for update submission
 */
export const createUpdateJsonData = (announcementData) => {
  // Define allowed fields for update operations based on backend schema
  const allowedUpdateFields = [
    'petName', 'breed', 'color', 'age', 'description', 'lastSeenDate', 
    'location', 'contactInfo', 'status', 'resolvedNote', 'matchedWith'
  ]
  
  const updateData = {}
  
  // Add only allowed fields
  Object.entries(announcementData).forEach(([key, value]) => {
    if (allowedUpdateFields.includes(key) && value !== null && value !== undefined && value !== '') {
      // For complex objects, ensure they're properly structured
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Deep clone to avoid mutation and ensure proper structure
        updateData[key] = JSON.parse(JSON.stringify(value))
      } else {
        updateData[key] = value
      }
    } else if (!allowedUpdateFields.includes(key)) {
      console.log(`Skipping field '${key}' for update operation as it's not allowed by schema`)
    }
  })
  
  console.log('Final update data structure:', JSON.stringify(updateData, null, 2))
  return updateData
}

/**
 * Helper to create FormData specifically for updates
 * @param {Object} announcementData - Processed announcement data
 * @param {Array} files - Array of File objects to upload
 * @param {Array} existingImages - Array of existing image URLs
 * @returns {FormData} - Ready for update submission
 */
export const createUpdateFormData = (announcementData, files = [], existingImages = []) => {
  return createAnnouncementFormData(announcementData, files, existingImages, true)
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

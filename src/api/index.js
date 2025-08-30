import axios from 'axios'
import Cookies from 'js-cookie'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token')
    if (token) {
      // Validate token before using it
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)
        
        if (payload.exp && payload.exp < currentTime) {
          Cookies.remove('auth_token')
          // Don't add expired token to request
          return config
        }
        
        config.headers.Authorization = `Bearer ${token}`
      } catch (error) {
        Cookies.remove('auth_token')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle auth errors by checking token validity
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Dynamically import auth store to avoid circular dependency
      import('../stores/auth').then(({ useAuthStore }) => {
        const authStore = useAuthStore()
        authStore.checkAuthStatus() // This will handle cleanup and redirect if needed
      }).catch(err => {
        // Fallback: clear token and redirect
        Cookies.remove('auth_token')
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      })
    }
    return Promise.reject(error)
  }
)

export default api

/**
 * Generic API request function
 * @param {string} url - The URL to make the request to
 * @param {Object} options - Axios request options
 * @returns {Promise<Object>} The response data
 */
export const apiRequest = async (url, options = {}) => {
    try {
        const response = await axios({
            url,
            timeout: 10000,
            headers: {
                'Authorization': `Bearer ${Cookies.get('auth_token') || ''}`,
                ...options.headers,
            },
            ...options,
        });
        
        return response.data;
    } catch (error) {
        console.error('API Request Error:', error);
        
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
            // Network error
            throw new Error('Network error: Unable to connect to server');
        } else {
            // Other error
            throw new Error(error.message || 'Unknown error occurred');
        }
    }
};

// Re-export matches API
export * from './matches.js'

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

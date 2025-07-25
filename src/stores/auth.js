import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import Cookies from 'js-cookie'
import { authApi } from '../api/auth'
import { userAPI } from '../api/user'
import { useToastStore } from './toast'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => {
    // Check if we have both token and user
    if (!token.value || !user.value) {
      return false
    }
    
    // Double-check token validity
    const validation = validateToken(token.value)
    if (!validation || !validation.valid) {
      // Clear auth state if token is invalid
      nextTick(() => {
        clearAuthAndRedirect()
      })
      return false
    }
    
    return true
  })

  // Helper function to validate JWT token
  const validateToken = (authToken) => {
    if (!authToken) return false
    
    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      // Check if token has expired
      if (payload.exp && payload.exp < currentTime) {
        return false
      }
      
      // Check if token has required fields
      if (!payload.uid || !payload.rol) {
        return false
      }
      
      return { valid: true, payload }
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  }

  // Helper function to clear auth state and redirect
  const clearAuthAndRedirect = () => {
    user.value = null
    token.value = null
    Cookies.remove('auth_token')
    
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const initializeAuth = () => {
    const savedToken = Cookies.get('auth_token')
    
    if (savedToken) {
      const validation = validateToken(savedToken)
      if (validation && validation.valid) {
        token.value = savedToken
        user.value = {
          id: validation.payload.uid,
          role: validation.payload.rol
        }
      } else {
        // Token is invalid or expired - clear everything
        clearAuthAndRedirect()
      }
    } else {
      // Ensure clean state when no token
      user.value = null
      token.value = null
    }
  }

  const login = async (credentials) => {
    const toastStore = useToastStore()
    loading.value = true
    
    try {
      const response = await authApi.login(credentials)
      const authToken = response.data.token
      
      // Store token in cookie
      const cookieOptions = credentials.rememberMe 
        ? { expires: 30, secure: true, sameSite: 'strict' } // 30 days
        : { secure: true, sameSite: 'strict' } // Session cookie
      
      Cookies.set('auth_token', authToken, cookieOptions)
      token.value = authToken
      
      // Decode JWT to get user info
      const payload = JSON.parse(atob(authToken.split('.')[1]))
      user.value = {
        id: payload.uid,
        role: payload.rol
      }
      
      toastStore.showSuccess('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toastStore.showError(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    const toastStore = useToastStore()
    loading.value = true
    
    try {
      const response = await authApi.register(userData)
      const authToken = response.data.token
      
      // Store token in cookie (session cookie for new registrations)
      Cookies.set('auth_token', authToken, { secure: true, sameSite: 'strict' })
      token.value = authToken
      
      // Decode JWT to get user info
      const payload = JSON.parse(atob(authToken.split('.')[1]))
      user.value = {
        id: payload.uid,
        role: payload.rol
      }
      
      toastStore.showSuccess('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toastStore.showError(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    const toastStore = useToastStore()
    
    try {
      user.value = null
      token.value = null
      Cookies.remove('auth_token')
      
      toastStore.showSuccess('Logged out successfully')
      return Promise.resolve()
    } catch (error) {
      console.error('Logout error:', error)
      toastStore.showError('Error during logout')
      return Promise.reject(error)
    }
  }

  const updateUserProfile = (updatedUser) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
    }
  }

  const fetchUserDetails = async () => {
    if (!user.value?.id) return
    
    try {
      const response = await userAPI.getUserById(user.value.id)
      user.value = {
        ...user.value,
        ...response.data
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      // If API call fails due to auth issues, validate token
      if (error.response?.status === 401 || error.response?.status === 403) {
        checkAuthStatus()
      }
    }
  }

  // Method to check if current auth state is valid
  const checkAuthStatus = () => {
    const currentToken = token.value || Cookies.get('auth_token')
    
    if (currentToken) {
      const validation = validateToken(currentToken)
      if (!validation || !validation.valid) {
        clearAuthAndRedirect()
        return false
      }
      return true
    } else {
      // If no token but user/token state exists, clear it
      if (user.value || token.value) {
        user.value = null
        token.value = null
      }
      return false
    }
  }

  // Periodic token validation (every 30 seconds to catch expired tokens quickly)
  const startTokenValidation = () => {
    if (typeof window !== 'undefined') {
      // Initial check after a short delay to allow Vue to initialize
      setTimeout(() => {
        checkAuthStatus()
      }, 1000)
      
      // Regular interval checks
      setInterval(() => {
        // Only check if we think we're authenticated
        if (token.value || user.value || Cookies.get('auth_token')) {
          checkAuthStatus()
        }
      }, 30 * 1000) // 30 seconds for faster detection of expired tokens
      
      // Check auth status when window gains focus (user returns to tab)
      window.addEventListener('focus', () => {
        if (token.value || user.value || Cookies.get('auth_token')) {
          checkAuthStatus()
        }
      })
      
      // Check auth status when page becomes visible (tab switching)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          if (token.value || user.value || Cookies.get('auth_token')) {
            checkAuthStatus()
          }
        }
      })
    }
  }

  // Start token validation when store is created
  startTokenValidation()

  return {
    user,
    token,
    loading,
    isAuthenticated,
    initializeAuth,
    login,
    register,
    logout,
    updateUserProfile,
    fetchUserDetails,
    checkAuthStatus,
    validateToken
  }
})

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
          <i class="fas fa-paw text-white text-2xl"></i>
        </div>
        <h2 class="mt-6 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Create your account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Join our community to help reunite pets with their families
        </p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-6">
          <!-- Username -->
          <div class="group">
            <label for="username" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-at mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              Username <span class="text-red-500">*</span>
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              placeholder="Enter your username"
            />
            <p class="mt-2 text-xs text-gray-500 flex items-center">
              <i class="fas fa-info-circle mr-1"></i>
              3-30 characters, letters, numbers, underscores, and hyphens only
            </p>
          </div>

          <!-- First Name -->
          <div class="group">
            <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-user mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              placeholder="Enter your first name"
            />
          </div>

          <!-- Last Name -->
          <div class="group">
            <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-user mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              placeholder="Enter your last name"
            />
          </div>

          <!-- Email -->
          <div class="group">
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-envelope mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              placeholder="Enter your email address"
            />
          </div>

          <!-- City -->
          <div class="group">
            <label for="city" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-map-marker-alt mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              City <span class="text-red-500">*</span>
            </label>
            <input
              id="city"
              v-model="formData.city"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              placeholder="Enter your city"
            />
          </div>

          <!-- Phone Number -->
          <div class="group">
            <label for="phoneNumber" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-phone mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              Phone Number
            </label>
            <input
              id="phoneNumber"
              v-model="formData.phoneNumber"
              type="tel"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              placeholder="Enter your phone number (+123456789)"
            />
            <p class="mt-2 text-xs text-gray-500 flex items-center">
              <i class="fas fa-info-circle mr-1"></i>
              Optional - E.164 format recommended (+country code + number)
            </p>
          </div>

          <!-- Password -->
          <div class="group">
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-lock mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                placeholder="Create a password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500 flex items-center">
              <i class="fas fa-info-circle mr-1"></i>
              Password must be at least 8 characters long
            </p>
          </div>

          <!-- Confirm Password -->
          <div class="group">
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              <i class="fas fa-shield-alt mr-2 text-gray-500 group-focus-within:text-blue-600"></i>
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start group">
          <div class="flex items-center h-5 mt-1">
            <input
              id="terms"
              v-model="formData.acceptTerms"
              type="checkbox"
              required
              class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded transition-colors duration-200"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-700 leading-relaxed">
              I agree to the 
              <a href="#" class="text-blue-600 hover:text-blue-700 font-semibold underline decoration-1 underline-offset-2 hover:decoration-2 transition-all duration-200">Terms of Service</a> 
              and 
              <a href="#" class="text-blue-600 hover:text-blue-700 font-semibold underline decoration-1 underline-offset-2 hover:decoration-2 transition-all duration-200">Privacy Policy</a>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span v-if="!isSubmitting" class="flex items-center">
              <i class="fas fa-user-plus mr-2"></i>
              Create Account
            </span>
            <span v-else class="flex items-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Creating Account...
            </span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center pt-6 border-t border-gray-100">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link 
              to="/login" 
              class="font-semibold text-blue-600 hover:text-blue-700 underline decoration-1 underline-offset-2 hover:decoration-2 transition-all duration-200 ml-1"
            >
              Sign in here
            </router-link>
          </p>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toastStore = useToastStore()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const validateForm = () => {
  if (!formData.username.trim()) {
    throw new Error('Username is required')
  }

  if (formData.username.length < 3 || formData.username.length > 30) {
    throw new Error('Username must be between 3 and 30 characters')
  }

  // Temporary: make username validation less strict for testing
  if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
    throw new Error('Username can only contain letters, numbers, underscores, dots, and hyphens')
  }

  if (!formData.firstName.trim()) {
    throw new Error('First name is required')
  }

  if (!formData.lastName.trim()) {
    throw new Error('Last name is required')
  }

  if (!formData.email.trim()) {
    throw new Error('Email is required')
  }

  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    throw new Error('Please enter a valid email address')
  }

  if (!formData.city.trim()) {
    throw new Error('City is required')
  }

  if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
    throw new Error('Please enter a valid phone number in E.164 format')
  }

  if (!formData.password) {
    throw new Error('Password is required')
  }

  if (formData.password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }

  if (formData.password !== formData.confirmPassword) {
    throw new Error('Passwords do not match')
  }

  if (!formData.acceptTerms) {
    throw new Error('You must accept the terms and conditions')
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    validateForm()

    console.log('Sending registration data:', {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      city: formData.city,
      phoneNumber: formData.phoneNumber || null,
    })

    // Call the actual registration API
    const result = await authStore.register({
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      city: formData.city,
      phoneNumber: formData.phoneNumber || null,
      password: formData.password
    })

    if (result.success) {
      toastStore.showSuccess('Welcome! Your account has been created successfully and you are now logged in.')
      
      // Redirect to profile page since user is now logged in
      router.push('/profile')
    }

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific error types
    if (error.response?.status === 409) {
      toastStore.showError('An account with this email already exists. Please try logging in instead.')
    } else if (error.response?.status === 400) {
      toastStore.showError(error.response?.data?.message || 'Please check your information and try again.')
    } else {
      toastStore.showError(error.message || 'Failed to create account. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
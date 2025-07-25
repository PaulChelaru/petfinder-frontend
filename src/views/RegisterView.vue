<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <NavBar />
    
    <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div class="absolute top-0 left-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center animate-fade-in-up">
          <div class="mx-auto w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C10.896 2 10 2.896 10 4s.896 2 2 2 2-.896 2-2-.896-2-2-2zM8.5 7C7.672 7 7 7.672 7 8.5S7.672 10 8.5 10 10 9.328 10 8.5 9.328 7 8.5 7zm7 0c-.828 0-1.5.672-1.5 1.5S14.672 10 15.5 10 17 9.328 17 8.5 16.328 7 15.5 7zM12 9c-2.5 0-4.5 1.5-4.5 4 0 1.5 1 3 2.5 4 .8.5 1.7.8 2.5.8s1.7-.3 2.5-.8c1.5-1 2.5-2.5 2.5-4 0-2.5-2-4-4.5-4zm-6 4.5C5.5 12.672 4.828 12 4 12s-1.5.672-1.5 1.5.672 1.5 1.5 1.5.828-.672 1.5-1.5-.672-1.5-1.5-1.5zm12 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"/>
            </svg>
          </div>
          <h2 class="text-4xl font-extrabold text-gray-900 mb-2">Join our community</h2>
          <p class="text-lg text-gray-600">
            Help reunite lost pets and find homes for pets in need
          </p>
          <div class="mt-4 w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto"></div>
        </div>
      </div>

      <div class="mt-12 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <GenericCard customClasses="py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 animate-fade-in-up animation-delay-300">
          <form @submit.prevent="handleRegister" class="space-y-8">
            <div class="grid grid-cols-2 gap-6">
              <FormField
                v-model="form.firstName"
                label="First name"
                type="text"
                autocomplete="given-name"
                :required="true"
                :error="!!errors.firstName"
                :error-message="errors.firstName"
                placeholder="John"
                custom-classes="animate-fade-in-left animation-delay-500"
              >
                <template #icon>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </template>
              </FormField>

              <BaseInput
                id="lastName"
                v-model="form.lastName"
                label="Last name"
                type="text"
                autocomplete="family-name"
                required
                :error="errors.lastName"
                placeholder="Doe"
                class="animate-fade-in-right animation-delay-500"
              >
                <template #icon>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </template>
              </BaseInput>
            </div>

            <BaseInput
              id="username"
              v-model="form.username"
              label="Username"
              type="text"
              autocomplete="username"
              required
              :error="errors.username"
              placeholder="johndoe123"
              hint="Choose a unique username for your profile"
              class="animate-fade-in-up animation-delay-600"
            >
              <template #icon>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </BaseInput>

            <BaseInput
              id="email"
              v-model="form.email"
              label="Email address"
              type="email"
              autocomplete="email"
              required
              :error="errors.email"
              placeholder="john@example.com"
              class="animate-fade-in-up animation-delay-700"
            >
              <template #icon>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </template>
            </BaseInput>

            <BaseInput
              id="city"
              v-model="form.city"
              label="City"
              type="text"
              required
              :error="errors.city"
              placeholder="New York"
              hint="Your current city of residence"
              class="animate-fade-in-up animation-delay-800"
            >
              <template #icon>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
            </BaseInput>

            <BaseInput
              id="phoneNumber"
              v-model="form.phoneNumber"
              label="Phone number (optional)"
              type="tel"
              autocomplete="tel"
              :error="errors.phoneNumber"
              placeholder="+1234567890"
              hint="Include country code for international numbers"
              class="animate-fade-in-up animation-delay-900"
            >
              <template #icon>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </template>
            </BaseInput>

            <div class="grid grid-cols-2 gap-6">
              <BaseInput
                id="password"
                v-model="form.password"
                label="Password"
                type="password"
                autocomplete="new-password"
                required
                :error="errors.password"
                placeholder="••••••••"
                hint="8+ characters with letters & numbers"
                class="animate-fade-in-left animation-delay-1000"
              >
                <template #icon>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </template>
              </BaseInput>

              <BaseInput
                id="confirmPassword"
                v-model="form.confirmPassword"
                label="Confirm password"
                type="password"
                autocomplete="new-password"
                required
                :error="errors.confirmPassword"
                placeholder="••••••••"
                class="animate-fade-in-right animation-delay-1000"
              >
                <template #icon>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </template>
              </BaseInput>
            </div>

            <div class="flex items-start animate-fade-in-up animation-delay-1100">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2 transition-all duration-200"
                  required
                >
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">
                  I accept the
                  <a href="#" class="text-primary-600 hover:text-primary-500 font-semibold underline decoration-primary-300 hover:decoration-primary-500 transition-colors duration-200">Terms of Service</a>
                  and
                  <a href="#" class="text-primary-600 hover:text-primary-500 font-semibold underline decoration-primary-300 hover:decoration-primary-500 transition-colors duration-200">Privacy Policy</a>
                </label>
              </div>
            </div>
            <div v-if="errors.acceptTerms" class="text-red-600 text-sm flex items-center">
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.acceptTerms }}
            </div>

            <div class="animate-fade-in-up animation-delay-1200">
              <ActionButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="isLoading"
                :disabled="isLoading"
                class="w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <template v-if="!isLoading">
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </template>
                <template v-else>
                  Creating Account...
                </template>
              </ActionButton>
            </div>

            <div class="text-center animate-fade-in-up animation-delay-1300">
              <p class="text-sm text-gray-600">
                Already have an account?
                <router-link 
                  to="/login" 
                  class="font-semibold text-primary-600 hover:text-primary-500 underline decoration-primary-300 hover:decoration-primary-500 transition-all duration-200 hover:scale-105 inline-block"
                >
                  Sign in here
                </router-link>
              </p>
            </div>
          </form>
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import FormField from '@/components/forms/FormField.vue'
import ActionButton from '@/components/buttons/ActionButton.vue'
import GenericCard from '@/components/cards/GenericCard.vue'
import NavBar from '../layouts/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isLoading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  city: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  city: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  // First name validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  } else if (form.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
    isValid = false
  }

  // Last name validation
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  } else if (form.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
    isValid = false
  }

  // Username validation
  if (!form.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores'
    isValid = false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // City validation
  if (!form.city.trim()) {
    errors.city = 'City is required'
    isValid = false
  } else if (form.city.length < 2) {
    errors.city = 'City must be at least 2 characters'
    isValid = false
  }

  // Phone number validation (optional)
  if (form.phoneNumber && !/^\+?[\d\s\-\(\)]{10,}$/.test(form.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
    errors.password = 'Password must contain both letters and numbers'
    isValid = false
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Terms acceptance validation
  if (!form.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    await authStore.register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      phoneNumber: form.phoneNumber.trim() || undefined,
      password: form.password
    })

    toastStore.add({
      type: 'success',
      title: 'Account created successfully!',
      message: 'Welcome to PetFinder! You can now start helping pets find their forever homes.'
    })

    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)

    if (error.response?.data?.errors) {
      // Handle validation errors from backend
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach(field => {
        if (errors.hasOwnProperty(field)) {
          errors[field] = backendErrors[field]
        }
      })
    } else {
      // Handle general error
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toastStore.add({
        type: 'error',
        title: 'Registration Failed',
        message
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

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
              <i class="fas fa-paw w-10 h-10 text-white text-4xl"></i>
            </div>
            <h2 class="text-4xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
            <p class="text-lg text-gray-600">
              Sign in to help reunite lost pets with their families
            </p>
            <div class="mt-4 w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto"></div>
          </div>
        </div>

      <div class="mt-12 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <BaseCard variant="glass" class="py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 animate-fade-in-up animation-delay-300">
          <form @submit.prevent="handleLogin" class="space-y-8">
            <BaseInput
              id="email"
              v-model="form.email"
              label="Email address"
              type="email"
              autocomplete="email"
              required
              :error="errors.email"
              placeholder="Enter your email"
              class="animate-fade-in-up animation-delay-500"
            >
              <template #icon>
                <i class="fas fa-envelope h-5 w-5"></i>
              </template>
            </BaseInput>

            <BaseInput
              id="password"
              v-model="form.password"
              label="Password"
              type="password"
              autocomplete="current-password"
              required
              :error="errors.password"
              placeholder="Enter your password"
              class="animate-fade-in-up animation-delay-600"
            >
              <template #icon>
                <i class="fas fa-lock h-5 w-5"></i>
              </template>
            </BaseInput>

            <div class="flex items-center justify-between animate-fade-in-up animation-delay-700">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="form.rememberMe"
                  name="remember-me"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2 transition-all duration-200"
                />
                <label for="remember-me" class="ml-2 block text-sm font-medium text-gray-700">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-semibold text-primary-600 hover:text-primary-500 underline decoration-primary-300 hover:decoration-primary-500 transition-all duration-200 hover:scale-105 inline-block">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div v-if="generalError" class="rounded-2xl bg-red-50 border border-red-200 p-4 animate-fade-in-up animation-delay-800">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-times-circle h-5 w-5 text-red-400"></i>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ generalError }}</h3>
                </div>
              </div>
            </div>

            <div class="animate-fade-in-up animation-delay-900">
              <ActionButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="loading"
                :disabled="loading"
                class="w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <template v-if="!loading">
                  <i class="fas fa-sign-in-alt w-5 h-5 mr-2"></i>
                  Sign in
                </template>
                <template v-else>
                  Signing in...
                </template>
              </ActionButton>
            </div>
          </form>

          <div class="mt-8 animate-fade-in-up animation-delay-1000">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500 font-medium">Don't have an account?</span>
              </div>
            </div>

            <div class="mt-6">
              <router-link to="/register" class="block">
                <ActionButton 
                  variant="outline" 
                  size="lg" 
                  class="w-full transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <i class="fas fa-user-plus w-5 h-5 mr-2"></i>
                  Create account
                </ActionButton>
              </router-link>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseCard from '@/components/cards/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ActionButton from '@/components/buttons/ActionButton.vue'
import NavBar from '@/layouts/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)
const generalError = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  generalError.value = ''

  // Email validation
  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })
    
    // Only show success notification if login was successful
    toastStore.success({
      title: 'Welcome back!',
      message: 'You have successfully signed in to your account.',
      actions: [
        {
          label: 'Go to Profile',
          primary: true,
          handler: () => router.push('/profile')
        }
      ]
    })
    
    // Redirect to profile or intended page
    const redirect = router.currentRoute.value.query.redirect || '/profile'
    router.push(redirect)
  } catch (error) {
    console.error('Login error:', error)
    
    if (error.response?.status === 401) {
      toastStore.error({
        title: 'Login Failed',
        message: 'Invalid email or password. Please check your credentials and try again.',
        actions: [
          {
            label: 'Reset Password',
            primary: false,
            handler: () => router.push('/forgot-password')
          }
        ]
      })
    } else if (error.response?.status === 403) {
      toastStore.error({
        title: 'Access Forbidden',
        message: 'Your account access has been restricted. Please contact support for assistance.',
        actions: [
          {
            label: 'Contact Support',
            primary: true,
            handler: () => window.open('mailto:support@petfinder.com', '_blank')
          }
        ]
      })
    } else if (error.response?.status === 429) {
      toastStore.warning({
        title: 'Too Many Attempts',
        message: 'Too many login attempts. Please try again later.',
        duration: 8000
      })
    } else {
      toastStore.error({
        title: 'Connection Error',
        message: 'An unexpected error occurred. Please check your connection and try again.',
        actions: [
          {
            label: 'Retry',
            primary: true,
            handler: () => handleLogin()
          }
        ]
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

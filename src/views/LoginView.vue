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
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
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
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
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
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
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
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
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
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create new account
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
import BaseInput from '@/components/forms/BaseInput.vue'
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
    
    toastStore.success({
      title: 'Welcome back!',
      message: 'You have successfully signed in to your account.',
      actions: [
        {
          label: 'Go to Dashboard',
          primary: true,
          handler: () => router.push('/dashboard')
        }
      ]
    })
    
    // Redirect to dashboard or intended page
    const redirect = router.currentRoute.value.query.redirect || '/dashboard'
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

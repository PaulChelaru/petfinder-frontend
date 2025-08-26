<template>
  <nav class="bg-white border-b-2 border-primary-500 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link 
            to="/" 
            class="flex items-center space-x-3 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
              <i class="fas fa-paw text-white text-xl"></i>
            </div>
            <span class="hidden sm:block">PetFinder</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <router-link
              to="/"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50"
              :class="isActiveRoute('/') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600'"
            >
              <i class="fas fa-home mr-2"></i>
              Home
            </router-link>
            
            <router-link
              to="/announcements"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50"
              :class="isActiveRoute('/announcements') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600'"
            >
              <i class="fas fa-bullhorn mr-2"></i>
              Announcements
            </router-link>

            <router-link
              v-if="authStore.isAuthenticated"
              to="/my-announcements"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50"
              :class="isActiveRoute('/my-announcements') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600'"
            >
              <i class="fas fa-list mr-2"></i>
              My Announcements
            </router-link>
          </div>
        </div>

        <!-- Desktop Auth Buttons -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center space-x-4">
            <template v-if="!authStore.isAuthenticated">
              <router-link
                to="/login"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <i class="fas fa-sign-in-alt mr-2"></i>
                Sign In
              </router-link>
              <router-link
                to="/register"
                class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <i class="fas fa-user-plus mr-2"></i>
                Sign Up
              </router-link>
            </template>
            
            <template v-else>
              <!-- User Dropdown -->
              <div class="relative" ref="userMenuRef">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-primary-600"></i>
                  </div>
                  <span class="hidden lg:block">{{ authStore.user?.firstName || 'User' }}</span>
                  <i class="fas fa-chevron-down text-xs transition-transform duration-200" :class="{ 'transform rotate-180': showUserMenu }"></i>
                </button>

                <!-- Dropdown Menu -->
                <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div
                    v-show="showUserMenu"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  >
                    <router-link
                      to="/profile"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      @click="showUserMenu = false"
                    >
                      <i class="fas fa-user-circle mr-3 text-gray-400"></i>
                      Profile
                    </router-link>
                    
                    <router-link
                      to="/settings"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      @click="showUserMenu = false"
                    >
                      <i class="fas fa-cog mr-3 text-gray-400"></i>
                      Settings
                    </router-link>
                    
                    <div class="border-t border-gray-100 my-1"></div>
                    
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <i class="fas fa-sign-out-alt mr-3 text-red-500"></i>
                      Sign Out
                    </button>
                  </div>
                </Transition>
              </div>
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            <i class="fas fa-bars text-xl" :class="{ 'hidden': showMobileMenu }"></i>
            <i class="fas fa-times text-xl" :class="{ 'hidden': !showMobileMenu }"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-show="showMobileMenu" class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            class="flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
            :class="isActiveRoute('/') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-home mr-3"></i>
            Home
          </router-link>
          
          <router-link
            to="/announcements"
            class="flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
            :class="isActiveRoute('/announcements') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-bullhorn mr-3"></i>
            Announcements
          </router-link>

          <router-link
            v-if="authStore.isAuthenticated"
            to="/my-announcements"
            class="flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
            :class="isActiveRoute('/my-announcements') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-list mr-3"></i>
            My Announcements
          </router-link>

          <template v-if="!authStore.isAuthenticated">
            <div class="border-t border-gray-200 my-2"></div>
            <router-link
              to="/login"
              class="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-sign-in-alt mr-3"></i>
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 mx-3 mt-2"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-user-plus mr-3"></i>
              Sign Up
            </router-link>
          </template>

          <template v-else>
            <div class="border-t border-gray-200 my-2"></div>
            <div class="flex items-center px-3 py-2">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-user text-primary-600"></i>
              </div>
              <span class="text-sm font-medium text-gray-700">{{ authStore.user?.firstName || 'User' }}</span>
            </div>
            
            <router-link
              to="/profile"
              class="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-user-circle mr-3"></i>
              Profile
            </router-link>
            
            <router-link
              to="/settings"
              class="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-cog mr-3"></i>
              Settings
            </router-link>
            
            <button
              @click="handleLogout"
              class="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <i class="fas fa-sign-out-alt mr-3"></i>
              Sign Out
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const userMenuRef = ref(null)

const isActiveRoute = (path) => {
  return route.path === path
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    showUserMenu.value = false
    showMobileMenu.value = false
    
    toastStore.success({
      title: 'Signed Out',
      message: 'You have been successfully signed out. See you soon!',
      duration: 4000
    })
    
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
    toastStore.error({
      title: 'Sign Out Error',
      message: 'An error occurred while signing out. Please try again.'
    })
  }
}

// Close menus when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Add any custom styles if needed */
.bg-grid-pattern {
  background-image: radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>

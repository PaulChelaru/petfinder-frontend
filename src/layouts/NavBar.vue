<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C10.896 2 10 2.896 10 4s.896 2 2 2 2-.896 2-2-.896-2-2-2zM8.5 7C7.672 7 7 7.672 7 8.5S7.672 10 8.5 10 10 9.328 10 8.5 9.328 7 8.5 7zm7 0c-.828 0-1.5.672-1.5 1.5S14.672 10 15.5 10 17 9.328 17 8.5 16.328 7 15.5 7zM12 9c-2.5 0-4.5 1.5-4.5 4 0 1.5 1 3 2.5 4 .8.5 1.7.8 2.5.8s1.7-.3 2.5-.8c1.5-1 2.5-2.5 2.5-4 0-2.5-2-4-4.5-4zm-6 4.5C5.5 12.672 4.828 12 4 12s-1.5.672-1.5 1.5.672 1.5 1.5 1.5.828-.672 1.5-1.5-.672-1.5-1.5-1.5zm12 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold text-gray-900">PetFinder</span>
              <span class="text-xs text-gray-500 -mt-1">Lost & Found Pets</span>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden lg:flex items-center space-x-1">
          <router-link
            to="/"
            class="nav-link"
            active-class="nav-link-active"
          >
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </router-link>
          
          <router-link
            to="/announcements"
            class="nav-link"
            active-class="nav-link-active"
          >
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Pets
          </router-link>
          
          <router-link
            v-if="isAuthenticated"
            to="/my-announcements"
            class="nav-link"
            active-class="nav-link-active"
          >
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            My Announcements
          </router-link>
        </div>

        <!-- User Section -->
        <div class="hidden lg:flex items-center space-x-3">
          <template v-if="isAuthenticated">
            <!-- User Info with Dashboard Link -->
            <router-link
              to="/dashboard"
              class="flex items-center space-x-2 px-3 py-2 h-10 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                <span class="text-primary-700 font-medium text-sm">
                  {{ userInitials }}
                </span>
              </div>
              <div class="hidden sm:block">
                <div class="text-gray-700 text-sm font-medium leading-tight">{{ user?.firstName || user?.email }}</div>
                <div class="text-gray-500 text-xs leading-tight">Go to Dashboard</div>
              </div>
            </router-link>
            
            <!-- Logout Button -->
            <ActionButton
              variant="outline"
              size="sm"
              :loading="loading"
              @click="handleLogout"
              class="h-10 whitespace-nowrap"
            >
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
                <span class="hidden sm:inline">Logout</span>
              </div>
            </ActionButton>
          </template>
          
          <template v-else>
            <router-link to="/login">
              <ActionButton variant="outline" size="sm">
                Login
              </ActionButton>
            </router-link>
            <router-link to="/register">
              <ActionButton variant="primary" size="sm">
                Sign Up
              </ActionButton>
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="lg:hidden flex items-center">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2 rounded-md"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="showMobileMenu" class="lg:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
        <router-link
          to="/"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="showMobileMenu = false"
        >
          <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </router-link>
        
        <router-link
          to="/announcements"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="showMobileMenu = false"
        >
          <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse Pets
        </router-link>
        
        <router-link
          v-if="isAuthenticated"
          to="/my-announcements"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="showMobileMenu = false"
        >
          <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          My Announcements
        </router-link>
        
        <router-link
          v-if="isAuthenticated"
          to="/dashboard"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="showMobileMenu = false"
        >
          <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          Dashboard
        </router-link>
        
        <template v-if="isAuthenticated">
          <div class="pt-4 pb-2 px-4 border-t border-gray-200">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-medium text-sm">
                  {{ userInitials }}
                </span>
              </div>
              <div>
                <div class="text-gray-700 text-sm font-medium">{{ user?.firstName || user?.email }}</div>
                <div class="text-gray-500 text-xs">{{ user?.email }}</div>
              </div>
            </div>
            <ActionButton
              variant="outline"
              size="sm"
              :loading="loading"
              @click="handleLogout"
              full-width
              class="mt-2"
            >
              <div class="flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
                Logout
              </div>
            </ActionButton>
          </div>
        </template>
        
        <template v-else>
          <div class="pt-4 pb-2 px-4 border-t border-gray-200 space-y-2">
            <router-link to="/login">
              <ActionButton variant="outline" size="sm" full-width>
                Login
              </ActionButton>
            </router-link>
            <router-link to="/register">
              <ActionButton variant="primary" size="sm" full-width>
                Sign Up
              </ActionButton>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import ActionButton from '@/components/buttons/ActionButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const showMobileMenu = ref(false)
const loading = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value) return '?'
  const firstName = user.value.firstName || ''
  const lastName = user.value.lastName || ''
  const email = user.value.email || ''
  
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  } else if (firstName) {
    return firstName.charAt(0).toUpperCase()
  } else if (email) {
    return email.charAt(0).toUpperCase()
  }
  return '?'
})

const handleLogout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    toastStore.showSuccess('Logged out successfully')
    showMobileMenu.value = false
    router.push('/')
  } catch (error) {
    toastStore.showError('Error logging out')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.nav-link-active {
  color: #2563eb;
  background-color: #eff6ff;
}

.nav-link-active:hover {
  color: #1d4ed8;
  background-color: #dbeafe;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.mobile-nav-link-active {
  color: #2563eb;
  background-color: #eff6ff;
}

.mobile-nav-link-active:hover {
  color: #1d4ed8;
  background-color: #dbeafe;
}
</style>

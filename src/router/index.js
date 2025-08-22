import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: () => import('../views/AnnouncementsView.vue')
  },
  {
    path: '/my-announcements',
    name: 'MyAnnouncements',
    component: () => import('../views/MyAnnouncementsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/demo/toasts',
    name: 'ToastDemo',
    component: () => import('../views/ToastDemoView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/HomeView.vue') // Redirect to home for now
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/HomeView.vue') // Redirect to home for now
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  
  // Always check token validity for any route navigation
  const isValid = authStore.checkAuthStatus()
  
  if (!isValid && authStore.isAuthenticated) {
    // Auth store thinks we're authenticated but token check failed
    return // checkAuthStatus will handle redirect
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router

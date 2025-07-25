<template>
  <div id="app">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import ToastContainer from './layouts/ToastContainer.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth state from cookie
  authStore.initializeAuth()
})
</script>

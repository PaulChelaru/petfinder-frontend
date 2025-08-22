<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <NavBar v-if="showNavbar" />
    
    <!-- Page Content -->
    <main :class="mainClasses">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer v-if="showFooter" class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <i class="fas fa-paw w-5 h-5 text-white"></i>
              </div>
              <span class="text-xl font-bold">PetFinder</span>
            </div>
            <p class="text-gray-400 text-sm">
              Helping lost pets find their way home and connecting abandoned animals with loving families.
            </p>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><router-link to="/" class="hover:text-white transition-colors">Home</router-link></li>
              <li><router-link to="/about" class="hover:text-white transition-colors">About</router-link></li>
              <li><router-link to="/contact" class="hover:text-white transition-colors">Contact</router-link></li>
            </ul>
          </div>
          
          <!-- Support -->
          <div>
            <h3 class="font-semibold mb-4">Support</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <!-- Contact -->
          <div>
            <h3 class="font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>help@petfinder.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 PetFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
    
    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NavBar from '../../layouts/NavBar.vue'
import ToastContainer from '../../layouts/ToastContainer.vue'

const props = defineProps({
  showNavbar: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  fullHeight: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Boolean,
    default: false
  }
})

const mainClasses = computed(() => {
  let classes = []
  
  if (props.fullHeight) {
    classes.push('min-h-screen')
  }
  
  if (props.padding) {
    classes.push('px-4 sm:px-6 lg:px-8')
  }
  
  return classes.join(' ')
})
</script>

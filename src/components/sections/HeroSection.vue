<template>
  <div class="relative bg-gradient-to-br from-slate-50 via-white to-orange-50 overflow-hidden min-h-screen flex items-center">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-slate-200/20 bg-grid-pattern opacity-50"></div>
    
    <!-- Animated Background Elements -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-8 left-20 w-96 h-96 bg-accent-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
    
    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="py-20 lg:py-32">
        <div class="text-center">
          <!-- Icon -->
          <div class="mb-8 flex justify-center">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl border border-primary-200">
              <i class="fas fa-paw w-12 h-12 text-white text-5xl"></i>
            </div>
          </div>
          
          <!-- Main Heading -->
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            <span class="block">{{ mainTitle }}</span>
            <span class="block text-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {{ highlightTitle }}
            </span>
          </h1>
          
          <!-- Description -->
          <p class="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            {{ description }}
          </p>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <BaseButton 
              variant="primary" 
              size="xl" 
              class="w-full sm:w-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <slot name="primary-action">
                {{ primaryButtonText }}
              </slot>
            </BaseButton>
            <BaseButton 
              variant="outline" 
              size="xl" 
              class="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 backdrop-blur-sm"
            >
              <slot name="secondary-action">
                {{ secondaryButtonText }}
              </slot>
            </BaseButton>
          </div>
          
          <!-- Trust Indicators -->
          <div class="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600">
            <div class="flex items-center gap-2">
              <i class="fas fa-check-circle w-5 h-5 text-green-500"></i>
              <span class="text-sm font-medium">{{ stat1 }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-check-circle w-5 h-5 text-green-500"></i>
              <span class="text-sm font-medium">{{ stat2 }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-check-circle w-5 h-5 text-green-500"></i>
              <span class="text-sm font-medium">{{ stat3 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../buttons/BaseButton.vue'

const props = defineProps({
  mainTitle: {
    type: String,
    default: 'Lost & Found Pets'
  },
  highlightTitle: {
    type: String,
    default: 'Reunited'
  },
  description: {
    type: String,
    default: 'The fastest way to reunite lost pets with their families and help abandoned animals find loving homes through adoption.'
  },
  primaryButtonText: {
    type: String,
    default: 'Join the Community'
  },
  secondaryButtonText: {
    type: String,
    default: 'Sign In'
  },
  stat1: {
    type: String,
    default: 'Free to Use'
  },
  stat2: {
    type: String,
    default: 'Instant Alerts'
  },
  stat3: {
    type: String,
    default: '24/7 Support'
  }
})
</script>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>

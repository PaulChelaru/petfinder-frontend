<template>
  <div 
    class="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
    :class="animationClass"
  >
    <!-- Icon -->
    <div class="flex justify-center mb-6">
      <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <span class="text-3xl">{{ icon }}</span>
      </div>
    </div>
    
    <!-- Content -->
    <div class="text-center">
      <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
        {{ title }}
      </h3>
      <p class="text-gray-600 leading-relaxed">
        {{ description }}
      </p>
    </div>
    
    <!-- Hover Effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-primary-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  }
})

const isVisible = ref(false)

const animationClass = computed(() => {
  return isVisible.value ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
})

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, props.delay)
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

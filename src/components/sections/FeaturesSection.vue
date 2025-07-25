<template>
  <div class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {{ title }}
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
      
      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
        <FeatureCard 
          v-for="(feature, index) in features" 
          :key="index"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
          :delay="index * 100"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FeatureCard from '../ui/FeatureCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Helping Pets & Families Reconnect'
  },
  subtitle: {
    type: String,
    default: 'Our platform provides comprehensive tools to help lost pets find their way home and connect abandoned animals with loving families.'
  },
  features: {
    type: Array,
    default: () => [
      {
        icon: '🚨',
        title: 'Report Missing Pets',
        description: 'Quickly report your lost pet with photos, description, and last known location to spread the word'
      },
      {
        icon: '👀',
        title: 'Found a Pet?',
        description: 'Help reunite found pets with their owners by posting their details and location'
      },
      {
        icon: '🏠',
        title: 'Pet Adoption',
        description: 'Browse pets available for adoption and give rescued animals their forever home'
      }
    ]
  }
})
</script>

<template>
  <PageLayout>
    <!-- Hero Section -->
    <HeroSection 
      main-title="Lost & Found Pets"
      highlight-title="Reunited"
      description="The fastest way to reunite lost pets with their families and help abandoned animals find loving homes through adoption."
      primary-button-text="Join the Community"
      secondary-button-text="Sign In"
      stat1="Free to Use"
      stat2="Instant Alerts"
      stat3="24/7 Support"
    >
      <template #primary-action>
        <router-link to="/register" class="contents">
          Join the Community
        </router-link>
      </template>
      <template #secondary-action>
        <router-link to="/login" class="contents">
          Sign In
        </router-link>
      </template>
    </HeroSection>

    <!-- Features Section -->
    <FeaturesSection 
      title="Helping Pets & Families Reconnect"
      subtitle="Our platform provides comprehensive tools to help lost pets find their way home and connect abandoned animals with loving families."
      :features="features"
    />

    <!-- Call to Action -->
    <CTASection
      title="Every Second Counts for Lost Pets"
      description="Join our community of pet lovers dedicated to reuniting families and saving lives through adoption."
      button-text="Start Helping Pets Today"
      variant="primary"
    >
      <router-link to="/register" class="contents">
        Start Helping Pets Today
      </router-link>
    </CTASection>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/layout/PageLayout.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturesSection from '@/components/sections/FeaturesSection.vue'
import CTASection from '@/components/sections/CTASection.vue'

// Features data for the features section
const features = [
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
</script>

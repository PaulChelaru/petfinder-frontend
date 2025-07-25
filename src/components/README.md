# Components Structure Documentation

## Overview
The frontend components have been organized into logical categories for better maintainability and reusability.

## Folder Structure

```
src/components/
├── buttons/              # Reusable button components
├── cards/               # Card components for displaying content
├── forms/               # Form inputs and form-related components
├── icons/               # SVG icon components
├── layout/              # Layout and structural components
├── modals/              # Modal dialog components
├── sections/            # Page section components
├── ui/                  # General UI components
└── index.js             # Main export file for all components
```

## Component Categories

### Buttons (`/buttons/`)
- `ActionButton.vue` - Modern button with variants, loading states, and icons
- `BaseButton.vue` - Basic button component (legacy)
- `index.js` - Exports all button components

### Cards (`/cards/`)
- `AnnouncementCard.vue` - Pet announcement cards with different variants
- `AnnouncementGrid.vue` - Grid layout for announcements
- `BaseCard.vue` - Basic card component
- `DetailCard.vue` - Card for displaying detailed information
- `GenericCard.vue` - Flexible card with header, content, and action slots
- `ProfileCard.vue` - User profile display card
- `QuickActionCard.vue` - Card for quick actions
- `index.js` - Exports all card components

### Forms (`/forms/`)
- `AnnouncementFilters.vue` - Filters for announcements
- `BaseInput.vue` - Basic input component (legacy)
- `FileUpload.vue` - Drag & drop file upload component
- `FormField.vue` - Complete form field with label, validation, and help text
- `FormGroup.vue` - Container for grouping form fields
- `FormInput.vue` - Basic input with styling and states
- `FormSelect.vue` - Select dropdown with validation
- `SearchAndFilter.vue` - Combined search and filter component
- `index.js` - Exports all form components

### Icons (`/icons/`)
- `ClockIcon.vue` - Clock/time icon
- `DocumentIcon.vue` - Document icon
- `EmailIcon.vue` - Email icon
- `InfoIcon.vue` - Information icon
- `LocationIcon.vue` - Location/map pin icon
- `PhoneIcon.vue` - Phone icon
- `index.js` - Exports all icon components

### Layout (`/layout/`)
- `PageLayout.vue` - Main page layout wrapper
- `index.js` - Exports all layout components

### Modals (`/modals/`)
- `AnnouncementDetailModal.vue` - Modal for viewing announcement details
- `AnnouncementFormModal.vue` - Modal for creating/editing announcements
- `BaseModal.vue` - Reusable modal with slots and size variants
- `ConfirmationModal.vue` - Modal for confirmation dialogs
- `ResolveAnnouncementModal.vue` - Modal for resolving announcements
- `index.js` - Exports all modal components

### Sections (`/sections/`)
- `CTASection.vue` - Call-to-action sections
- `FeaturesSection.vue` - Features showcase section
- `HeroSection.vue` - Hero section for landing pages
- `index.js` - Exports all section components

### UI (`/ui/`)
- `ContactLink.vue` - Clickable contact information (phone, email)
- `EmptyState.vue` - Component for empty states
- `FeatureCard.vue` - Card for displaying features
- `ImageGallery.vue` - Image gallery component
- `InfoField.vue` - Field for displaying key-value information
- `LoadingSpinner.vue` - Loading spinner component
- `LoadingWrapper.vue` - Wrapper component for loading states
- `NotificationPreference.vue` - Notification preferences
- `RoleBadge.vue` - Badge for user roles
- `StatusBadge.vue` - Badge for status indicators
- `WelcomeSection.vue` - Welcome section component
- `index.js` - Exports all UI components

## Usage Examples

### Importing Components

```javascript
// Import specific components
import { ActionButton, StatusBadge } from '@/components'

// Import from specific categories
import ActionButton from '@/components/buttons/ActionButton.vue'
import GenericCard from '@/components/cards/GenericCard.vue'
import FormField from '@/components/forms/FormField.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
```

### Using ActionButton

```vue
<template>
  <!-- Primary button with icon -->
  <ActionButton 
    variant="primary" 
    size="md" 
    :loading="isLoading"
    @click="handleClick"
  >
    Save Changes
  </ActionButton>

  <!-- Danger button with custom icon -->
  <ActionButton 
    variant="danger" 
    size="sm" 
    :icon="TrashIcon"
    @click="handleDelete"
  >
    Delete
  </ActionButton>
</template>
```

### Using GenericCard

```vue
<template>
  <GenericCard variant="lost">
    <template #header>
      <h3>Lost Pet</h3>
    </template>
    
    <div class="space-y-4">
      <p>Pet information goes here...</p>
    </div>
    
    <template #actions>
      <ActionButton variant="primary">Contact Owner</ActionButton>
    </template>
  </GenericCard>
</template>
```

### Using FormField

```vue
<template>
  <FormField
    v-model="petName"
    label="Pet Name"
    placeholder="Enter pet name"
    :required="true"
    :error="errors.petName"
    :error-message="errors.petName"
    help-text="The name your pet responds to"
  />
</template>
```

### Using BaseModal

```vue
<template>
  <BaseModal
    :is-visible="showModal"
    title="Edit Pet Information"
    size="lg"
    @close="showModal = false"
  >
    <FormGroup>
      <FormField v-model="petData.name" label="Pet Name" />
      <FormField v-model="petData.type" label="Pet Type" />
    </FormGroup>
    
    <template #footer>
      <ActionButton variant="secondary" @click="showModal = false">
        Cancel
      </ActionButton>
      <ActionButton variant="primary" @click="savePet">
        Save Changes
      </ActionButton>
    </template>
  </BaseModal>
</template>
```

## Component Features

### ActionButton Features
- Multiple variants: `primary`, `secondary`, `danger`, `success`, `warning`, `outline`
- Three sizes: `sm`, `md`, `lg`
- Loading state with spinner
- Icon support
- Hover and active animations
- Disabled state handling

### StatusBadge Features
- Predefined variants for pet statuses: `lost`, `found`, `resolved`
- General variants: `primary`, `secondary`, `success`, `warning`, `danger`
- Icon support
- Multiple sizes

### GenericCard Features
- Color-coded variants for different announcement types
- Flexible slot system (header, content, footer, actions)
- Border accent colors
- Hover animations

### BaseModal Features
- Multiple sizes: `sm`, `md`, `lg`, `xl`
- Backdrop click handling
- Keyboard navigation support
- Header, body, and footer slots
- Automatic body scroll prevention

### Form Components Features
- Consistent styling across all form elements
- Validation state handling
- Error message display
- Help text support
- Required field indicators
- Size variants

## Best Practices

1. **Import Optimization**: Use named imports from the main index file when possible
2. **Prop Validation**: All components include proper prop validation
3. **Accessibility**: Components follow accessibility best practices
4. **Consistent Styling**: All components use Tailwind CSS classes consistently
5. **Slot Usage**: Prefer slots over props for complex content
6. **Event Naming**: Use descriptive event names following Vue conventions

## Migration Guide

When updating existing code to use the new component structure:

1. Update import paths to point to the new component locations
2. Replace multiple similar components with the new reusable variants
3. Use the new ActionButton instead of BaseButton for enhanced features
4. Leverage GenericCard for consistent card styling
5. Replace custom form inputs with FormField for better validation and styling

## Performance Considerations

- Components are designed to be tree-shakeable
- Lazy loading is supported through dynamic imports
- Icons are individual components to avoid bundle bloat
- Modal components handle body scroll efficiently

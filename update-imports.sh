#!/bin/bash

# Script pentru actualizarea automat a importurilor componente

echo "🔄 Actualizando importuri componente..."

# Actualizez importurile comune
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/BaseButton.vue|@/components/buttons/BaseButton.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/BaseInput.vue|@/components/forms/BaseInput.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/BaseCard.vue|@/components/cards/BaseCard.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/LoadingSpinner.vue|@/components/ui/LoadingSpinner.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/AnnouncementCard.vue|@/components/cards/AnnouncementCard.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/AnnouncementFilters.vue|@/components/forms/AnnouncementFilters.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/AnnouncementFormModal.vue|@/components/modals/AnnouncementFormModal.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/AnnouncementDetailModal.vue|@/components/modals/AnnouncementDetailModal.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/ConfirmationModal.vue|@/components/modals/ConfirmationModal.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/ResolveAnnouncementModal.vue|@/components/modals/ResolveAnnouncementModal.vue|g' {} \;

# Actualizez importurile pentru componente la nivel de folder
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/WelcomeSection.vue|@/components/ui/WelcomeSection.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/ProfileCard.vue|@/components/cards/ProfileCard.vue|g' {} \;
find /Users/pchelaru/Documents/Work/licenta/frontend/src -name "*.vue" -exec sed -i '' 's|@/components/QuickActionCard.vue|@/components/cards/QuickActionCard.vue|g' {} \;

echo "✅ Importuri actualizate cu succes!"

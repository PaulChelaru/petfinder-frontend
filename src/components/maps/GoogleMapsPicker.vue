<template>
  <div class="google-maps-picker">
    <!-- Toggle button -->
    <button
      type="button"
      @click="toggleMapPicker"
      class="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
      :class="{ 'bg-yellow-600 hover:bg-yellow-700': !isGoogleMapsAvailable() }"
    >
      <i class="fas fa-map-marker-alt"></i>
      {{ showMap ? 'Hide Map' : (isGoogleMapsAvailable() ? 'Choose Location on Map' : 'Choose Location on Map (Limited)') }}
    </button>

    <!-- Map container -->
    <div v-if="showMap" class="map-container mb-4">
      <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <div id="google-map" class="w-full h-96 rounded-lg bg-gray-200"></div>
        <p class="text-sm text-gray-600 mt-2">
          Click on the map to set the exact location, or search for an address
        </p>
      </div>
      
      <!-- Search box for addresses -->
      <div class="mt-3">
        <input
          ref="searchInput"
          type="text"
          placeholder="Search for an address..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <!-- Selected location info -->
      <div v-if="selectedLocation" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
        <h4 class="font-medium text-green-800 mb-1">Selected Location:</h4>
        <p class="text-sm text-green-700">{{ selectedLocation.address }}</p>
        <p class="text-xs text-green-600">
          Coordinates: {{ selectedLocation.coordinates[1].toFixed(6) }}, {{ selectedLocation.coordinates[0].toFixed(6) }}
        </p>
        <button
          type="button"
          @click="useSelectedLocation"
          class="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          Use This Location
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { GOOGLE_MAPS_CONFIG, isGoogleMapsAvailable } from '@/config/maps'

const props = defineProps({
  initialCoordinates: {
    type: Array,
    default: () => [26.2712317, 47.6637858] // Suceava coordinates as default
  }
})

const emit = defineEmits(['locationSelected'])

// Reactive data
const showMap = ref(false)
const selectedLocation = ref(null)
const map = ref(null)
const marker = ref(null)
const searchInput = ref(null)
const autocomplete = ref(null)

// Google Maps setup
let isGoogleMapsLoaded = false

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    if (!isGoogleMapsAvailable()) {
      reject(new Error('Google Maps API key not available'))
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.API_KEY}&libraries=places&loading=async&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    
    // Handle errors
    script.onerror = () => {
      console.error('Failed to load Google Maps script')
      reject(new Error('Failed to load Google Maps'))
    }
    
    window.initGoogleMaps = () => {
      isGoogleMapsLoaded = true
      delete window.initGoogleMaps // Cleanup
      resolve()
    }
    
    document.head.appendChild(script)
  })
}

const initializeMap = async () => {
  try {
    await loadGoogleMapsScript()
    
    const mapElement = document.getElementById('google-map')
    if (!mapElement) return

    // Initialize map centered on provided coordinates
    const center = {
      lat: props.initialCoordinates[1], // latitude
      lng: props.initialCoordinates[0]  // longitude
    }

    // Create map with error handling
    try {
      map.value = new google.maps.Map(mapElement, {
        zoom: 15,
        center: center,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapId: 'DEMO_MAP_ID' // Required for advanced markers
      })
    } catch (mapError) {
      console.error('Map creation failed:', mapError)
      showFallbackMessage(mapElement, 'Failed to create map. Please check API configuration.')
      return
    }

    // Try to use Advanced Marker (new), fallback to classic Marker
    try {
      // Use new Advanced Marker if available
      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        marker.value = new google.maps.marker.AdvancedMarkerElement({
          position: center,
          map: map.value,
          title: 'Drag me to set location'
        })
        
        // Advanced markers handle dragging differently
        marker.value.addListener('dragend', (event) => {
          updateMarkerPosition(event.latLng || marker.value.position)
        })
      } else {
        // Fallback to classic marker
        marker.value = new google.maps.Marker({
          position: center,
          map: map.value,
          draggable: true,
          title: 'Drag me to set location'
        })
        
        marker.value.addListener('dragend', (event) => {
          updateMarkerPosition(event.latLng)
        })
      }
    } catch (markerError) {
      console.error('Marker creation failed:', markerError)
      // Continue without marker - user can still click on map
    }

    // Handle map clicks
    map.value.addListener('click', (event) => {
      updateMarkerPosition(event.latLng)
    })

    // Setup search - try new PlaceAutocompleteElement first
    if (searchInput.value) {
      try {
        // Try new Place Autocomplete Element
        if (google.maps.places && google.maps.places.PlaceAutocompleteElement) {
          const autocompleteElement = new google.maps.places.PlaceAutocompleteElement()
          autocompleteElement.componentRestrictions = { country: 'ro' }
          
          searchInput.value.parentNode.replaceChild(autocompleteElement, searchInput.value)
          searchInput.value = autocompleteElement
          
          autocompleteElement.addEventListener('gmp-placeselect', (event) => {
            const place = event.place
            if (place.geometry) {
              const location = place.geometry.location
              updateMarkerPosition(location)
              map.value.setCenter(location)
              map.value.setZoom(17)
            }
          })
        } else {
          // Fallback to classic Autocomplete
          autocomplete.value = new google.maps.places.Autocomplete(searchInput.value, {
            componentRestrictions: { country: 'ro' },
            fields: ['address_components', 'formatted_address', 'geometry']
          })

          autocomplete.value.addListener('place_changed', () => {
            const place = autocomplete.value.getPlace()
            if (place.geometry) {
              const location = place.geometry.location
              updateMarkerPosition(location)
              map.value.setCenter(location)
              map.value.setZoom(17)
            }
          })
        }
      } catch (autocompleteError) {
        console.warn('Autocomplete setup failed:', autocompleteError)
        // Hide search input if autocomplete fails
        if (searchInput.value) {
          searchInput.value.style.display = 'none'
        }
      }
    }

  } catch (error) {
    console.error('Failed to initialize Google Maps:', error)
    
    const mapElement = document.getElementById('google-map')
    if (mapElement) {
      // Determine error type and show appropriate message
      let errorMessage = 'Google Maps is currently unavailable.'
      let suggestion = 'Please use manual address entry or current location instead.'
      
      if (error.message.includes('BillingNotEnabledMapError') || error.message.includes('billing')) {
        errorMessage = 'Google Maps requires billing to be enabled.'
        suggestion = 'Contact the administrator to enable billing, or use manual address entry.'
      } else if (error.message.includes('ApiNotActivatedMapError')) {
        errorMessage = 'Google Maps API is not activated.'
        suggestion = 'Contact the administrator to activate the API, or use manual address entry.'
      }
      
      showFallbackMessage(mapElement, errorMessage, suggestion)
    }
  }
}

const showFallbackMessage = (mapElement, errorMessage, suggestion = 'Please use manual address entry or current location instead.') => {
  mapElement.innerHTML = `
    <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
      <div class="text-center p-6 max-w-md">
        <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Maps Unavailable</h3>
        <p class="text-sm text-gray-600 mb-2">${errorMessage}</p>
        <p class="text-sm text-gray-500 mb-4">${suggestion}</p>
        <button 
          onclick="document.querySelector('.google-maps-picker button').click()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Use Manual Entry
        </button>
      </div>
    </div>
  `
}

const updateMarkerPosition = async (latLng) => {
  const lat = latLng.lat()
  const lng = latLng.lng()
  
  // Update marker position - handle both advanced and classic markers
  if (marker.value) {
    try {
      if (marker.value.position) {
        // Advanced marker
        marker.value.position = latLng
      } else {
        // Classic marker
        marker.value.setPosition(latLng)
      }
    } catch (markerError) {
      console.warn('Could not update marker position:', markerError)
    }
  }
  
  // Reverse geocode to get address
  try {
    const geocoder = new google.maps.Geocoder()
    const response = await new Promise((resolve, reject) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK') resolve(results)
        else reject(new Error(`Geocoding failed: ${status}`))
      })
    })

    if (response && response[0]) {
      const address = response[0].formatted_address
      selectedLocation.value = {
        address: address,
        coordinates: [lng, lat], // [longitude, latitude] format
        source: 'Google Maps (User Selected)'
      }
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    selectedLocation.value = {
      address: `Selected location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      coordinates: [lng, lat],
      source: 'Google Maps (Manual)'
    }
  }
}

const toggleMapPicker = async () => {
  showMap.value = !showMap.value
  
  if (showMap.value && !map.value) {
    await nextTick()
    await initializeMap()
  }
}

const useSelectedLocation = () => {
  if (selectedLocation.value) {
    emit('locationSelected', {
      coordinates: selectedLocation.value.coordinates,
      address: selectedLocation.value.address,
      source: selectedLocation.value.source
    })
    showMap.value = false
  }
}

onMounted(() => {
  // Pre-load Google Maps if API is available
  if (isGoogleMapsAvailable()) {
    loadGoogleMapsScript().catch(console.error)
  }
})
</script>

<style scoped>
.google-maps-picker {
  width: 100%;
}

#google-map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

/* Ensure Google Maps controls are visible */
:deep(.gm-style) {
  border-radius: 8px;
}
</style>

/**
 * Maps and Geocoding Configuration
 * 
 * To enable Google Maps geocoding (more accurate):
 * 1. Get a Google Maps API key from: https://console.cloud.google.com/
 * 2. Enable Geocoding API and Places API
 * 3. Replace the API key below
 * 4. Add your domain to the API key restrictions
 */

// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Replace this with your actual Google Maps API key for better geocoding accuracy
  API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  
  // Google Maps API endpoints
  GEOCODING_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
  PLACES_URL: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  
  // Default options for geocoding
  GEOCODING_OPTIONS: {
    region: 'ro', // Bias results to Romania
    components: 'country:RO' // Restrict to Romania only
  }
}

// OpenStreetMap Configuration (fallback - free but less accurate)
export const OSM_CONFIG = {
  NOMINATIM_URL: 'https://nominatim.openstreetmap.org/search',
  DEFAULT_OPTIONS: {
    format: 'json',
    countrycodes: 'ro',
    addressdetails: 1,
    limit: 5
  }
}

// Romania fallback coordinates (center of the country)
export const ROMANIA_CENTER = {
  latitude: 45.9432,
  longitude: 24.9668,
  coordinates: [24.9668, 45.9432] // [longitude, latitude] format for MongoDB
}

// Check if Google Maps API is available
export const isGoogleMapsAvailable = () => {
  return GOOGLE_MAPS_CONFIG.API_KEY && 
         GOOGLE_MAPS_CONFIG.API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' &&
         GOOGLE_MAPS_CONFIG.API_KEY.length > 10
}

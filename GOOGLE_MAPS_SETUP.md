# Configurarea Google Maps API pentru Geocoding Precis

## De ce Google Maps API?

Google Maps API oferă geocoding mult mai precis decât OpenStreetMap, mai ales pentru adrese din România. Poate găsi coordonate exacte pentru străzi, numere de case, și locații specifice.

## Pași pentru configurare:

### 1. Obține API Key
1. Mergi la [Google Cloud Console](https://console.cloud.google.com/)
2. Creează un proiect nou sau selectează unul existent
3. Activează următoarele API-uri:
   - **Geocoding API** (pentru convertirea adreselor în coordonate)
   - **Places API** (opțional, pentru autocomplete)

### 2. Generează API Key și activează billing
1. În Google Cloud Console, mergi la "Credentials"
2. Click "Create Credentials" → "API Key"
3. **IMPORTANT**: Activează billing pentru proiect:
   - Mergi la "Billing" în Cloud Console
   - Asociază o metodă de plată (card de credit)
   - Google Maps necesită billing activat (chiar și pentru free tier)
4. Copiază API key-ul generat

### 3. Configurează restricțiile de securitate
1. Click pe API key-ul creat
2. În "Application restrictions", selectează "HTTP referrers"
3. Adaugă domeniile tale:
   - `http://localhost:*` (pentru development)
   - `https://yoursite.com/*` (pentru production)

### 4. Adaugă API Key în aplicație

#### Opțiunea 1: Fișier .env (recomandat)
Creează un fișier `.env` în root-ul proiectului:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Notă**: Pentru Vite, variabilele de mediu trebuie să înceapă cu `VITE_` pentru a fi accesibile în browser.

#### Opțiunea 2: Direct în config
Editează `/src/config/maps.js`:
```javascript
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: 'your_actual_api_key_here',
  // ...
}
```

## Verificarea funcționalității

După configurare, geocoding-ul va încerca următoarele strategii în ordine:

1. **Google Maps API** (cel mai precis) ✨
   - Găsește coordonate exacte pentru adrese complete
   - Returnează tipul de precizie (ROOFTOP, RANGE_INTERPOLATED, etc.)
   
2. **OpenStreetMap** (fallback, gratuit)
   - Încearcă mai multe formate de query
   - Caută potriviri exacte pentru străzi
   
3. **Centrul orașului** (fallback minim)
   - Folosește coordonatele centrului orașului
   
4. **Centrul României** (fallback final)
   - Coordonate: 45.9432, 24.9668

## Monitorizare și debugging

În consolă vei vedea:
```
Trying Google Geocoding for: Bulevardul 1 Decembrie 1918, Suceava, Suceava, Romania
Google Geocoding response: {...}
Geocoding successful: { coordinates: [26.271, 47.663], source: "Google Maps" }
```

## Probleme comune

### "BillingNotEnabledMapError"
Google Maps API necesită billing activat chiar și pentru free tier:
1. Mergi la [Google Cloud Billing](https://console.cloud.google.com/billing)
2. Asociază o metodă de plată
3. Pentru aplicații mici, costurile vor fi în free tier (sub limita gratuită)

### Alternative fără billing
Dacă nu vrei să activezi billing:
- Aplicația va folosi OpenStreetMap pentru geocoding (gratuit, dar mai puțin precis)
- Poți folosi locația curentă (GPS)
- Poți introduce manual adresele (cu validare româna)

## Costuri

- **OpenStreetMap**: Complet gratuit
- **Google Maps**: 
  - 40,000 cereri gratuite pe lună
  - $0.005 per cerere după limita gratuită
  - Pentru o aplicație mică, probabil nu vei depăși limita gratuită

## Alternative gratuite

Dacă nu vrei să folosești Google Maps, aplicația va funcționa cu OpenStreetMap, dar cu precizie mai mică pentru adrese specifice.

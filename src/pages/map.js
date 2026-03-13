// ======================================================
//  Find Hospital / Map Page
// ======================================================
import { showToast } from '../../main.js';

export function renderMap(container) {
  container.innerHTML = `
    <section class="map-page">
      <div class="container">
        <div class="map-header">
          <h1>Find Nearest Hospital</h1>
          <p>Use your location to quickly find and navigate to the closest hospital</p>
        </div>

        <div class="map-content">
          <div class="map-card">
            <div class="map-placeholder" id="map-status">
              <div class="map-placeholder-icon">📍</div>
              <h3>Locate Nearby Hospitals</h3>
              <p>Click the button below to use your current location and find the nearest hospitals on Google Maps</p>
              <button class="btn btn-primary btn-lg" id="locate-btn">
                📍 Find Hospitals Near Me
              </button>
            </div>
            <div class="map-actions-grid">
              <div class="map-action-card" id="action-hospitals">
                <div class="map-action-icon">🏥</div>
                <h4>Hospitals</h4>
                <p>Search for hospitals in your area on Google Maps</p>
              </div>
              <div class="map-action-card" id="action-pharmacies">
                <div class="map-action-icon">💊</div>
                <h4>Pharmacies</h4>
                <p>Find nearby pharmacies for your medication needs</p>
              </div>
              <div class="map-action-card" id="action-clinics">
                <div class="map-action-icon">🩺</div>
                <h4>Clinics</h4>
                <p>Discover health clinics and urgent care centers</p>
              </div>
              <div class="map-action-card" id="action-emergency">
                <div class="map-action-icon">🚑</div>
                <h4>Emergency</h4>
                <p>Locate the nearest emergency room immediately</p>
              </div>
            </div>
          </div>

          <div class="map-info-cards">
            <div class="map-info-card">
              <div class="map-info-icon">🌐</div>
              <h4>GPS Powered</h4>
              <p>Uses your device's GPS for accurate location</p>
            </div>
            <div class="map-info-card">
              <div class="map-info-icon">🗺️</div>
              <h4>Google Maps</h4>
              <p>Opens in Google Maps for turn-by-turn directions</p>
            </div>
            <div class="map-info-card">
              <div class="map-info-icon">⚡</div>
              <h4>Instant Results</h4>
              <p>Get results in seconds with one click</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // --- Geolocation + Google Maps ---
  const locateBtn = container.querySelector('#locate-btn');
  const mapStatus = container.querySelector('#map-status');

  function openGoogleMapsSearch(query) {
    if (!navigator.geolocation) {
      // Fallback: open Google Maps without coordinates
      showToast('Geolocation not supported. Opening Google Maps...');
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
      return;
    }

    // Show loading state
    mapStatus.innerHTML = `
      <div class="map-placeholder-icon" style="animation: pulse 1s infinite">📡</div>
      <h3>Getting your location...</h3>
      <p>Please allow location access when prompted</p>
    `;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${latitude},${longitude},14z`;
        window.open(url, '_blank');

        mapStatus.innerHTML = `
          <div class="map-placeholder-icon">✅</div>
          <h3>Google Maps Opened!</h3>
          <p>Check your browser for the Google Maps tab showing ${query} near you</p>
          <button class="btn btn-primary btn-lg" id="locate-btn-retry">
            📍 Search Again
          </button>
        `;

        container.querySelector('#locate-btn-retry')?.addEventListener('click', () => {
          openGoogleMapsSearch('hospitals');
        });

        showToast(`Found your location! Opening Google Maps... 🗺️`);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback without coordinates
        const url = `https://www.google.com/maps/search/${encodeURIComponent(query + ' near me')}`;
        window.open(url, '_blank');

        mapStatus.innerHTML = `
          <div class="map-placeholder-icon">⚠️</div>
          <h3>Location Access Denied</h3>
          <p>We opened Google Maps without precise location. Enable location in your browser settings for better results.</p>
          <button class="btn btn-primary btn-lg" id="locate-btn-retry">
            📍 Try Again
          </button>
        `;

        container.querySelector('#locate-btn-retry')?.addEventListener('click', () => {
          openGoogleMapsSearch('hospitals');
        });

        showToast('Opening Google Maps without precise location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  locateBtn.addEventListener('click', () => openGoogleMapsSearch('hospitals'));

  // Action cards
  container.querySelector('#action-hospitals').addEventListener('click', () => openGoogleMapsSearch('hospitals'));
  container.querySelector('#action-pharmacies').addEventListener('click', () => openGoogleMapsSearch('pharmacies'));
  container.querySelector('#action-clinics').addEventListener('click', () => openGoogleMapsSearch('health clinics'));
  container.querySelector('#action-emergency').addEventListener('click', () => openGoogleMapsSearch('emergency room'));
}

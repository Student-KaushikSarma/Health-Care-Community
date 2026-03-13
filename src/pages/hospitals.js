// ======================================================
//  Hospitals & Doctors Page
// ======================================================

const HOSPITALS_DATA = [
  {
    type: 'hospital',
    name: 'City General Hospital',
    specialty: 'Multi-Specialty',
    rating: 4.8,
    reviews: 1240,
    address: '123 Healthcare Avenue, Downtown',
    phone: '+1 (555) 100-2000',
    hours: 'Open 24/7',
    lat: 28.6139,
    lng: 77.2090,
    icon: '🏥'
  },
  {
    type: 'hospital',
    name: 'Green Valley Medical Center',
    specialty: 'Cardiology & Neurology',
    rating: 4.6,
    reviews: 890,
    address: '456 Wellness Road, Midtown',
    phone: '+1 (555) 200-3000',
    hours: 'Open 24/7',
    lat: 28.6280,
    lng: 77.2197,
    icon: '🏥'
  },
  {
    type: 'hospital',
    name: 'Sunrise Children\'s Hospital',
    specialty: 'Pediatrics',
    rating: 4.9,
    reviews: 2100,
    address: '789 Kids Lane, Eastside',
    phone: '+1 (555) 300-4000',
    hours: 'Open 24/7',
    lat: 28.6353,
    lng: 77.2250,
    icon: '👶'
  },
  {
    type: 'doctor',
    name: 'Dr. Emily Watson',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 520,
    address: 'City General Hospital, Dept. of Cardiology',
    phone: '+1 (555) 101-0001',
    hours: 'Mon–Fri, 9 AM – 5 PM',
    lat: 28.6139,
    lng: 77.2090,
    icon: '👩‍⚕️'
  },
  {
    type: 'doctor',
    name: 'Dr. Raj Patel',
    specialty: 'Neurologist',
    rating: 4.7,
    reviews: 380,
    address: 'Green Valley Medical Center, Floor 3',
    phone: '+1 (555) 201-0002',
    hours: 'Mon–Sat, 10 AM – 6 PM',
    lat: 28.6280,
    lng: 77.2197,
    icon: '👨‍⚕️'
  },
  {
    type: 'doctor',
    name: 'Dr. Sarah Chen',
    specialty: 'Pediatrician',
    rating: 4.8,
    reviews: 670,
    address: 'Sunrise Children\'s Hospital',
    phone: '+1 (555) 301-0003',
    hours: 'Mon–Fri, 8 AM – 4 PM',
    lat: 28.6353,
    lng: 77.2250,
    icon: '👩‍⚕️'
  },
  {
    type: 'hospital',
    name: 'Metro Orthopedic Institute',
    specialty: 'Orthopedics & Sports Medicine',
    rating: 4.5,
    reviews: 430,
    address: '321 Bone Street, Westend',
    phone: '+1 (555) 400-5000',
    hours: 'Mon–Sat, 7 AM – 9 PM',
    lat: 28.6100,
    lng: 77.2000,
    icon: '🦴'
  },
  {
    type: 'doctor',
    name: 'Dr. Lisa Thompson',
    specialty: 'Dermatologist',
    rating: 4.6,
    reviews: 290,
    address: 'Skin Care Clinic, 5th Avenue',
    phone: '+1 (555) 500-6000',
    hours: 'Tue–Sat, 10 AM – 7 PM',
    lat: 28.6200,
    lng: 77.2100,
    icon: '👩‍⚕️'
  },
  {
    type: 'hospital',
    name: 'Harmony Mental Health Center',
    specialty: 'Psychiatry & Psychology',
    rating: 4.7,
    reviews: 310,
    address: '55 Mindful Drive, Uptown',
    phone: '+1 (555) 600-7000',
    hours: 'Mon–Fri, 8 AM – 8 PM',
    lat: 28.6350,
    lng: 77.2300,
    icon: '🧠'
  },
  {
    type: 'doctor',
    name: 'Dr. James Miller',
    specialty: 'General Physician',
    rating: 4.4,
    reviews: 850,
    address: 'HealthFirst Clinic, Main Street',
    phone: '+1 (555) 700-8000',
    hours: 'Mon–Sat, 9 AM – 8 PM',
    lat: 28.6180,
    lng: 77.2150,
    icon: '👨‍⚕️'
  }
];

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '⭐'.repeat(full) + (half ? '✨' : '');
}

export function renderHospitals(container) {
  container.innerHTML = `
    <section class="hospitals-page">
      <div class="container">
        <div class="hospitals-header">
          <h1>Hospitals & Doctors</h1>
          <p>Find trusted healthcare providers near you</p>
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input class="search-input" type="text" id="hospital-search" placeholder="Search by name, specialty, or location..." />
          </div>
          <div class="filter-tabs">
            <button class="filter-tab active" data-filter="all">All</button>
            <button class="filter-tab" data-filter="hospital">🏥 Hospitals</button>
            <button class="filter-tab" data-filter="doctor">👨‍⚕️ Doctors</button>
          </div>
        </div>
        <div class="hospitals-grid" id="hospitals-grid">
          ${renderCards(HOSPITALS_DATA)}
        </div>
      </div>
    </section>
  `;

  // --- Search & Filter ---
  const searchInput = container.querySelector('#hospital-search');
  const filterTabs = container.querySelectorAll('.filter-tab');
  let currentFilter = 'all';

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    let filtered = HOSPITALS_DATA;

    if (currentFilter !== 'all') {
      filtered = filtered.filter(h => h.type === currentFilter);
    }
    if (query) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(query) ||
        h.specialty.toLowerCase().includes(query) ||
        h.address.toLowerCase().includes(query)
      );
    }

    container.querySelector('#hospitals-grid').innerHTML = renderCards(filtered);
    attachDirectionsListeners(container);
  }

  searchInput.addEventListener('input', applyFilters);

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      applyFilters();
    });
  });

  attachDirectionsListeners(container);
}

function renderCards(data) {
  if (data.length === 0) {
    return `<div style="text-align:center; padding: var(--space-16); color: var(--clr-text-muted); grid-column: 1/-1;">
      <p style="font-size: 3rem; margin-bottom: var(--space-4);">🔍</p>
      <p>No results found. Try a different search.</p>
    </div>`;
  }

  return data.map((item, idx) => `
    <div class="hospital-card" style="animation: slideUp 0.4s ease ${idx * 0.05}s both;">
      <div class="hospital-card-header">
        <div class="hospital-icon ${item.type}">${item.icon}</div>
        <div>
          <div class="hospital-name">${item.name}</div>
          <div class="hospital-specialty">${item.specialty}</div>
        </div>
      </div>
      <div class="hospital-info">
        <div class="hospital-info-item">📍 ${item.address}</div>
        <div class="hospital-info-item">📞 ${item.phone}</div>
        <div class="hospital-info-item">🕐 ${item.hours}</div>
        <div class="hospital-rating">
          ${renderStars(item.rating)} ${item.rating} (${item.reviews} reviews)
        </div>
      </div>
      <div class="hospital-card-actions">
        <button class="btn btn-primary btn-sm directions-btn"
                data-lat="${item.lat}" data-lng="${item.lng}" data-name="${item.name}">
          📍 Get Directions
        </button>
        <button class="btn btn-secondary btn-sm">📞 Contact</button>
      </div>
    </div>
  `).join('');
}

function attachDirectionsListeners(container) {
  container.querySelectorAll('.directions-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const lat = btn.dataset.lat;
      const lng = btn.dataset.lng;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
      window.open(url, '_blank');
    });
  });
}

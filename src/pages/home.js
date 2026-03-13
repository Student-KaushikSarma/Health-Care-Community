// ======================================================
//  Home Page
// ======================================================
import { getCurrentUser } from '../../main.js';

export function renderHome(container) {
  const user = getCurrentUser();
  const greeting = user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Join our community today';

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">🌟 ${greeting}</div>
          <h1 class="hero-title">
            Your Health,<br/>
            Our <span class="highlight">Community</span>
          </h1>
          <p class="hero-subtitle">
            Connect with thousands of people sharing health experiences, find trusted hospitals and doctors, and take charge of your well-being — together.
          </p>
          <div class="hero-actions">
            <a href="#/community" class="btn btn-primary btn-lg">Join Community</a>
            <a href="#/hospitals" class="btn btn-secondary btn-lg">Find Hospitals</a>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <h3>12K+</h3>
              <p>Active Members</p>
            </div>
            <div class="stat-item">
              <h3>500+</h3>
              <p>Hospitals Listed</p>
            </div>
            <div class="stat-item">
              <h3>2K+</h3>
              <p>Doctors Connected</p>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <img src="/hero-banner.png" alt="Healthcare community illustration" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <div class="section-badge">✨ What We Offer</div>
        <h2 class="section-title">Everything You Need for Better Health</h2>
        <p class="section-desc">From community support to finding the right care, HealthHub has you covered.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon teal">💬</div>
          <h3>Community Forum</h3>
          <p>Share your health experiences, ask questions, and get support from a caring community of real people.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon purple">🎤</div>
          <h3>Voice Posts</h3>
          <p>Prefer talking over typing? Use your voice to share your thoughts — we'll transcribe it for the community.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon cyan">🏥</div>
          <h3>Hospital Directory</h3>
          <p>Browse verified hospitals and healthcare centers with ratings, specialties, and contact information.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon rose">👨‍⚕️</div>
          <h3>Doctor Profiles</h3>
          <p>Find and connect with qualified doctors across various specialties. Read reviews and book consultations.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon orange">📍</div>
          <h3>Nearest Hospital</h3>
          <p>Use GPS to find the closest hospital to you. Get instant directions via Google Maps integration.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon emerald">🔒</div>
          <h3>Safe & Private</h3>
          <p>Your health information stays private. Share only what you're comfortable with in our secure community.</p>
        </div>
      </div>
    </section>

    <!-- Health Tips Section -->
    <section class="tips-section">
      <div class="section-header">
        <div class="section-badge">💡 Health Tips</div>
        <h2 class="section-title">Daily Wellness Essentials</h2>
        <p class="section-desc">Simple, evidence-based tips to keep you healthy every day.</p>
      </div>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-number">1</div>
          <div>
            <h4>Stay Hydrated</h4>
            <p>Drink at least 8 glasses of water daily. Proper hydration improves energy, focus, and overall body function.</p>
          </div>
        </div>
        <div class="tip-card">
          <div class="tip-number">2</div>
          <div>
            <h4>Move Every Hour</h4>
            <p>Take short walking breaks every 60 minutes. Even 5 minutes of movement reduces health risks from prolonged sitting.</p>
          </div>
        </div>
        <div class="tip-card">
          <div class="tip-number">3</div>
          <div>
            <h4>Prioritize Sleep</h4>
            <p>Aim for 7-9 hours of quality sleep. Good sleep strengthens immunity and supports mental well-being.</p>
          </div>
        </div>
        <div class="tip-card">
          <div class="tip-number">4</div>
          <div>
            <h4>Practice Mindfulness</h4>
            <p>Spend 10 minutes daily on meditation or deep breathing. It reduces stress and improves emotional resilience.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-card">
        <h2>Ready to Take Charge of Your Health?</h2>
        <p>Join HealthHub today and become part of a community that cares about your well-being.</p>
        <div class="cta-actions">
          ${user
            ? '<a href="#/community" class="btn btn-primary btn-lg">Go to Community</a>'
            : '<a href="#/login" class="btn btn-primary btn-lg">Get Started Free</a>'
          }
          <a href="#/map" class="btn btn-secondary btn-lg">Find Nearest Hospital</a>
        </div>
      </div>
    </section>
  `;
}

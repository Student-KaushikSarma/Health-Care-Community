// ======================================================
//  HealthHub — Main Router & Shared Utilities
// ======================================================

import './style.css';
import { renderLogin } from './src/pages/login.js';
import { renderHome } from './src/pages/home.js';
import { renderCommunity } from './src/pages/community.js';
import { renderHospitals } from './src/pages/hospitals.js';
import { renderMap } from './src/pages/map.js';

// --- Auth Helpers -------------------------------------------------------
export function getCurrentUser() {
  const raw = localStorage.getItem('healthhub_current_user');
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem('healthhub_current_user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('healthhub_current_user');
  updateAuthUI();
  navigate('');
}

export function getUsers() {
  const raw = localStorage.getItem('healthhub_users');
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users) {
  localStorage.setItem('healthhub_users', JSON.stringify(users));
}

// --- Toast --------------------------------------------------------------
export function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// --- Navigation ---------------------------------------------------------
export function navigate(path) {
  window.location.hash = path ? `/${path}` : '/';
}

function getRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash;
}

function updateActiveLink(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const page = link.dataset.page;
    if ((route === '/' && page === 'home') ||
        (route === '/community' && page === 'community') ||
        (route === '/hospitals' && page === 'hospitals') ||
        (route === '/map' && page === 'map')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// --- Auth UI in Navbar ---------------------------------------------------
export function updateAuthUI() {
  const authContainer = document.getElementById('nav-auth');
  const user = getCurrentUser();
  if (user) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    authContainer.innerHTML = `
      <div class="nav-user">
        <div class="nav-avatar">${initials}</div>
        <span class="nav-username">${user.name}</span>
        <button class="btn btn-ghost btn-sm" id="logout-btn">Logout</button>
      </div>
    `;
    document.getElementById('logout-btn').addEventListener('click', logout);
  } else {
    authContainer.innerHTML = `<a href="#/login" class="btn btn-primary btn-sm">Sign In</a>`;
  }
}

// --- Router --------------------------------------------------------------
function router() {
  const route = getRoute();
  const app = document.getElementById('app');
  const navbar = document.getElementById('navbar');

  updateActiveLink(route);

  // Hide navbar on login page
  if (route === '/login') {
    navbar.style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
  } else {
    navbar.style.display = '';
    document.querySelector('.footer').style.display = '';
  }

  // Render page
  switch (route) {
    case '/login':
      renderLogin(app);
      break;
    case '/community':
      renderCommunity(app);
      break;
    case '/hospitals':
      renderHospitals(app);
      break;
    case '/map':
      renderMap(app);
      break;
    case '/':
    default:
      renderHome(app);
      break;
  }

  // Scroll to top
  window.scrollTo({ top: 0 });
}

// --- Mobile Nav Toggle ---------------------------------------------------
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
  });
});

// --- Init ----------------------------------------------------------------
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  router();
});

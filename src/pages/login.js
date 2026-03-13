// ======================================================
//  Login / Signup Page
// ======================================================
import { getCurrentUser, setCurrentUser, getUsers, saveUsers, updateAuthUI, navigate, showToast } from '../../main.js';

export function renderLogin(container) {
  // If already logged in, redirect to home
  if (getCurrentUser()) {
    navigate('');
    return;
  }

  container.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>💊 Health<span class="logo-accent">Hub</span></h1>
          <p>Your community for better health</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-login">Login</button>
          <button class="auth-tab" id="tab-signup">Sign Up</button>
        </div>

        <!-- Login Form -->
        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input class="form-input" type="email" id="login-email" placeholder="you@example.com" required />
            <p class="form-error" id="login-email-error"></p>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input class="form-input" type="password" id="login-password" placeholder="Enter your password" required />
            <p class="form-error" id="login-password-error"></p>
          </div>
          <button class="btn btn-primary auth-submit" type="submit">Login</button>
        </form>

        <!-- Signup Form (hidden by default) -->
        <form id="signup-form" style="display:none">
          <div class="form-group">
            <label class="form-label" for="signup-name">Full Name</label>
            <input class="form-input" type="text" id="signup-name" placeholder="John Doe" required />
            <p class="form-error" id="signup-name-error"></p>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-email">Email Address</label>
            <input class="form-input" type="email" id="signup-email" placeholder="you@example.com" required />
            <p class="form-error" id="signup-email-error"></p>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-password">Password</label>
            <input class="form-input" type="password" id="signup-password" placeholder="Min 6 characters" required />
            <p class="form-error" id="signup-password-error"></p>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-confirm">Confirm Password</label>
            <input class="form-input" type="password" id="signup-confirm" placeholder="Repeat your password" required />
            <p class="form-error" id="signup-confirm-error"></p>
          </div>
          <button class="btn btn-primary auth-submit" type="submit">Create Account</button>
        </form>

        <div class="auth-divider">or continue as guest</div>
        <button class="btn btn-ghost" style="width:100%" id="guest-btn">Browse as Guest</button>
      </div>
    </section>
  `;

  // --- Tab switching ---
  const tabLogin = container.querySelector('#tab-login');
  const tabSignup = container.querySelector('#tab-signup');
  const loginForm = container.querySelector('#login-form');
  const signupForm = container.querySelector('#signup-form');

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.style.display = '';
    signupForm.style.display = 'none';
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.style.display = '';
    loginForm.style.display = 'none';
  });

  // --- Validation Helpers ---
  function showError(id, msg) {
    const el = container.querySelector(`#${id}`);
    el.textContent = msg;
    el.classList.add('visible');
  }
  function clearErrors() {
    container.querySelectorAll('.form-error').forEach(e => {
      e.textContent = '';
      e.classList.remove('visible');
    });
  }

  // --- Login Handler ---
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = container.querySelector('#login-email').value.trim();
    const password = container.querySelector('#login-password').value;

    if (!email) { showError('login-email-error', 'Email is required'); return; }
    if (!password) { showError('login-password-error', 'Password is required'); return; }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      showError('login-password-error', 'Invalid email or password');
      return;
    }

    setCurrentUser(user);
    updateAuthUI();
    showToast(`Welcome back, ${user.name}! 🎉`);
    navigate('');
  });

  // --- Signup Handler ---
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name = container.querySelector('#signup-name').value.trim();
    const email = container.querySelector('#signup-email').value.trim();
    const password = container.querySelector('#signup-password').value;
    const confirm = container.querySelector('#signup-confirm').value;

    let valid = true;
    if (!name) { showError('signup-name-error', 'Name is required'); valid = false; }
    if (!email) { showError('signup-email-error', 'Email is required'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('signup-email-error', 'Enter a valid email'); valid = false; }
    if (password.length < 6) { showError('signup-password-error', 'Must be at least 6 characters'); valid = false; }
    if (password !== confirm) { showError('signup-confirm-error', 'Passwords do not match'); valid = false; }
    if (!valid) return;

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      showError('signup-email-error', 'This email is already registered');
      return;
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    updateAuthUI();
    showToast(`Account created! Welcome, ${name} 🎉`);
    navigate('');
  });

  // --- Guest ---
  container.querySelector('#guest-btn').addEventListener('click', () => {
    navigate('');
  });
}

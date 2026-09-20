// ========================================
// EnglishPro — Admin Login Page
// ========================================
import { login, recordLoginAttempt, isAuthenticated } from '../engine/auth.js';
import { navigate } from '../router.js';

export default function LoginPage(container) {
    // If already authenticated, redirect to admin
    if (isAuthenticated()) {
        navigate('/admin');
        return {};
    }

    let error = '';
    let loading = false;
    let showPassword = false;

    function render() {
        container.innerHTML = `
      <div class="login-page">
        <div class="login-bg">
          <div class="hero__orb hero__orb--1"></div>
          <div class="hero__orb hero__orb--2"></div>
        </div>

        <div class="login-container animate-fade-in-up">
          <!-- Logo -->
          <div class="login-logo">
            <div class="navbar__brand-icon" style="width:56px;height:56px;font-size:1.5rem;">E</div>
            <h2 style="margin-top:12px;">EnglishPro</h2>
            <p class="text-secondary text-sm">Admin Panel · Secure Access</p>
          </div>

          <!-- Login Card -->
          <div class="card login-card">
            <form id="login-form" autocomplete="off">
              <div class="login-header">
                <div class="card__icon" style="width:48px;height:48px;font-size:1.5rem;">🔐</div>
                <h3>Sign In</h3>
                <p class="text-secondary text-sm">Enter your credentials to access the admin panel</p>
              </div>

              ${error ? `
                <div class="login-error animate-shake">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                  <span>${error}</span>
                </div>
              ` : ''}

              <div class="form-group">
                <label class="form-label" for="login-username">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Username
                </label>
                <input type="text" class="input" id="login-username" name="username" 
                       placeholder="Enter username" autocomplete="username" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="login-password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Password
                </label>
                <div class="input-group">
                  <input type="${showPassword ? 'text' : 'password'}" class="input" id="login-password" 
                         name="password" placeholder="Enter password" autocomplete="current-password" required />
                  <button type="button" class="input-addon" id="toggle-password" title="Toggle visibility">
                    ${showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn--primary btn--block btn--lg" id="btn-login" ${loading ? 'disabled' : ''}>
                ${loading ? '<div class="spinner-small"></div> Authenticating...' : 'Sign In →'}
              </button>
            </form>

            <div class="login-footer">
              <div class="divider" style="margin:20px 0;"></div>
              <div class="flex justify-between items-center">
                <a href="#/" class="text-sm text-secondary" style="display:flex;align-items:center;gap:4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Back to Home
                </a>
                <span class="text-xs text-tertiary">v2.0 · Secured</span>
              </div>
            </div>
          </div>

          <!-- Security Badge -->
          <div class="login-security animate-fade-in-up delay-3">
            <div class="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-400)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span class="text-xs text-tertiary">256-bit encrypted session · Auto-logout after 8h</span>
            </div>
          </div>
        </div>
      </div>
    `;

        setupEvents();
    }

    function setupEvents() {
        const form = document.getElementById('login-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username')?.value?.trim();
            const password = document.getElementById('login-password')?.value;

            if (!username || !password) {
                error = 'Please enter both username and password';
                render();
                return;
            }

            loading = true;
            render();

            // Simulate network delay for realism
            await new Promise(r => setTimeout(r, 800));

            const result = login(username, password);
            recordLoginAttempt(username, result.success);

            if (result.success) {
                loading = false;
                // Success animation
                const card = document.querySelector('.login-card');
                if (card) {
                    card.style.borderColor = 'var(--color-success-400)';
                    card.innerHTML = `
            <div style="text-align:center;padding:40px;">
              <div style="font-size:3rem;margin-bottom:12px;" class="animate-scale-in">✅</div>
              <h3 style="color:var(--color-success-400);">Welcome, ${result.user.name}!</h3>
              <p class="text-secondary text-sm">Redirecting to dashboard...</p>
            </div>
          `;
                }
                setTimeout(() => navigate('/admin'), 1200);
            } else {
                loading = false;
                error = result.error;
                render();
                // Focus username field
                document.getElementById('login-username')?.focus();
            }
        });

        document.getElementById('toggle-password')?.addEventListener('click', () => {
            showPassword = !showPassword;
            render();
            // Restore focus to password field
            document.getElementById('login-password')?.focus();
        });

        // Auto-focus username
        document.getElementById('login-username')?.focus();
    }

    render();
    return {};
}

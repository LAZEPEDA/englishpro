// ========================================
// EnglishPro — Authentication Module
// ========================================

const AUTH_KEY = 'englishpro_auth';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

// Default admin credentials (in production, these would be server-side)
const ADMIN_ACCOUNTS = [
    {
        username: 'admin',
        password: 'EnglishPro2026!',
        role: 'superadmin',
        name: 'Administrator',
        email: 'admin@englishpro.app'
    },
    {
        username: 'manager',
        password: 'Manager2026!',
        role: 'manager',
        name: 'Test Manager',
        email: 'manager@englishpro.app'
    },
];

/**
 * Attempt login with username/password.
 * Returns { success, user, error }
 */
export function login(username, password) {
    const account = ADMIN_ACCOUNTS.find(
        a => a.username.toLowerCase() === username.toLowerCase() && a.password === password
    );

    if (!account) {
        return { success: false, user: null, error: 'Invalid credentials' };
    }

    const session = {
        username: account.username,
        role: account.role,
        name: account.name,
        email: account.email,
        loginTime: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION,
        token: generateToken(),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, user: session, error: null };
}

/**
 * Logout — destroy session.
 */
export function logout() {
    localStorage.removeItem(AUTH_KEY);
}

/**
 * Check if user is currently authenticated.
 */
export function isAuthenticated() {
    const session = getSession();
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
        logout();
        return false;
    }
    return true;
}

/**
 * Get current session data.
 */
export function getSession() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * Check if session has a specific role.
 */
export function hasRole(role) {
    const session = getSession();
    if (!session) return false;
    if (role === 'any') return true;
    if (session.role === 'superadmin') return true; // superadmin has all roles
    return session.role === role;
}

/**
 * Get time remaining in session (formatted).
 */
export function getSessionTimeRemaining() {
    const session = getSession();
    if (!session) return '0:00';
    const remaining = Math.max(0, session.expiresAt - Date.now());
    const hours = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    return `${hours}h ${mins}m`;
}

/**
 * Generate a pseudo-random token.
 */
function generateToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Log login attempt (for security audit).
 */
export function getLoginHistory() {
    try {
        return JSON.parse(localStorage.getItem('englishpro_login_history') || '[]');
    } catch {
        return [];
    }
}

export function recordLoginAttempt(username, success) {
    const history = getLoginHistory();
    history.unshift({
        username,
        success,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1', // Client-side only
    });
    // Keep last 50 entries
    localStorage.setItem('englishpro_login_history', JSON.stringify(history.slice(0, 50)));
}

// ========================================
// EnglishPro — SPA Router (Hash-based)
// ========================================

const routes = {};
let currentPage = null;

export function registerRoute(path, handler) {
    routes[path] = handler;
}

export function navigate(path) {
    window.location.hash = path;
}

export function getCurrentRoute() {
    return window.location.hash.slice(1) || '/';
}

function matchRoute(hash) {
    const path = hash.slice(1) || '/';
    // Exact match
    if (routes[path]) return { handler: routes[path], params: {} };
    // Pattern match (e.g., /exam/:type)
    for (const [pattern, handler] of Object.entries(routes)) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        if (patternParts.length !== pathParts.length) continue;
        const params = {};
        let match = true;
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
                match = false;
                break;
            }
        }
        if (match) return { handler, params };
    }
    return null;
}

async function handleRoute() {
    const app = document.getElementById('app');
    const match = matchRoute(window.location.hash);

    if (match) {
        // Fade out current content
        app.style.opacity = '0';
        await new Promise(r => setTimeout(r, 150));

        if (currentPage && currentPage.destroy) {
            currentPage.destroy();
        }

        app.innerHTML = '';
        currentPage = await match.handler(app, match.params);

        // Fade in new content
        requestAnimationFrame(() => {
            app.style.opacity = '1';
        });
    } else {
        // 404
        app.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;">
        <h1 style="font-size:6rem;margin-bottom:1rem;" class="text-gradient">404</h1>
        <p style="color:var(--text-secondary);margin-bottom:2rem;">Page not found</p>
        <a href="#/" class="btn btn--primary">Go Home</a>
      </div>
    `;
    }
}

export function initRouter() {
    const app = document.getElementById('app');
    app.style.transition = 'opacity 150ms ease';
    app.style.opacity = '1';

    window.addEventListener('hashchange', handleRoute);

    if (!window.location.hash) {
        window.location.hash = '#/';
    } else {
        handleRoute();
    }
}

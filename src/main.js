// ========================================
// EnglishPro — Main Entry Point
// ========================================
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/pages.css';

import { registerRoute, initRouter } from './router.js';

// Import pages
import LandingPage from './pages/landing.js';
import ExamSelectPage from './pages/exam-select.js';
import SystemCheckPage from './pages/system-check.js';
import ExamRunnerPage from './pages/exam-runner.js';
import ResultsPage from './pages/results.js';
import CertificatePage from './pages/certificate.js';
import VerifyPage from './pages/verify.js';
import LoginPage from './pages/login.js';
import AdminPage from './pages/admin.js';

// Public routes
registerRoute('/', LandingPage);
registerRoute('/exam-select', ExamSelectPage);
registerRoute('/system-check', SystemCheckPage);
registerRoute('/exam/:type', ExamRunnerPage);
registerRoute('/results', ResultsPage);
registerRoute('/certificate', CertificatePage);
registerRoute('/verify', VerifyPage);
registerRoute('/verify/:hash', VerifyPage);
registerRoute('/login', LoginPage);

// Protected routes (require authentication)
registerRoute('/admin', AdminPage, { protected: true });

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});

// Also handle case where DOM is already loaded
if (document.readyState !== 'loading') {
  initRouter();
}

// Preload speech synthesis voices
if ('speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

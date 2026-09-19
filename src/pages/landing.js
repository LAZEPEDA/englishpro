// ========================================
// EnglishPro — Landing Page
// ========================================
import { navigate } from '../router.js';

export default function LandingPage(container) {
    container.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar" id="main-nav">
      <div class="navbar__inner">
        <a href="#/" class="navbar__brand">
          <div class="navbar__brand-icon">E</div>
          EnglishPro
        </a>
        <div class="navbar__links hide-mobile">
          <a href="#/exam-select" class="btn btn--ghost btn--sm">Take Test</a>
          <a href="#/admin" class="btn btn--ghost btn--sm">Admin</a>
          <a href="#/exam-select" class="btn btn--primary btn--sm">Get Started</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="hero__bg">
        <div class="hero__orb hero__orb--1"></div>
        <div class="hero__orb hero__orb--2"></div>
        <div class="hero__orb hero__orb--3"></div>
      </div>
      <div class="container hero__content">
        <div class="hero__badge animate-fade-in-up">
          <span class="badge badge--primary">🎓 CEFR-Aligned Assessment</span>
        </div>
        <h1 class="hero__title animate-fade-in-up delay-1">
          Discover Your<br />
          <span class="text-gradient">English Level</span>
        </h1>
        <p class="hero__subtitle animate-fade-in-up delay-2">
          Adaptive testing powered by psychometric science. Get precise CEFR results
          with international equivalencies in minutes.
        </p>
        <div class="hero__actions animate-fade-in-up delay-3">
          <a href="#/exam-select" class="btn btn--primary btn--lg" id="cta-start">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Start Free Assessment
          </a>
          <a href="#features" class="btn btn--secondary btn--lg">Learn More</a>
        </div>
        <div class="hero__stats animate-fade-in-up delay-4">
          <div class="hero__stat">
            <div class="hero__stat-number" data-count="50000">0</div>
            <div class="hero__stat-label">Tests Taken</div>
          </div>
          <div class="hero__stat-divider"></div>
          <div class="hero__stat">
            <div class="hero__stat-number" data-count="98">0</div>
            <div class="hero__stat-label">% Accuracy</div>
          </div>
          <div class="hero__stat-divider"></div>
          <div class="hero__stat">
            <div class="hero__stat-number" data-count="6">0</div>
            <div class="hero__stat-label">CEFR Levels</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header animate-fade-in-up">
          <span class="badge badge--primary">Features</span>
          <h2>Why EnglishPro?</h2>
          <p class="text-secondary">Industry-leading assessment methodology with cutting-edge technology</p>
        </div>
        <div class="features__grid grid grid-3 gap-6">
          ${[
            { icon: '🧠', title: 'Adaptive Testing (ca-MST)', desc: 'Multi-stage adaptive engine adjusts difficulty in real-time using IRT/Rasch psychometrics for maximum precision.' },
            { icon: '🛡️', title: 'Anti-Guessing Control', desc: 'Lucky guess detection reduces weight of statistically improbable correct answers for honest scoring.' },
            { icon: '📊', title: 'Range-Based Scoring', desc: 'Short tests report honest level ranges (e.g., B1-B2) with standard error transparency.' },
            { icon: '🎯', title: '4-Skills Assessment', desc: 'Complete evaluation of Reading, Listening, Writing, and Speaking aligned to CEFR standards.' },
            { icon: '🤖', title: 'AI-Powered Grading', desc: 'Automated evaluation of writing and speaking using NLP analysis for grammar, coherence, and vocabulary.' },
            { icon: '📜', title: 'Digital Certificates', desc: 'Verifiable digital certificates with unique hash codes, PDF export, and LinkedIn integration.' },
        ].map((f, i) => `
            <div class="card animate-fade-in-up delay-${i + 1}">
              <div class="card__header">
                <div class="card__icon">${f.icon}</div>
                <div class="card__title">${f.title}</div>
              </div>
              <p class="text-secondary text-sm">${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CEFR Scale Section -->
    <section class="cefr-section">
      <div class="container">
        <div class="section-header animate-fade-in-up">
          <span class="badge badge--primary">Score Scale</span>
          <h2>EnglishPro Score → CEFR Level</h2>
          <p class="text-secondary">Linear scale from 0 to 100 with international equivalencies</p>
        </div>
        <div class="cefr-scale">
          ${[
            { level: 'A1', range: '21-30', color: '#4ade80', desc: 'Beginner', ielts: '–', toefl: '–' },
            { level: 'A2', range: '31-40', color: '#22c55e', desc: 'Elementary', ielts: '3.0-3.5', toefl: '–' },
            { level: 'B1', range: '41-50', color: '#38bdf8', desc: 'Intermediate', ielts: '4.0-5.0', toefl: '42-71' },
            { level: 'B2', range: '51-60', color: '#0ea5e9', desc: 'Upper-Inter.', ielts: '5.5-6.5', toefl: '72-94' },
            { level: 'C1', range: '61-70', color: '#a855f7', desc: 'Advanced', ielts: '7.0-8.0', toefl: '95-113' },
            { level: 'C2', range: '71-100', color: '#9333ea', desc: 'Mastery', ielts: '8.5-9.0', toefl: '114-120' },
        ].map((l, i) => `
            <div class="cefr-scale__item animate-fade-in-up delay-${i + 1}" style="--level-color: ${l.color}">
              <div class="cefr-scale__level" style="background: ${l.color}">${l.level}</div>
              <div class="cefr-scale__info">
                <div class="cefr-scale__range">${l.range} pts</div>
                <div class="cefr-scale__desc">${l.desc}</div>
              </div>
              <div class="cefr-scale__equiv hide-mobile">
                <span>IELTS: ${l.ielts}</span>
                <span>TOEFL: ${l.toefl}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card animate-fade-in-up">
          <h2>Ready to discover your level?</h2>
          <p class="text-secondary">Take the adaptive assessment and get your CEFR certificate in minutes.</p>
          <a href="#/exam-select" class="btn btn--primary btn--lg">
            Start Now — It's Free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer__inner">
          <div class="footer__brand">
            <div class="navbar__brand">
              <div class="navbar__brand-icon">E</div>
              EnglishPro
            </div>
            <p class="text-secondary text-sm">Adaptive English assessment powered by psychometric science.</p>
          </div>
          <div class="footer__links">
            <a href="#/exam-select">Take Test</a>
            <a href="#/admin">Admin Panel</a>
            <a href="#/verify">Verify Certificate</a>
          </div>
          <div class="footer__copy text-tertiary text-xs">
            © 2026 EnglishPro. All Rights Reserved. Powered by IRT/Rasch Psychometrics.
          </div>
        </div>
      </div>
    </footer>
  `;

    // Animate hero stats counters
    const counters = container.querySelectorAll('[data-count]');
    counters.forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = target >= 1000 ? Math.round(current).toLocaleString() + '+' : Math.round(current);
        }, 16);
    });

    return {};
}

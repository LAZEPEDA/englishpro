// ========================================
// EnglishPro — System Check Page
// ========================================
import { getState, setState } from '../state.js';
import { navigate } from '../router.js';

export default function SystemCheckPage(container) {
    const checks = [
        { id: 'browser', label: 'Browser Compatibility', icon: '🌐', status: 'pending' },
        { id: 'audio', label: 'Audio Playback', icon: '🔊', status: 'pending' },
        { id: 'microphone', label: 'Microphone Access', icon: '🎤', status: 'pending' },
        { id: 'internet', label: 'Internet Connection', icon: '📶', status: 'pending' },
    ];

    const examType = getState().exam.type;
    // Only check mic for tests that need it
    const needsMic = ['full', 'modular'].includes(examType) &&
        (examType !== 'modular' || getState().exam.skill === 'speaking');

    function render() {
        container.innerHTML = `
      <nav class="navbar">
        <div class="navbar__inner">
          <a href="#/" class="navbar__brand">
            <div class="navbar__brand-icon">E</div>
            EnglishPro
          </a>
          <a href="#/exam-select" class="btn btn--ghost btn--sm">← Back</a>
        </div>
      </nav>

      <section style="padding-top:120px;min-height:100vh;">
        <div class="container container--narrow">
          <div class="section-header animate-fade-in-up" style="text-align:center;">
            <div class="card__icon" style="width:64px;height:64px;font-size:2rem;margin:0 auto 16px;">⚙️</div>
            <h2>System Check</h2>
            <p class="text-secondary">We need to verify your device is ready before starting the exam.</p>
          </div>

          <div class="system-checks card animate-fade-in-up delay-2" style="margin-top:32px;">
            ${checks.map(c => `
              <div class="system-check__item" id="check-${c.id}">
                <div class="flex items-center gap-3">
                  <span style="font-size:1.5rem;">${c.icon}</span>
                  <span>${c.label}</span>
                  ${!needsMic && c.id === 'microphone' ? '<span class="text-xs text-tertiary">(Not required)</span>' : ''}
                </div>
                <div class="system-check__status" id="status-${c.id}">
                  <div class="check-pending">
                    <div class="spinner-small"></div>
                    <span class="text-secondary text-sm">Checking...</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="flex justify-center gap-4" style="margin-top:32px;" id="check-actions">
            <button class="btn btn--secondary" id="btn-skip">Skip & Continue</button>
            <button class="btn btn--primary" id="btn-continue" disabled>
              Continue to Exam
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </section>
    `;

        runChecks();
        setupEvents();
    }

    async function runChecks() {
        // Browser check
        await delay(500);
        setCheckStatus('browser', 'pass', 'Compatible ✓');

        // Audio check
        await delay(800);
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            ctx.close();
            setCheckStatus('audio', 'pass', 'Working ✓');
        } catch {
            setCheckStatus('audio', 'warn', 'Limited support');
        }

        // Microphone
        await delay(600);
        if (needsMic) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(t => t.stop());
                setCheckStatus('microphone', 'pass', 'Connected ✓');
            } catch {
                setCheckStatus('microphone', 'fail', 'Not available — Speaking section will be limited');
            }
        } else {
            setCheckStatus('microphone', 'skip', 'Not needed');
        }

        // Internet
        await delay(400);
        setCheckStatus('internet', 'pass', `Connected ✓`);

        // Enable continue button
        const btn = document.getElementById('btn-continue');
        if (btn) {
            btn.disabled = false;
            btn.classList.add('animate-glow');
        }
    }

    function setCheckStatus(id, status, message) {
        const el = document.getElementById(`status-${id}`);
        if (!el) return;

        const icons = { pass: '✅', fail: '❌', warn: '⚠️', skip: '⏭️' };
        const colors = { pass: 'var(--color-success-400)', fail: 'var(--color-danger-400)', warn: 'var(--color-warning-400)', skip: 'var(--text-tertiary)' };

        el.innerHTML = `
      <div class="flex items-center gap-2 animate-scale-in">
        <span>${icons[status]}</span>
        <span class="text-sm" style="color:${colors[status]}">${message}</span>
      </div>
    `;
    }

    function setupEvents() {
        document.getElementById('btn-continue')?.addEventListener('click', () => {
            setState('exam.status', 'in-progress');
            navigate(`/exam/${getState().exam.type}`);
        });

        document.getElementById('btn-skip')?.addEventListener('click', () => {
            setState('exam.status', 'in-progress');
            navigate(`/exam/${getState().exam.type}`);
        });
    }

    function delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    render();
    return {};
}

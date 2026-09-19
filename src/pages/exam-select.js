// ========================================
// EnglishPro — Exam Selection Page
// ========================================
import { setState } from '../state.js';
import { navigate } from '../router.js';

const examTypes = [
    {
        id: 'quick',
        icon: '⚡',
        title: 'Quick Diagnostic',
        duration: '5-15 min',
        skills: ['Reading'],
        description: 'Fast level check with range-based results. Perfect for a quick assessment of your level range.',
        features: ['10-20 adaptive questions', 'Range report (e.g., B1-B2)', 'Anti-guessing control', 'Instant results'],
        color: '#22c55e',
        free: true,
    },
    {
        id: 'standard',
        icon: '📖',
        title: 'Receptive Standard',
        duration: '50 min',
        skills: ['Reading', 'Listening'],
        description: 'Comprehensive evaluation of receptive skills aligned to CEFR standards.',
        features: ['Reading comprehension', 'Listening comprehension', 'Adaptive difficulty', 'Precise CEFR level', 'International equivalencies'],
        color: '#0ea5e9',
        free: true,
    },
    {
        id: 'full',
        icon: '🏆',
        title: 'Full 4-Skills Test',
        duration: '90-120 min',
        skills: ['Reading', 'Listening', 'Writing', 'Speaking'],
        description: 'Complete proficiency profile with all four language skills and digital certificate.',
        features: ['All receptive & productive skills', 'AI-graded Writing & Speaking', 'Full competency profile', 'Digital certificate', 'LinkedIn integration'],
        color: '#a855f7',
        free: false,
    },
    {
        id: 'modular',
        icon: '🧩',
        title: 'Modular Skill Check',
        duration: '15-30 min',
        skills: ['Choose 1'],
        description: 'Evaluate a single skill or domain. Ideal for focused practice and preparation.',
        features: ['Choose any single skill', 'Grammar & Use of English', 'Vocabulary assessment', 'Level-specific practice', 'Cambridge-style prep'],
        color: '#f59e0b',
        free: true,
    },
];

const skillModules = [
    { id: 'reading', icon: '📖', label: 'Reading' },
    { id: 'listening', icon: '🎧', label: 'Listening' },
    { id: 'writing', icon: '✍️', label: 'Writing' },
    { id: 'speaking', icon: '🎙️', label: 'Speaking' },
    { id: 'grammar', icon: '📐', label: 'Grammar & Use of English' },
];

export default function ExamSelectPage(container) {
    let selectedType = null;
    let showModular = false;

    function render() {
        container.innerHTML = `
      <nav class="navbar">
        <div class="navbar__inner">
          <a href="#/" class="navbar__brand">
            <div class="navbar__brand-icon">E</div>
            EnglishPro
          </a>
          <a href="#/" class="btn btn--ghost btn--sm">← Back</a>
        </div>
      </nav>

      <section class="exam-select" style="padding-top:100px;min-height:100vh;">
        <div class="container">
          <div class="section-header animate-fade-in-up">
            <h1>Choose Your<br /><span class="text-gradient">Assessment</span></h1>
            <p class="text-secondary">Select the exam format that matches your needs</p>
          </div>

          <div class="exam-cards grid grid-2 gap-6" style="max-width:960px;margin:0 auto;">
            ${examTypes.map((exam, i) => `
              <div class="exam-card card animate-fade-in-up delay-${i + 1}" 
                   data-exam="${exam.id}" 
                   style="--exam-color: ${exam.color}; cursor:pointer;"
                   id="exam-card-${exam.id}">
                <div class="exam-card__header">
                  <span class="exam-card__icon" style="font-size:2.5rem;">${exam.icon}</span>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 style="margin:0;">${exam.title}</h3>
                      ${exam.free ? '<span class="badge badge--success">Free</span>' : '<span class="badge badge--primary">Pro</span>'}
                    </div>
                    <div class="flex items-center gap-3 mt-4" style="margin-top:8px;">
                      <span class="badge badge--primary">${exam.duration}</span>
                      ${exam.skills.map(s => `<span class="text-xs text-secondary">${s}</span>`).join(' · ')}
                    </div>
                  </div>
                </div>
                <p class="text-secondary text-sm" style="margin:16px 0;">${exam.description}</p>
                <ul class="exam-card__features">
                  ${exam.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
                <button class="btn btn--primary btn--block" style="margin-top:auto; background:${exam.color};" 
                        data-start="${exam.id}">
                  ${exam.id === 'full' ? '🔓 Start Pro Test' : 'Start Test'}
                </button>
              </div>
            `).join('')}
          </div>

          ${showModular ? `
            <div class="modular-select animate-slide-up" style="max-width:600px;margin:40px auto 0;">
              <div class="card">
                <h3 style="margin-bottom:16px;">Select a Skill Module</h3>
                <div class="grid grid-2 gap-3">
                  ${skillModules.map(s => `
                    <button class="btn btn--secondary skill-btn" data-skill="${s.id}" style="padding:20px;justify-content:flex-start;">
                      <span style="font-size:1.5rem;">${s.icon}</span>
                      <span>${s.label}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </section>
    `;

        // Event listeners
        container.querySelectorAll('[data-start]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = btn.dataset.start;
                if (type === 'modular') {
                    showModular = true;
                    render();
                    return;
                }
                startExam(type);
            });
        });

        container.querySelectorAll('.skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const skill = btn.dataset.skill;
                setState('exam.skill', skill);
                startExam('modular');
            });
        });
    }

    function startExam(type) {
        setState('exam.type', type);
        setState('exam.status', 'system-check');

        // Skip system check for reading-only tests
        if (type === 'quick') {
            setState('exam.status', 'in-progress');
            navigate('/exam/quick');
        } else {
            navigate('/system-check');
        }
    }

    render();
    return {};
}

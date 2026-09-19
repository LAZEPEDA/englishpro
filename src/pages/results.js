// ========================================
// EnglishPro — Results Dashboard
// ========================================
import { getState, generateCertHash } from '../state.js';
import { scoreToCEFR, equivalencyTable, cefrScoreRange, coherenceMatrix, combinedScore, getCanDoDescriptors, getStudyRecommendations } from '../engine/scoring.js';
import Chart from 'chart.js/auto';

export default function ResultsPage(container) {
    const results = getState().results;
    const score = results.score || 52;
    const level = results.cefrLevel || scoreToCEFR(score);
    const range = results.cefrRange || level;
    const skillScores = results.skillScores || { reading: score, listening: null, writing: null, speaking: null };
    const equiv = equivalencyTable(score);
    const canDo = getCanDoDescriptors(level);
    const warnings = coherenceMatrix(skillScores);
    const recommendations = getStudyRecommendations(skillScores);
    const activeSkills = Object.entries(skillScores).filter(([, v]) => v !== null);

    const levelColors = {
        'Pre-A1': '#94a3b8', 'A1': '#4ade80', 'A2': '#22c55e',
        'B1': '#38bdf8', 'B2': '#0ea5e9', 'C1': '#a855f7', 'C2': '#9333ea'
    };
    const color = levelColors[level] || '#6366f1';

    container.innerHTML = `
    <nav class="navbar">
      <div class="navbar__inner">
        <a href="#/" class="navbar__brand">
          <div class="navbar__brand-icon">E</div>
          EnglishPro
        </a>
        <div class="flex gap-2">
          <a href="#/exam-select" class="btn btn--ghost btn--sm">Take Another Test</a>
          <a href="#/" class="btn btn--ghost btn--sm">Home</a>
        </div>
      </div>
    </nav>

    <section class="results-page" style="padding-top:100px;padding-bottom:60px;">
      <div class="container" style="max-width:960px;">
        
        <!-- Score Hero -->
        <div class="score-hero card animate-fade-in-up" style="text-align:center;padding:48px 32px;position:relative;overflow:visible;">
          <div class="score-hero__glow" style="position:absolute;inset:-2px;border-radius:var(--radius-xl);background:${color};opacity:0.15;filter:blur(30px);z-index:-1;"></div>
          <p class="text-secondary text-sm" style="margin-bottom:8px;">Your EnglishPro Score</p>
          <div class="score-number" id="score-counter" style="font-size:5rem;font-family:var(--font-display);font-weight:900;color:${color};line-height:1;">
            0
          </div>
          <div class="text-secondary" style="margin:4px 0 16px;">out of 100</div>
          
          <div class="score-level animate-fade-in-up delay-2" style="display:inline-block;">
            <div class="badge badge--cefr" style="font-size:2rem;padding:12px 32px;background:${color}20;color:${color};border:2px solid ${color};">
              ${level}
            </div>
          </div>
          ${range !== level ? `<p class="text-secondary text-sm" style="margin-top:8px;">Range: ${range}</p>` : ''}
          
          <!-- Score bar -->
          <div style="max-width:500px;margin:24px auto 0;">
            <div class="progress progress--xl">
              <div class="progress__bar" id="score-bar" style="width:0%;background:${color};"></div>
            </div>
            <div class="flex justify-between" style="margin-top:8px;">
              <span class="text-xs text-tertiary">0</span>
              ${['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => `<span class="text-xs text-tertiary">${l}</span>`).join('')}
              <span class="text-xs text-tertiary">100</span>
            </div>
          </div>
        </div>

        <!-- Skills Radar + Breakdown -->
        ${activeSkills.length > 1 ? `
        <div class="grid grid-2 gap-6" style="margin-top:24px;">
          <div class="card animate-fade-in-up delay-3" style="display:flex;align-items:center;justify-content:center;">
            <canvas id="skills-radar" width="300" height="300"></canvas>
          </div>
          <div class="card animate-fade-in-up delay-4">
            <h4 style="margin-bottom:16px;">Skill Breakdown</h4>
            ${activeSkills.map(([skill, s]) => `
              <div style="margin-bottom:16px;">
                <div class="flex justify-between items-center" style="margin-bottom:4px;">
                  <span class="text-sm" style="text-transform:capitalize;">${skill}</span>
                  <span class="badge badge--primary" style="font-size:0.7rem;">${scoreToCEFR(s)} · ${s} pts</span>
                </div>
                <div class="progress">
                  <div class="progress__bar" style="width:${s}%;background:${levelColors[scoreToCEFR(s)] || color};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Coherence Warnings -->
        ${warnings.length > 0 ? `
        <div class="card animate-fade-in-up" style="margin-top:24px;border-color:var(--color-warning-500);">
          <div class="card__header">
            <div class="card__icon" style="background:rgba(245,158,11,0.15);">⚠️</div>
            <div class="card__title" style="color:var(--color-warning-400);">Coherence Notice</div>
          </div>
          ${warnings.map(w => `<p class="text-secondary text-sm" style="margin-top:8px;">${w.message}</p>`).join('')}
        </div>
        ` : ''}

        <!-- International Equivalencies -->
        <div class="card animate-fade-in-up delay-5" style="margin-top:24px;">
          <h4 style="margin-bottom:16px;">📊 International Equivalencies</h4>
          <div class="equiv-table" style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:12px;border-bottom:1px solid var(--color-neutral-700);color:var(--text-secondary);font-size:0.8rem;">Exam</th>
                  <th style="text-align:left;padding:12px;border-bottom:1px solid var(--color-neutral-700);color:var(--text-secondary);font-size:0.8rem;">Equivalent Score</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">EnglishPro</td><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);"><strong style="color:${color};">${score} / 100 (${level})</strong></td></tr>
                <tr><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">IELTS</td><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">${equiv.ielts}</td></tr>
                <tr><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">TOEFL iBT</td><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">${equiv.toefl}</td></tr>
                <tr><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">Cambridge English</td><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">${equiv.cambridge}</td></tr>
                <tr><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">TOEIC</td><td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">${equiv.toeic}</td></tr>
                <tr><td style="padding:12px;">Global Scale of English</td><td style="padding:12px;">${equiv.gse}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Can-Do Descriptors -->
        <div class="card animate-fade-in-up delay-6" style="margin-top:24px;">
          <h4 style="margin-bottom:16px;">✅ What You Can Do (${level})</h4>
          <p class="text-secondary" style="margin-bottom:16px;">${canDo.general}</p>
          <div class="grid grid-2 gap-4">
            ${Object.entries(canDo).filter(([k]) => k !== 'general').map(([skill, desc]) => `
              <div style="padding:12px;background:var(--surface-glass);border-radius:var(--radius-lg);border:1px solid var(--surface-glass-border);">
                <div class="text-sm" style="font-weight:600;text-transform:capitalize;margin-bottom:4px;">${skill}</div>
                <p class="text-xs text-secondary">${desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Study Recommendations -->
        <div class="card animate-fade-in-up delay-7" style="margin-top:24px;">
          <h4 style="margin-bottom:16px;">📚 Study Recommendations</h4>
          <ul style="display:flex;flex-direction:column;gap:12px;">
            ${recommendations.map(r => `
              <li style="padding:12px;background:var(--surface-glass);border-radius:var(--radius-lg);border:1px solid var(--surface-glass-border);">
                <p class="text-sm text-secondary">${r}</p>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-4 flex-wrap animate-fade-in-up delay-8" style="margin-top:32px;">
          <a href="#/certificate" class="btn btn--primary btn--lg">
            📜 Get Certificate
          </a>
          <a href="#/exam-select" class="btn btn--secondary btn--lg">
            🔄 Retake Test
          </a>
          <button class="btn btn--outline btn--lg" id="btn-share">
            🔗 Share Results
          </button>
        </div>
      </div>
    </section>
  `;

    // Animate score counter
    let current = 0;
    const target = score;
    const counterEl = document.getElementById('score-counter');
    const barEl = document.getElementById('score-bar');
    const timer = setInterval(() => {
        current += Math.max(1, Math.floor((target - current) / 10));
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        if (counterEl) counterEl.textContent = current;
        if (barEl) barEl.style.width = `${current}%`;
    }, 30);

    // Radar chart
    if (activeSkills.length > 1) {
        setTimeout(() => {
            const canvas = document.getElementById('skills-radar');
            if (canvas) {
                new Chart(canvas, {
                    type: 'radar',
                    data: {
                        labels: activeSkills.map(([s]) => s.charAt(0).toUpperCase() + s.slice(1)),
                        datasets: [{
                            label: 'Your Score',
                            data: activeSkills.map(([, v]) => v),
                            backgroundColor: `${color}33`,
                            borderColor: color,
                            borderWidth: 2,
                            pointBackgroundColor: color,
                            pointRadius: 5,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            r: {
                                min: 0, max: 100,
                                ticks: { stepSize: 20, color: '#64748b', backdropColor: 'transparent' },
                                grid: { color: 'rgba(100,116,139,0.2)' },
                                pointLabels: { color: '#94a3b8', font: { size: 13, family: 'Inter' } }
                            }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }, 500);
    }

    // Share
    document.getElementById('btn-share')?.addEventListener('click', () => {
        const text = `I scored ${score}/100 (${level}) on EnglishPro! 🎓`;
        if (navigator.share) {
            navigator.share({ title: 'EnglishPro Result', text });
        } else {
            navigator.clipboard.writeText(text).then(() => alert('Result copied to clipboard!'));
        }
    });

    return {};
}

// ========================================
// EnglishPro — Certificate Page
// ========================================
import { getState, generateCertHash } from '../state.js';
import { scoreToCEFR, equivalencyTable } from '../engine/scoring.js';
import jsPDF from 'jspdf';

export default function CertificatePage(container) {
    const results = getState().results;
    const score = results.score || 52;
    const level = results.cefrLevel || scoreToCEFR(score);
    const hash = getState().certificate.hash || generateCertHash();
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const skillScores = results.skillScores || {};
    const equiv = equivalencyTable(score);

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
          <a href="#/results" class="btn btn--ghost btn--sm">← Results</a>
          <a href="#/" class="btn btn--ghost btn--sm">Home</a>
        </div>
      </div>
    </nav>

    <section style="padding-top:100px;padding-bottom:60px;">
      <div class="container" style="max-width:800px;">
        <div class="section-header animate-fade-in-up text-center">
          <h2>Your <span class="text-gradient">Certificate</span></h2>
          <p class="text-secondary">Download, share, and verify your English proficiency certificate</p>
        </div>

        <!-- Certificate Preview -->
        <div class="certificate-preview animate-fade-in-up delay-2" id="certificate-preview">
          <div class="cert" id="cert-content">
            <div class="cert__border">
              <div class="cert__inner">
                <div class="cert__header">
                  <div class="cert__logo">
                    <div class="cert__logo-icon">E</div>
                    <span class="cert__logo-text">EnglishPro</span>
                  </div>
                  <div class="cert__title">Certificate of English Proficiency</div>
                  <div class="cert__subtitle">CEFR-Aligned Adaptive Assessment</div>
                </div>
                
                <div class="cert__body">
                  <div class="cert__name" id="cert-name">Test Candidate</div>
                  <div class="cert__text">has demonstrated English language proficiency at level</div>
                  
                  <div class="cert__level" style="color:${color};">${level}</div>
                  <div class="cert__score">Score: ${score} / 100</div>
                  
                  <div class="cert__skills">
                    ${Object.entries(skillScores).filter(([, v]) => v !== null).map(([s, v]) => `
                      <div class="cert__skill">
                        <div class="cert__skill-name">${s.charAt(0).toUpperCase() + s.slice(1)}</div>
                        <div class="cert__skill-score">${v} pts (${scoreToCEFR(v)})</div>
                      </div>
                    `).join('')}
                  </div>
                  
                  <div class="cert__equiv">
                    IELTS: ${equiv.ielts} · TOEFL: ${equiv.toefl} · Cambridge: ${equiv.cambridge}
                  </div>
                </div>
                
                <div class="cert__footer">
                  <div class="cert__date">${date}</div>
                  <div class="cert__hash">
                    <div class="cert__hash-label">Verification ID</div>
                    <div class="cert__hash-value">${hash}</div>
                  </div>
                  <div class="cert__verify">
                    Verify at: englishpro.app/verify/${hash}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Name -->
        <div class="card animate-fade-in-up delay-3" style="margin-top:24px;">
          <div class="flex items-center gap-3">
            <label class="text-sm" style="white-space:nowrap;">Candidate Name:</label>
            <input type="text" class="input" id="cert-name-input" placeholder="Enter your full name" value="Test Candidate" />
            <button class="btn btn--secondary btn--sm" id="btn-update-name">Update</button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-4 flex-wrap animate-fade-in-up delay-4" style="margin-top:24px;">
          <button class="btn btn--primary btn--lg" id="btn-download-pdf">
            📥 Download PDF
          </button>
          <button class="btn btn--secondary btn--lg" id="btn-share-linkedin">
            💼 Share on LinkedIn
          </button>
          <a href="#/verify/${hash}" class="btn btn--outline btn--lg">
            ✓ Verify Certificate
          </a>
        </div>

        <!-- Verification Info -->
        <div class="card animate-fade-in-up delay-5" style="margin-top:24px;text-align:center;">
          <p class="text-sm text-secondary">
            Your certificate has a unique verification ID: <strong style="color:${color};">${hash}</strong><br/>
            Anyone can verify the authenticity of this certificate using this ID.
          </p>
        </div>
      </div>
    </section>
  `;

    // Update name
    document.getElementById('btn-update-name')?.addEventListener('click', () => {
        const name = document.getElementById('cert-name-input')?.value || 'Test Candidate';
        const nameEl = document.getElementById('cert-name');
        if (nameEl) nameEl.textContent = name;
    });

    // Download PDF
    document.getElementById('btn-download-pdf')?.addEventListener('click', () => {
        generatePDF();
    });

    // Share LinkedIn
    document.getElementById('btn-share-linkedin')?.addEventListener('click', () => {
        const text = encodeURIComponent(`I scored ${score}/100 (${level}) on my EnglishPro Assessment! 🎓 #EnglishPro #CEFR #English`);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://englishpro.app')}&summary=${text}`, '_blank');
    });

    function generatePDF() {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        // Background
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, 297, 210, 'F');

        // Border
        pdf.setDrawColor(99, 102, 241);
        pdf.setLineWidth(2);
        pdf.rect(10, 10, 277, 190);
        pdf.setLineWidth(0.5);
        pdf.rect(14, 14, 269, 182);

        // Header
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(28);
        pdf.setTextColor(241, 245, 249);
        pdf.text('EnglishPro', 148.5, 35, { align: 'center' });

        pdf.setFontSize(14);
        pdf.setTextColor(148, 163, 184);
        pdf.text('Certificate of English Proficiency', 148.5, 45, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text('CEFR-Aligned Adaptive Assessment', 148.5, 53, { align: 'center' });

        // Line
        pdf.setDrawColor(99, 102, 241);
        pdf.setLineWidth(0.5);
        pdf.line(60, 58, 237, 58);

        // Name
        const name = document.getElementById('cert-name')?.textContent || 'Test Candidate';
        pdf.setFontSize(24);
        pdf.setTextColor(241, 245, 249);
        pdf.text(name, 148.5, 78, { align: 'center' });

        pdf.setFontSize(11);
        pdf.setTextColor(148, 163, 184);
        pdf.text('has demonstrated English language proficiency at level', 148.5, 88, { align: 'center' });

        // Level
        pdf.setFontSize(48);
        pdf.setTextColor(99, 102, 241);
        pdf.text(level, 148.5, 115, { align: 'center' });

        pdf.setFontSize(14);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`Score: ${score} / 100`, 148.5, 125, { align: 'center' });

        // Skills
        const skills = Object.entries(skillScores).filter(([, v]) => v !== null);
        if (skills.length > 0) {
            let y = 140;
            pdf.setFontSize(10);
            const skillText = skills.map(([s, v]) => `${s.charAt(0).toUpperCase() + s.slice(1)}: ${v} pts (${scoreToCEFR(v)})`).join('  ·  ');
            pdf.text(skillText, 148.5, y, { align: 'center' });
            y += 8;
            pdf.text(`IELTS: ${equiv.ielts}  ·  TOEFL: ${equiv.toefl}  ·  Cambridge: ${equiv.cambridge}`, 148.5, y, { align: 'center' });
        }

        // Footer
        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139);
        pdf.text(date, 30, 185);
        pdf.text(`Verification ID: ${hash}`, 148.5, 185, { align: 'center' });
        pdf.text('englishpro.app/verify', 267, 185, { align: 'right' });

        pdf.save(`EnglishPro_Certificate_${level}_${hash}.pdf`);
    }

    return {};
}

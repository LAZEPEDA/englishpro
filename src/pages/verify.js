// ========================================
// EnglishPro — Certificate Verification Page
// ========================================
import { getState } from '../state.js';
import { scoreToCEFR, equivalencyTable } from '../engine/scoring.js';

export default function VerifyPage(container, params) {
    const hash = params.hash || '';
    const storedHash = getState().certificate.hash;
    const results = getState().results;
    const isValid = hash && hash === storedHash && results.score > 0;

    container.innerHTML = `
    <nav class="navbar">
      <div class="navbar__inner">
        <a href="#/" class="navbar__brand">
          <div class="navbar__brand-icon">E</div>
          EnglishPro
        </a>
        <a href="#/" class="btn btn--ghost btn--sm">Home</a>
      </div>
    </nav>

    <section style="padding-top:120px;min-height:100vh;">
      <div class="container container--narrow" style="text-align:center;">
        
        ${hash ? `
          ${isValid ? `
            <div class="card animate-scale-in" style="padding:48px 32px;">
              <div style="font-size:4rem;margin-bottom:16px;">✅</div>
              <h2 style="color:var(--color-success-400);margin-bottom:8px;">Certificate Verified</h2>
              <p class="text-secondary">This certificate is authentic and was issued by EnglishPro.</p>
              
              <div class="divider"></div>
              
              <div style="text-align:left;">
                <div class="flex justify-between" style="margin-bottom:12px;">
                  <span class="text-secondary">Verification ID</span>
                  <span style="font-weight:600;">${hash}</span>
                </div>
                <div class="flex justify-between" style="margin-bottom:12px;">
                  <span class="text-secondary">CEFR Level</span>
                  <span class="badge badge--primary badge--cefr" style="font-size:0.9rem;">${results.cefrLevel}</span>
                </div>
                <div class="flex justify-between" style="margin-bottom:12px;">
                  <span class="text-secondary">Score</span>
                  <span style="font-weight:600;">${results.score} / 100</span>
                </div>
                <div class="flex justify-between" style="margin-bottom:12px;">
                  <span class="text-secondary">Date</span>
                  <span>${results.completedAt ? new Date(results.completedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          ` : `
            <div class="card animate-scale-in" style="padding:48px 32px;">
              <div style="font-size:4rem;margin-bottom:16px;">❌</div>
              <h2 style="color:var(--color-danger-400);margin-bottom:8px;">Certificate Not Found</h2>
              <p class="text-secondary">The verification ID <strong>${hash}</strong> does not match any certificate in our system.</p>
              <p class="text-tertiary text-sm" style="margin-top:16px;">This could mean the certificate is invalid or has expired.</p>
            </div>
          `}
        ` : `
          <div class="card animate-fade-in-up" style="padding:48px 32px;">
            <div style="font-size:4rem;margin-bottom:16px;">🔍</div>
            <h2>Verify a Certificate</h2>
            <p class="text-secondary" style="margin-bottom:24px;">Enter the verification ID from an EnglishPro certificate</p>
            <div class="flex gap-3" style="max-width:400px;margin:0 auto;">
              <input type="text" class="input" id="verify-input" placeholder="EP-XXXXXX-XXXXXXXX" />
              <button class="btn btn--primary" id="btn-verify">Verify</button>
            </div>
          </div>
        `}
      </div>
    </section>
  `;

    document.getElementById('btn-verify')?.addEventListener('click', () => {
        const input = document.getElementById('verify-input')?.value?.trim();
        if (input) window.location.hash = `#/verify/${input}`;
    });

    return {};
}

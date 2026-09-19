// ========================================
// EnglishPro — Admin Panel (Mockup)
// ========================================

export default function AdminPage(container) {
    let activeTab = 'overview';

    function render() {
        container.innerHTML = `
      <nav class="navbar">
        <div class="navbar__inner">
          <a href="#/" class="navbar__brand">
            <div class="navbar__brand-icon">E</div>
            EnglishPro
          </a>
          <div class="flex gap-2">
            <span class="badge badge--primary">Admin Panel</span>
            <a href="#/" class="btn btn--ghost btn--sm">Exit</a>
          </div>
        </div>
      </nav>

      <section style="padding-top:80px;min-height:100vh;">
        <div class="container">
          <!-- Tabs -->
          <div class="tabs" style="margin-bottom:24px;max-width:600px;">
            ${['overview', 'corporate', 'placement', 'item-bank', 'settings'].map(tab => `
              <button class="tab ${tab === activeTab ? 'tab--active' : ''}" data-tab="${tab}">
                ${tab.charAt(0).toUpperCase() + tab.replace('-', ' ').slice(1)}
              </button>
            `).join('')}
          </div>

          ${renderTabContent()}
        </div>
      </section>
    `;

        container.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeTab = tab.dataset.tab;
                render();
            });
        });
    }

    function renderTabContent() {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'corporate': return renderCorporate();
            case 'placement': return renderPlacement();
            case 'item-bank': return renderItemBank();
            case 'settings': return renderSettings();
            default: return '';
        }
    }

    function renderOverview() {
        return `
      <div class="grid grid-4 gap-4 animate-fade-in-up">
        ${[
                { label: 'Total Tests', value: '12,847', change: '+23%', icon: '📝' },
                { label: 'Active Users', value: '3,291', change: '+12%', icon: '👥' },
                { label: 'Avg Score', value: '54.2', change: '+2.1', icon: '📊' },
                { label: 'Certificates', value: '1,832', change: '+18%', icon: '📜' },
            ].map(stat => `
          <div class="card">
            <div class="flex justify-between items-center">
              <span class="text-sm text-secondary">${stat.label}</span>
              <span style="font-size:1.5rem;">${stat.icon}</span>
            </div>
            <div style="font-size:2rem;font-family:var(--font-display);font-weight:700;margin:8px 0;">${stat.value}</div>
            <span class="badge badge--success">${stat.change} this month</span>
          </div>
        `).join('')}
      </div>

      <div class="grid grid-2 gap-6" style="margin-top:24px;">
        <div class="card animate-fade-in-up delay-2">
          <h4 style="margin-bottom:16px;">Level Distribution</h4>
          ${['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l, i) => {
                const pcts = [8, 15, 28, 25, 18, 6];
                return `
              <div class="flex items-center gap-3" style="margin-bottom:8px;">
                <span class="text-sm" style="min-width:24px;">${l}</span>
                <div class="progress" style="flex:1;">
                  <div class="progress__bar" style="width:${pcts[i]}%;"></div>
                </div>
                <span class="text-xs text-secondary">${pcts[i]}%</span>
              </div>
            `;
            }).join('')}
        </div>
        <div class="card animate-fade-in-up delay-3">
          <h4 style="margin-bottom:16px;">Recent Activity</h4>
          ${[
                { user: 'Maria G.', score: 62, level: 'C1', time: '2 min ago' },
                { user: 'Carlos R.', score: 45, level: 'B1', time: '5 min ago' },
                { user: 'Ana L.', score: 73, level: 'C2', time: '12 min ago' },
                { user: 'Pedro M.', score: 38, level: 'A2', time: '18 min ago' },
                { user: 'Sofia B.', score: 55, level: 'B2', time: '25 min ago' },
            ].map(a => `
            <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--color-neutral-800);">
              <div>
                <span class="text-sm">${a.user}</span>
                <span class="text-xs text-tertiary" style="margin-left:8px;">${a.time}</span>
              </div>
              <div class="flex gap-2 items-center">
                <span class="text-sm">${a.score} pts</span>
                <span class="badge badge--primary" style="font-size:0.65rem;">${a.level}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }

    function renderCorporate() {
        return `
      <div class="card animate-fade-in-up">
        <div class="card__header">
          <div class="card__icon">🏢</div>
          <div>
            <div class="card__title">Corporate Batch Testing</div>
            <div class="card__subtitle">Manage employee assessments and departmental reports</div>
          </div>
        </div>
        <div class="divider" style="margin:16px 0;"></div>
        
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left;padding:12px;border-bottom:1px solid var(--color-neutral-700);color:var(--text-secondary);font-size:0.8rem;">Department</th>
                <th style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-700);color:var(--text-secondary);font-size:0.8rem;">Employees</th>
                <th style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-700);color:var(--text-secondary);font-size:0.8rem;">Avg Score</th>
                <th style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-700);color:var(--text-secondary);font-size:0.8rem;">Avg Level</th>
                <th style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-700);color:var(--text-secondary);font-size:0.8rem;">Completion</th>
              </tr>
            </thead>
            <tbody>
              ${[
                { dept: 'Sales', emps: 45, avg: 58, level: 'B2', comp: 92 },
                { dept: 'Marketing', emps: 30, avg: 62, level: 'C1', comp: 87 },
                { dept: 'Engineering', emps: 68, avg: 52, level: 'B2', comp: 75 },
                { dept: 'Support', emps: 55, avg: 48, level: 'B1', comp: 94 },
                { dept: 'HR', emps: 15, avg: 65, level: 'C1', comp: 100 },
            ].map(d => `
                <tr>
                  <td style="padding:12px;border-bottom:1px solid var(--color-neutral-800);">${d.dept}</td>
                  <td style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-800);">${d.emps}</td>
                  <td style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-800);">${d.avg}</td>
                  <td style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-800);"><span class="badge badge--primary">${d.level}</span></td>
                  <td style="text-align:center;padding:12px;border-bottom:1px solid var(--color-neutral-800);"><div class="progress" style="width:80px;display:inline-block;"><div class="progress__bar" style="width:${d.comp}%;"></div></div> ${d.comp}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    }

    function renderPlacement() {
        return `
      <div class="card animate-fade-in-up">
        <div class="card__header">
          <div class="card__icon">🎓</div>
          <div>
            <div class="card__title">Placement Testing</div>
            <div class="card__subtitle">Student classification by Relative Numeric (RN) score</div>
          </div>
        </div>
        <div class="divider" style="margin:16px 0;"></div>
        
        <div class="grid grid-3 gap-4">
          ${[
                { group: 'Group A (Beginner)', range: 'RN 0-35', students: 28, levels: 'A1-A2', color: '#22c55e' },
                { group: 'Group B (Intermediate)', range: 'RN 36-55', students: 45, levels: 'B1-B2', color: '#0ea5e9' },
                { group: 'Group C (Advanced)', range: 'RN 56-100', students: 18, levels: 'C1-C2', color: '#a855f7' },
            ].map(g => `
            <div class="card card--flat" style="border-left:3px solid ${g.color};">
              <h4 style="margin-bottom:4px;">${g.group}</h4>
              <p class="text-xs text-secondary" style="margin-bottom:12px;">${g.range} · ${g.levels}</p>
              <div style="font-size:2rem;font-weight:700;font-family:var(--font-display);">${g.students}</div>
              <div class="text-xs text-tertiary">students</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }

    function renderItemBank() {
        return `
      <div class="card animate-fade-in-up">
        <div class="card__header">
          <div class="card__icon">🤖</div>
          <div>
            <div class="card__title">AI Item Generation (AIG) Pipeline</div>
            <div class="card__subtitle">Automated question creation and calibration status</div>
          </div>
        </div>
        <div class="divider" style="margin:16px 0;"></div>
        
        <div class="grid grid-3 gap-4" style="margin-bottom:24px;">
          ${[
                { label: 'Total Items', value: '847', icon: '📄' },
                { label: 'Calibrated', value: '623', icon: '✅' },
                { label: 'Pending Review', value: '124', icon: '👁️' },
            ].map(s => `
            <div class="card card--flat" style="text-align:center;">
              <span style="font-size:1.5rem;">${s.icon}</span>
              <div style="font-size:1.8rem;font-weight:700;font-family:var(--font-display);margin:8px 0;">${s.value}</div>
              <div class="text-xs text-secondary">${s.label}</div>
            </div>
          `).join('')}
        </div>
        
        <h4 style="margin-bottom:12px;">Generation Pipeline</h4>
        <div class="flex flex-col gap-3">
          ${[
                { step: '1. Few-Shot Prompting', desc: 'LLM generates items based on level/topic templates', status: 'active', pct: 100 },
                { step: '2. Synthetic Annotation', desc: 'Multi-model majority voting for answer validation', status: 'active', pct: 85 },
                { step: '3. Psychometric Calibration', desc: 'IRT parameter estimation from pilot tests', status: 'active', pct: 62 },
                { step: '4. Human-in-the-Loop', desc: 'Expert review for clarity and curriculum alignment', status: 'pending', pct: 35 },
            ].map(p => `
            <div style="padding:12px;background:var(--surface-glass);border-radius:var(--radius-lg);border:1px solid var(--surface-glass-border);">
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm" style="font-weight:600;">${p.step}</div>
                  <div class="text-xs text-secondary">${p.desc}</div>
                </div>
                <span class="badge ${p.status === 'active' ? 'badge--success' : 'badge--warning'}">${p.status}</span>
              </div>
              <div class="progress" style="margin-top:8px;">
                <div class="progress__bar" style="width:${p.pct}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }

    function renderSettings() {
        return `
      <div class="card animate-fade-in-up">
        <h4 style="margin-bottom:16px;">Test Configuration</h4>
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-sm text-secondary" style="display:block;margin-bottom:4px;">Quick Test — Max Items</label>
            <input type="number" class="input" value="15" style="max-width:200px;" />
          </div>
          <div>
            <label class="text-sm text-secondary" style="display:block;margin-bottom:4px;">SE Threshold (Stopping Rule)</label>
            <input type="number" class="input" value="0.32" step="0.01" style="max-width:200px;" />
          </div>
          <div>
            <label class="text-sm text-secondary" style="display:block;margin-bottom:4px;">Anti-Guessing Threshold</label>
            <input type="number" class="input" value="0.25" step="0.01" style="max-width:200px;" />
          </div>
          <div>
            <label class="text-sm text-secondary" style="display:block;margin-bottom:4px;">Default Starting Level</label>
            <select class="input select" style="max-width:200px;">
              <option>B1 (Intermediate)</option>
              <option>A2 (Elementary)</option>
              <option>B2 (Upper-Intermediate)</option>
            </select>
          </div>
          <button class="btn btn--primary" style="align-self:flex-start;">Save Settings</button>
        </div>
      </div>
    `;
    }

    render();
    return {};
}

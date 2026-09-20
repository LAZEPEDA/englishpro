// ========================================
// EnglishPro — Admin Panel (Full Dashboard)
// ========================================
import { logout, getSession, getSessionTimeRemaining, getLoginHistory, hasRole } from '../engine/auth.js';
import { navigate } from '../router.js';

export default function AdminPage(container) {
  const session = getSession();
  let activeTab = 'overview';

  // Simulated data store
  const store = {
    tests: JSON.parse(localStorage.getItem('ep_tests') || '[]'),
    links: JSON.parse(localStorage.getItem('ep_test_links') || '[]'),
  };

  function save() {
    localStorage.setItem('ep_tests', JSON.stringify(store.tests));
    localStorage.setItem('ep_test_links', JSON.stringify(store.links));
  }

  function render() {
    const tabs = [
      { id: 'overview', icon: '📊', label: 'Dashboard' },
      { id: 'test-links', icon: '🔗', label: 'Test Links' },
      { id: 'results-mgmt', icon: '📋', label: 'Results' },
      { id: 'corporate', icon: '🏢', label: 'Corporate' },
      { id: 'placement', icon: '🎓', label: 'Placement' },
      { id: 'item-bank', icon: '📦', label: 'Item Bank' },
      { id: 'security', icon: '🛡️', label: 'Security' },
      { id: 'settings', icon: '⚙️', label: 'Settings' },
    ];

    container.innerHTML = `
      <!-- Admin Navbar -->
      <nav class="navbar navbar--admin">
        <div class="navbar__inner">
          <div class="flex items-center gap-3">
            <a href="#/" class="navbar__brand">
              <div class="navbar__brand-icon">E</div>
              EnglishPro
            </a>
            <span class="badge badge--primary">Admin</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="admin-user-info">
              <span class="text-sm">${session?.name || 'Admin'}</span>
              <span class="text-xs text-tertiary">${session?.role || 'superadmin'}</span>
            </div>
            <div class="text-xs text-tertiary" title="Session expires in ${getSessionTimeRemaining()}">
              ⏱ ${getSessionTimeRemaining()}
            </div>
            <button class="btn btn--ghost btn--sm btn--danger" id="btn-logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
          <div class="sidebar-tabs">
            ${tabs.map(t => `
              <button class="sidebar-tab ${t.id === activeTab ? 'sidebar-tab--active' : ''}" data-tab="${t.id}">
                <span class="sidebar-tab__icon">${t.icon}</span>
                <span class="sidebar-tab__label">${t.label}</span>
              </button>
            `).join('')}
          </div>
        </aside>

        <!-- Main Content -->
        <main class="admin-main">
          <div class="admin-content animate-fade-in">
            ${renderTabContent()}
          </div>
        </main>
      </div>
    `;

    setupEvents();
  }

  function setupEvents() {
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      if (confirm('¿Cerrar sesión?')) {
        logout();
        navigate('/login');
      }
    });

    container.querySelectorAll('.sidebar-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        render();
      });
    });

    // Test link generation
    document.getElementById('btn-generate-link')?.addEventListener('click', generateTestLink);

    // Delete test link
    container.querySelectorAll('[data-delete-link]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.deleteLink);
        store.links.splice(idx, 1);
        save();
        render();
      });
    });

    // Copy link buttons
    container.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => {
          btn.textContent = '✓ Copied!';
          setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
        });
      });
    });

    // Export CSV
    document.getElementById('btn-export-csv')?.addEventListener('click', exportResultsCSV);
  }

  function renderTabContent() {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'test-links': return renderTestLinks();
      case 'results-mgmt': return renderResultsMgmt();
      case 'corporate': return renderCorporate();
      case 'placement': return renderPlacement();
      case 'item-bank': return renderItemBank();
      case 'security': return renderSecurity();
      case 'settings': return renderSettings();
      default: return '';
    }
  }

  // ========================
  // TAB: Dashboard Overview
  // ========================
  function renderOverview() {
    return `
      <div class="admin-header">
        <h2>📊 Dashboard</h2>
        <p class="text-secondary">Welcome back, ${session?.name}. Here's your overview.</p>
      </div>

      <div class="grid grid-4 gap-4">
        ${[
        { label: 'Total Tests', value: '12,847', change: '+23%', icon: '📝', color: '#6366f1' },
        { label: 'Active Users', value: '3,291', change: '+12%', icon: '👥', color: '#0ea5e9' },
        { label: 'Avg Score', value: '54.2', change: '+2.1', icon: '📊', color: '#22c55e' },
        { label: 'Certificates', value: '1,832', change: '+18%', icon: '📜', color: '#a855f7' },
      ].map(stat => `
          <div class="stat-card">
            <div class="stat-card__header">
              <span class="text-sm text-secondary">${stat.label}</span>
              <span class="stat-card__icon" style="background:${stat.color}20;color:${stat.color};">${stat.icon}</span>
            </div>
            <div class="stat-card__value">${stat.value}</div>
            <span class="badge badge--success">${stat.change} this month</span>
          </div>
        `).join('')}
      </div>

      <div class="grid grid-2 gap-6" style="margin-top:24px;">
        <div class="card">
          <h4 style="margin-bottom:16px;">📈 Level Distribution</h4>
          ${['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l, i) => {
        const pcts = [8, 15, 28, 25, 18, 6];
        const colors = ['#4ade80', '#22c55e', '#38bdf8', '#0ea5e9', '#a855f7', '#9333ea'];
        return `
              <div class="flex items-center gap-3" style="margin-bottom:10px;">
                <span class="text-sm" style="min-width:28px;font-weight:600;">${l}</span>
                <div class="progress" style="flex:1;">
                  <div class="progress__bar" style="width:${pcts[i]}%;background:${colors[i]};"></div>
                </div>
                <span class="text-xs text-secondary" style="min-width:35px;">${pcts[i]}%</span>
              </div>
            `;
      }).join('')}
        </div>
        <div class="card">
          <h4 style="margin-bottom:16px;">🕑 Recent Activity</h4>
          <div class="activity-list">
            ${[
        { user: 'Maria García', score: 62, level: 'C1', time: '2 min ago', type: 'full' },
        { user: 'Carlos Rodríguez', score: 45, level: 'B1', time: '5 min ago', type: 'quick' },
        { user: 'Ana López', score: 73, level: 'C2', time: '12 min ago', type: 'standard' },
        { user: 'Pedro Martínez', score: 38, level: 'A2', time: '18 min ago', type: 'quick' },
        { user: 'Sofía Benavides', score: 55, level: 'B2', time: '25 min ago', type: 'full' },
        { user: 'Diego Hernández', score: 67, level: 'C1', time: '32 min ago', type: 'standard' },
      ].map(a => `
              <div class="activity-item">
                <div class="activity-avatar">${a.user.charAt(0)}</div>
                <div style="flex:1;">
                  <div class="text-sm">${a.user}</div>
                  <div class="text-xs text-tertiary">${a.time} · ${a.type} test</div>
                </div>
                <div class="flex gap-2 items-center">
                  <span class="text-sm" style="font-weight:600;">${a.score} pts</span>
                  <span class="badge badge--primary" style="font-size:0.65rem;">${a.level}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:24px;">
        <h4 style="margin-bottom:16px;">📅 Monthly Summary</h4>
        <div class="grid grid-3 gap-4">
          ${[
        { label: 'Completion Rate', value: '87%', desc: 'Of started tests completed' },
        { label: 'Avg Duration', value: '24 min', desc: 'Across all test types' },
        { label: 'Return Rate', value: '34%', desc: 'Users who retake within 30 days' },
      ].map(m => `
            <div style="padding:16px;background:var(--surface-glass);border-radius:var(--radius-lg);border:1px solid var(--surface-glass-border);text-align:center;">
              <div style="font-size:1.8rem;font-weight:700;font-family:var(--font-display);color:var(--color-primary-400);">${m.value}</div>
              <div class="text-sm" style="font-weight:600;margin:4px 0;">${m.label}</div>
              <div class="text-xs text-tertiary">${m.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ========================
  // TAB: Test Links Generator
  // ========================
  function renderTestLinks() {
    return `
      <div class="admin-header">
        <h2>🔗 Test Link Generator</h2>
        <p class="text-secondary">Create shareable test links for candidates, classes, or corporate groups.</p>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <h4 style="margin-bottom:16px;">Create New Test Link</h4>
        <div class="grid grid-2 gap-4">
          <div>
            <label class="form-label">Link Name / Group</label>
            <input type="text" class="input" id="link-name" placeholder="e.g., Marketing Team Q3 2026" />
          </div>
          <div>
            <label class="form-label">Test Type</label>
            <select class="input select" id="link-type">
              <option value="quick">Quick Diagnostic (5-15 min)</option>
              <option value="standard">Receptive Standard (50 min)</option>
              <option value="full">Full 4-Skills (90-120 min)</option>
            </select>
          </div>
          <div>
            <label class="form-label">Max Uses</label>
            <input type="number" class="input" id="link-max" value="50" min="1" />
          </div>
          <div>
            <label class="form-label">Expiry Date</label>
            <input type="date" class="input" id="link-expiry" />
          </div>
        </div>
        <div style="margin-top:16px;">
          <label class="form-label">Options</label>
          <div class="flex gap-4 flex-wrap">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" id="link-require-name" checked /> Require candidate name
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" id="link-require-email" /> Require email
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" id="link-auto-cert" checked /> Auto-generate certificate
            </label>
          </div>
        </div>
        <button class="btn btn--primary" style="margin-top:16px;" id="btn-generate-link">
          🔗 Generate Link
        </button>
      </div>

      ${store.links.length > 0 ? `
        <div class="card">
          <h4 style="margin-bottom:16px;">📋 Active Test Links (${store.links.length})</h4>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Link</th>
                  <th>Uses</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${store.links.map((link, i) => `
                  <tr>
                    <td><strong>${link.name}</strong></td>
                    <td><span class="badge badge--primary">${link.type}</span></td>
                    <td>
                      <code class="text-xs" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;display:block;">${link.url}</code>
                    </td>
                    <td>${link.used}/${link.maxUses}</td>
                    <td class="text-sm">${link.expiry || 'Never'}</td>
                    <td>
                      <div class="flex gap-2">
                        <button class="btn btn--ghost btn--sm" data-copy="${link.url}">📋 Copy</button>
                        <button class="btn btn--ghost btn--sm btn--danger" data-delete-link="${i}">🗑️</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : `
        <div class="empty-state">
          <span style="font-size:3rem;">🔗</span>
          <h4>No test links yet</h4>
          <p class="text-secondary text-sm">Create your first test link above to share with candidates.</p>
        </div>
      `}
    `;
  }

  function generateTestLink() {
    const name = document.getElementById('link-name')?.value?.trim();
    const type = document.getElementById('link-type')?.value;
    const maxUses = parseInt(document.getElementById('link-max')?.value) || 50;
    const expiry = document.getElementById('link-expiry')?.value;

    if (!name) {
      alert('Please enter a link name');
      return;
    }

    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    const baseUrl = window.location.origin + window.location.pathname;

    store.links.push({
      name,
      type,
      code,
      url: `${baseUrl}#/exam-select?ref=${code}`,
      maxUses,
      used: 0,
      expiry: expiry || null,
      createdAt: new Date().toISOString(),
      requireName: document.getElementById('link-require-name')?.checked,
      requireEmail: document.getElementById('link-require-email')?.checked,
      autoCert: document.getElementById('link-auto-cert')?.checked,
    });

    save();
    render();
  }

  // ========================
  // TAB: Results Management
  // ========================
  function renderResultsMgmt() {
    const mockResults = [
      { id: 'EP-001', name: 'Maria García', email: 'maria@gmail.com', score: 62, level: 'C1', type: 'full', date: '2026-09-19', skills: { r: 65, l: 60, w: 58, s: 64 } },
      { id: 'EP-002', name: 'Carlos Rodríguez', email: 'carlos@hotmail.com', score: 45, level: 'B1', type: 'quick', date: '2026-09-19', skills: { r: 45, l: null, w: null, s: null } },
      { id: 'EP-003', name: 'Ana López', email: 'ana.l@empresa.com', score: 73, level: 'C2', type: 'standard', date: '2026-09-18', skills: { r: 75, l: 71, w: null, s: null } },
      { id: 'EP-004', name: 'Pedro Martínez', email: 'pedro.m@uni.edu', score: 38, level: 'A2', type: 'quick', date: '2026-09-18', skills: { r: 38, l: null, w: null, s: null } },
      { id: 'EP-005', name: 'Sofía Benavides', email: 'sofia.b@corp.co', score: 55, level: 'B2', type: 'full', date: '2026-09-17', skills: { r: 58, l: 54, w: 52, s: 56 } },
      { id: 'EP-006', name: 'Diego Hernández', email: 'diego@mail.com', score: 67, level: 'C1', type: 'standard', date: '2026-09-17', skills: { r: 70, l: 64, w: null, s: null } },
    ];

    return `
      <div class="admin-header">
        <div class="flex justify-between items-center">
          <div>
            <h2>📋 Test Results</h2>
            <p class="text-secondary">View, filter, and export all assessment results.</p>
          </div>
          <button class="btn btn--secondary" id="btn-export-csv">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="grid grid-4 gap-4">
          <div>
            <label class="form-label text-xs">Search</label>
            <input type="text" class="input" placeholder="Name or email..." style="font-size:0.85rem;" />
          </div>
          <div>
            <label class="form-label text-xs">Level</label>
            <select class="input select" style="font-size:0.85rem;">
              <option>All Levels</option>
              <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option>
            </select>
          </div>
          <div>
            <label class="form-label text-xs">Test Type</label>
            <select class="input select" style="font-size:0.85rem;">
              <option>All Types</option>
              <option>Quick</option><option>Standard</option><option>Full</option>
            </select>
          </div>
          <div>
            <label class="form-label text-xs">Date Range</label>
            <input type="date" class="input" style="font-size:0.85rem;" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Candidate</th>
                <th>Score</th>
                <th>Level</th>
                <th>R / L / W / S</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${mockResults.map(r => `
                <tr>
                  <td><code class="text-xs">${r.id}</code></td>
                  <td>
                    <div class="text-sm" style="font-weight:600;">${r.name}</div>
                    <div class="text-xs text-tertiary">${r.email}</div>
                  </td>
                  <td><strong>${r.score}</strong>/100</td>
                  <td><span class="badge badge--primary">${r.level}</span></td>
                  <td class="text-xs">
                    ${r.skills.r ?? '–'} / ${r.skills.l ?? '–'} / ${r.skills.w ?? '–'} / ${r.skills.s ?? '–'}
                  </td>
                  <td><span class="text-xs text-secondary">${r.type}</span></td>
                  <td class="text-xs">${r.date}</td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn--ghost btn--sm" title="View">👁️</button>
                      <button class="btn btn--ghost btn--sm" title="Certificate">📜</button>
                      <button class="btn btn--ghost btn--sm" title="Resend">📧</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="flex justify-between items-center" style="margin-top:16px;">
          <span class="text-xs text-tertiary">Showing 6 of 12,847 results</span>
          <div class="flex gap-2">
            <button class="btn btn--ghost btn--sm" disabled>← Previous</button>
            <button class="btn btn--ghost btn--sm">Next →</button>
          </div>
        </div>
      </div>
    `;
  }

  function exportResultsCSV() {
    const csv = 'ID,Name,Email,Score,Level,Type,Date\nEP-001,Maria García,maria@gmail.com,62,C1,full,2026-09-19\nEP-002,Carlos Rodríguez,carlos@hotmail.com,45,B1,quick,2026-09-19';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `englishpro_results_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ========================
  // TAB: Corporate
  // ========================
  function renderCorporate() {
    return `
      <div class="admin-header">
        <h2>🏢 Corporate Batch Testing</h2>
        <p class="text-secondary">Manage employee assessments and departmental reports.</p>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <div class="flex justify-between items-center" style="margin-bottom:16px;">
         <h4>Department Performance</h4>
         <button class="btn btn--secondary btn--sm">📥 Export Report</button>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
                <th>Tested</th>
                <th>Avg Score</th>
                <th>Avg Level</th>
                <th>Min Req.</th>
                <th>Compliance</th>
              </tr>
            </thead>
            <tbody>
              ${[
        { dept: 'Sales', emps: 45, tested: 42, avg: 58, level: 'B2', req: 'B1', comp: 95 },
        { dept: 'Marketing', emps: 30, tested: 26, avg: 62, level: 'C1', req: 'B2', comp: 88 },
        { dept: 'Engineering', emps: 68, tested: 51, avg: 52, level: 'B2', req: 'B1', comp: 75 },
        { dept: 'Customer Support', emps: 55, tested: 52, avg: 48, level: 'B1', req: 'B1', comp: 94 },
        { dept: 'HR', emps: 15, tested: 15, avg: 65, level: 'C1', req: 'B2', comp: 100 },
        { dept: 'Finance', emps: 22, tested: 18, avg: 44, level: 'B1', req: 'A2', comp: 100 },
      ].map(d => `
                <tr>
                  <td><strong>${d.dept}</strong></td>
                  <td>${d.emps}</td>
                  <td>${d.tested} <span class="text-xs text-tertiary">(${Math.round(d.tested / d.emps * 100)}%)</span></td>
                  <td>${d.avg}</td>
                  <td><span class="badge badge--primary">${d.level}</span></td>
                  <td><span class="badge badge--warning" style="font-size:0.6rem;">${d.req}+</span></td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="progress" style="width:60px;">
                        <div class="progress__bar" style="width:${d.comp}%;background:${d.comp >= 90 ? 'var(--color-success-400)' : d.comp >= 70 ? 'var(--color-warning-400)' : 'var(--color-danger-400)'};"></div>
                      </div>
                      <span class="text-xs">${d.comp}%</span>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h4 style="margin-bottom:16px;">🔗 Batch Test Assignment</h4>
        <p class="text-secondary text-sm" style="margin-bottom:16px;">Send test invitations to an entire department or custom group.</p>
        <div class="grid grid-3 gap-4">
          <div>
            <label class="form-label">Target Department</label>
            <select class="input select">
              <option>All Departments</option>
              <option>Sales</option><option>Marketing</option><option>Engineering</option>
              <option>Support</option><option>HR</option><option>Finance</option>
            </select>
          </div>
          <div>
            <label class="form-label">Test Type</label>
            <select class="input select">
              <option value="standard">Receptive Standard</option>
              <option value="full">Full 4-Skills</option>
              <option value="quick">Quick Diagnostic</option>
            </select>
          </div>
          <div>
            <label class="form-label">Deadline</label>
            <input type="date" class="input" />
          </div>
        </div>
        <button class="btn btn--primary" style="margin-top:16px;">📧 Send Invitations</button>
      </div>
    `;
  }

  // ========================
  // TAB: Placement
  // ========================
  function renderPlacement() {
    return `
      <div class="admin-header">
        <h2>🎓 Placement Testing</h2>
        <p class="text-secondary">Student classification and group assignment by proficiency level.</p>
      </div>

      <div class="grid grid-3 gap-4" style="margin-bottom:24px;">
        ${[
        { group: 'Group A — Beginner', range: 'Score 0-35', students: 28, levels: 'A1-A2', color: '#22c55e' },
        { group: 'Group B — Intermediate', range: 'Score 36-55', students: 45, levels: 'B1-B2', color: '#0ea5e9' },
        { group: 'Group C — Advanced', range: 'Score 56-100', students: 18, levels: 'C1-C2', color: '#a855f7' },
      ].map(g => `
          <div class="stat-card" style="border-left:3px solid ${g.color};">
            <h4 style="margin-bottom:4px;">${g.group}</h4>
            <p class="text-xs text-secondary" style="margin-bottom:12px;">${g.range} · ${g.levels}</p>
            <div style="font-size:2.5rem;font-weight:700;font-family:var(--font-display);color:${g.color};">${g.students}</div>
            <div class="text-xs text-tertiary">students assigned</div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <h4 style="margin-bottom:16px;">📥 Bulk Import Students</h4>
        <p class="text-secondary text-sm" style="margin-bottom:12px;">Upload a CSV file with student names and emails to create placement tests.</p>
        <div class="flex gap-4 items-center">
          <div style="flex:1;padding:24px;border:2px dashed var(--color-neutral-700);border-radius:var(--radius-lg);text-align:center;">
            <span style="font-size:2rem;">📄</span>
            <p class="text-sm text-secondary" style="margin-top:8px;">Drop CSV file here or click to browse</p>
            <p class="text-xs text-tertiary">Format: name, email, department</p>
          </div>
          <div>
            <button class="btn btn--secondary btn--sm">📥 Download Template</button>
          </div>
        </div>
      </div>
    `;
  }

  // ========================
  // TAB: Item Bank
  // ========================
  function renderItemBank() {
    return `
      <div class="admin-header">
        <h2>📦 Item Bank Manager</h2>
        <p class="text-secondary">Manage test questions, calibration status, and the AI generation pipeline.</p>
      </div>

      <div class="grid grid-4 gap-4" style="margin-bottom:24px;">
        ${[
        { label: 'Total Items', value: '847', icon: '📄', color: '#6366f1' },
        { label: 'Calibrated', value: '623', icon: '✅', color: '#22c55e' },
        { label: 'Pending Review', value: '124', icon: '👁️', color: '#f59e0b' },
        { label: 'Rejected', value: '100', icon: '❌', color: '#ef4444' },
      ].map(s => `
          <div class="stat-card">
            <div class="stat-card__header">
              <span class="text-sm text-secondary">${s.label}</span>
              <span class="stat-card__icon" style="background:${s.color}20;color:${s.color};">${s.icon}</span>
            </div>
            <div class="stat-card__value">${s.value}</div>
          </div>
        `).join('')}
      </div>

      <div class="grid grid-2 gap-6">
        <div class="card">
          <h4 style="margin-bottom:16px;">🤖 AIG Pipeline Status</h4>
          <div class="flex flex-col gap-3">
            ${[
        { step: '1. LLM Generation', desc: 'Few-shot prompting for item templates', status: '✅', pct: 100 },
        { step: '2. Multi-Model Validation', desc: 'Majority voting for answer checking', status: '✅', pct: 85 },
        { step: '3. IRT Calibration', desc: 'Parameter estimation from pilot tests', status: '🔄', pct: 62 },
        { step: '4. Expert Review', desc: 'Human-in-the-loop quality check', status: '⏳', pct: 35 },
      ].map(p => `
              <div style="padding:12px;background:var(--surface-glass);border-radius:var(--radius-lg);border:1px solid var(--surface-glass-border);">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="text-sm" style="font-weight:600;">${p.step}</div>
                    <div class="text-xs text-secondary">${p.desc}</div>
                  </div>
                  <span>${p.status}</span>
                </div>
                <div class="progress" style="margin-top:8px;">
                  <div class="progress__bar" style="width:${p.pct}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h4 style="margin-bottom:16px;">📊 Items by Skill & Level</h4>
          <div class="table-responsive">
            <table class="admin-table admin-table--compact">
              <thead>
                <tr><th></th><th>A1</th><th>A2</th><th>B1</th><th>B2</th><th>C1</th><th>C2</th></tr>
              </thead>
              <tbody>
                ${[
        { skill: 'Reading', counts: [32, 45, 68, 52, 38, 22] },
        { skill: 'Listening', counts: [18, 30, 42, 35, 25, 14] },
        { skill: 'Writing', counts: [8, 12, 15, 12, 10, 6] },
        { skill: 'Speaking', counts: [6, 10, 12, 10, 8, 5] },
        { skill: 'Grammar', counts: [22, 35, 55, 40, 28, 15] },
      ].map(s => `
                  <tr>
                    <td style="font-weight:600;">${s.skill}</td>
                    ${s.counts.map(c => `<td class="text-center">${c}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ========================
  // TAB: Security
  // ========================
  function renderSecurity() {
    const history = getLoginHistory();
    return `
      <div class="admin-header">
        <h2>🛡️ Security & Access</h2>
        <p class="text-secondary">Monitor login activity and manage access controls.</p>
      </div>

      <div class="grid grid-2 gap-6">
        <div class="card">
          <h4 style="margin-bottom:16px;">🔑 Current Session</h4>
          <div class="flex flex-col gap-3">
            <div class="flex justify-between"><span class="text-secondary text-sm">User</span><span class="text-sm" style="font-weight:600;">${session?.name}</span></div>
            <div class="flex justify-between"><span class="text-secondary text-sm">Role</span><span class="badge badge--primary">${session?.role}</span></div>
            <div class="flex justify-between"><span class="text-secondary text-sm">Login Time</span><span class="text-sm">${session?.loginTime ? new Date(session.loginTime).toLocaleString() : '–'}</span></div>
            <div class="flex justify-between"><span class="text-secondary text-sm">Expires In</span><span class="text-sm">${getSessionTimeRemaining()}</span></div>
            <div class="flex justify-between"><span class="text-secondary text-sm">Token</span><code class="text-xs">${session?.token?.slice(0, 16)}...</code></div>
          </div>
        </div>

        <div class="card">
          <h4 style="margin-bottom:16px;">👤 Admin Accounts</h4>
          <div class="flex flex-col gap-3">
            ${[
        { name: 'Administrator', role: 'superadmin', user: 'admin', status: 'active' },
        { name: 'Test Manager', role: 'manager', user: 'manager', status: 'active' },
      ].map(a => `
              <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--color-neutral-800);">
                <div>
                  <div class="text-sm" style="font-weight:600;">${a.name}</div>
                  <div class="text-xs text-tertiary">@${a.user} · ${a.role}</div>
                </div>
                <span class="badge badge--success">${a.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:24px;">
        <h4 style="margin-bottom:16px;">📜 Login History</h4>
        ${history.length > 0 ? `
          <div class="table-responsive">
            <table class="admin-table admin-table--compact">
              <thead>
                <tr><th>Username</th><th>Status</th><th>Timestamp</th></tr>
              </thead>
              <tbody>
                ${history.slice(0, 20).map(entry => `
                  <tr>
                    <td>${entry.username}</td>
                    <td>${entry.success ? '<span class="badge badge--success">✓ Success</span>' : '<span class="badge badge--danger">✗ Failed</span>'}</td>
                    <td class="text-xs">${new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="text-tertiary text-sm">No login history yet.</p>'}
      </div>
    `;
  }

  // ========================
  // TAB: Settings
  // ========================
  function renderSettings() {
    return `
      <div class="admin-header">
        <h2>⚙️ Platform Settings</h2>
        <p class="text-secondary">Configure test parameters, branding, and system behavior.</p>
      </div>

      <div class="grid grid-2 gap-6">
        <div class="card">
          <h4 style="margin-bottom:16px;">🎯 Test Engine Configuration</h4>
          <div class="flex flex-col gap-4">
            <div>
              <label class="form-label">Quick Test — Max Items</label>
              <input type="number" class="input" value="15" style="max-width:200px;" />
            </div>
            <div>
              <label class="form-label">Standard Error Threshold (Stopping Rule)</label>
              <input type="number" class="input" value="0.32" step="0.01" style="max-width:200px;" />
            </div>
            <div>
              <label class="form-label">Anti-Guessing Threshold</label>
              <input type="number" class="input" value="0.25" step="0.01" style="max-width:200px;" />
            </div>
            <div>
              <label class="form-label">Default Starting Level</label>
              <select class="input select" style="max-width:200px;">
                <option>B1 (Intermediate)</option>
                <option>A2 (Elementary)</option>
                <option>B2 (Upper-Intermediate)</option>
              </select>
            </div>
            <button class="btn btn--primary" style="align-self:flex-start;">💾 Save Engine Config</button>
          </div>
        </div>

        <div class="card">
          <h4 style="margin-bottom:16px;">🎨 Branding & Appearance</h4>
          <div class="flex flex-col gap-4">
            <div>
              <label class="form-label">Platform Name</label>
              <input type="text" class="input" value="EnglishPro" style="max-width:300px;" />
            </div>
            <div>
              <label class="form-label">Primary Color</label>
              <input type="color" class="input" value="#6366f1" style="max-width:100px;height:40px;" />
            </div>
            <div>
              <label class="form-label">Certificate Template</label>
              <select class="input select" style="max-width:300px;">
                <option>Default — Dark Professional</option>
                <option>Corporate — Minimal</option>
                <option>Academic — Classic</option>
              </select>
            </div>
            <div>
              <label class="form-label">Company Logo URL</label>
              <input type="url" class="input" placeholder="https://..." style="max-width:300px;" />
            </div>
            <button class="btn btn--primary" style="align-self:flex-start;">💾 Save Branding</button>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:24px;">
        <h4 style="margin-bottom:16px;">🔔 Notifications & Integrations</h4>
        <div class="flex flex-col gap-3">
          ${[
        { label: 'Email results to candidates', key: 'email_results', checked: true },
        { label: 'Send certificates automatically', key: 'auto_cert', checked: true },
        { label: 'Notify admin on test completion', key: 'notify_admin', checked: false },
        { label: 'Enable webhook integration', key: 'webhook', checked: false },
        { label: 'Allow retakes within 24h', key: 'retakes', checked: true },
      ].map(n => `
            <label class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--color-neutral-800);">
              <span class="text-sm">${n.label}</span>
              <div class="toggle-switch">
                <input type="checkbox" ${n.checked ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  render();
  return {};
}

/**
 * ZAYATHON 2026 - Admin Portal & Analytics Controller
 * Handles organizer authentication, live student login tracking, team registry, and CSV export.
 */

// Default Seed Data if fresh start
const SEED_REGISTRATIONS = [
  {
    ticketId: "ZAYA-748912",
    teamName: "CyberPulse",
    leaderName: "Aarav Sharma",
    leaderEmail: "aarav.sharma@sonatech.ac.in",
    leaderPhone: "+91 98451 23410",
    college: "Sona College of Technology, Salem",
    yearOfStudy: "3rd Year",
    teamSize: "4",
    track: "Artificial Intelligence & Agentic AI",
    projectTitle: "Autonomous Multi-Agent Emergency Dispatcher",
    ideaSummary: "An autonomous swarm agent system that coordinates emergency medical response in rural districts using edge AI.",
    status: "Verified",
    registeredAt: "2026-03-01T10:15:00.000Z",
    loginsCount: 6,
    lastLogin: "2026-03-09T18:30:00.000Z"
  },
  {
    ticketId: "ZAYA-512039",
    teamName: "ZeroKnowledge",
    leaderName: "Priya Varma",
    leaderEmail: "priya.varma@annauniv.edu",
    leaderPhone: "+91 97123 45678",
    college: "College of Engineering, Guindy (CEG)",
    yearOfStudy: "3rd Year",
    teamSize: "3",
    track: "Web3, Blockchain & DeFi Solutions",
    projectTitle: "ZK-Rollup Academic Credential Registry",
    ideaSummary: "Tamper-proof on-chain verification for university degrees using zero-knowledge proofs.",
    status: "Verified",
    registeredAt: "2026-03-02T14:22:00.000Z",
    loginsCount: 4,
    lastLogin: "2026-03-09T19:45:00.000Z"
  },
  {
    ticketId: "ZAYA-893411",
    teamName: "QuantumShield",
    leaderName: "Karthik Rajan",
    leaderEmail: "karthik.r@psgtech.ac.in",
    leaderPhone: "+91 94432 10987",
    college: "PSG College of Technology, Coimbatore",
    yearOfStudy: "2nd Year",
    teamSize: "4",
    track: "Cybersecurity & Zero Trust Architecture",
    projectTitle: "Real-Time Cloud Microsegmentation Sentinel",
    ideaSummary: "Zero-trust automated policy enforcement engine using eBPF kernel telemetry.",
    status: "Verified",
    registeredAt: "2026-03-03T09:40:00.000Z",
    loginsCount: 8,
    lastLogin: "2026-03-09T21:10:00.000Z"
  },
  {
    ticketId: "ZAYA-662104",
    teamName: "MediBotics",
    leaderName: "Sneha Mukherjee",
    leaderEmail: "sneha.m@nitt.edu",
    leaderPhone: "+91 98840 55123",
    college: "National Institute of Technology (NIT), Trichy",
    yearOfStudy: "2nd Year",
    teamSize: "4",
    track: "Healthcare & MedTech AI Innovations",
    projectTitle: "Edge AI Diabetic Retinopathy Scanner",
    ideaSummary: "Low-cost smartphone attachment for retinal screening powered by quantized vision models.",
    status: "Verified",
    registeredAt: "2026-03-04T16:05:00.000Z",
    loginsCount: 3,
    lastLogin: "2026-03-09T17:20:00.000Z"
  },
  {
    ticketId: "ZAYA-403918",
    teamName: "FinMatrix",
    leaderName: "Rohan Nair",
    leaderEmail: "rohan.nair@vit.ac.in",
    leaderPhone: "+91 96541 23098",
    college: "Vellore Institute of Technology (VIT)",
    yearOfStudy: "1st Year",
    teamSize: "2",
    track: "FinTech & Algorithmic Trading Systems",
    projectTitle: "Sub-Millisecond Arbitrage Engine for DEXs",
    ideaSummary: "Decentralized liquidity routing algorithm with predictive slippage dampening.",
    status: "Pending Review",
    registeredAt: "2026-03-05T11:50:00.000Z",
    loginsCount: 2,
    lastLogin: "2026-03-08T14:10:00.000Z"
  },
  {
    ticketId: "ZAYA-918234",
    teamName: "EcoGrid",
    leaderName: "Divya Krishnan",
    leaderEmail: "divya.k@citchennai.net",
    leaderPhone: "+91 95001 88765",
    college: "Chennai Institute of Technology",
    yearOfStudy: "3rd Year",
    teamSize: "4",
    track: "Clean Energy, Climate & Sustainability",
    projectTitle: "Peer-to-Peer Solar Microgrid Balancer",
    ideaSummary: "Dynamic energy bidding network for residential solar panels with demand forecasting.",
    status: "Verified",
    registeredAt: "2026-03-06T13:30:00.000Z",
    loginsCount: 5,
    lastLogin: "2026-03-09T20:05:00.000Z"
  }
];

const SEED_LOGINS = [
  {
    studentName: "Karthik Rajan",
    teamName: "QuantumShield",
    ticketId: "ZAYA-893411",
    track: "Cybersecurity & Zero Trust",
    college: "PSG College of Tech",
    timestamp: "2026-03-09T21:10:00.000Z",
    device: "Desktop Chrome (Windows)"
  },
  {
    studentName: "Divya Krishnan",
    teamName: "EcoGrid",
    ticketId: "ZAYA-918234",
    track: "Clean Energy & Climate",
    college: "Chennai Inst of Tech",
    timestamp: "2026-03-09T20:05:00.000Z",
    device: "Mobile Safari (iOS)"
  },
  {
    studentName: "Priya Varma",
    teamName: "ZeroKnowledge",
    ticketId: "ZAYA-512039",
    track: "Web3 & Blockchain",
    college: "CEG Anna University",
    timestamp: "2026-03-09T19:45:00.000Z",
    device: "Desktop Firefox (macOS)"
  },
  {
    studentName: "Aarav Sharma",
    teamName: "CyberPulse",
    ticketId: "ZAYA-748912",
    track: "Artificial Intelligence",
    college: "Sona College of Tech",
    timestamp: "2026-03-09T18:30:00.000Z",
    device: "Desktop Chrome (Linux)"
  },
  {
    studentName: "Sneha Mukherjee",
    teamName: "MediBotics",
    ticketId: "ZAYA-662104",
    track: "Healthcare & MedTech",
    college: "NIT Trichy",
    timestamp: "2026-03-09T17:20:00.000Z",
    device: "Mobile Chrome (Android)"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuth();
  initDashboard();
});

// 1. Theme Management (Sync with main website)
function initTheme() {
  const savedMode = localStorage.getItem('zayathon_mode') || 'dark';
  const savedTheme = localStorage.getItem('zayathon_theme') || 'cyan';
  document.documentElement.setAttribute('data-mode', savedMode);
  document.documentElement.setAttribute('data-theme', savedTheme);

  const modeBtn = document.getElementById('admin-mode-btn');
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-mode') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-mode', next);
      localStorage.setItem('zayathon_mode', next);
    });
  }
}

// 2. Organizer Authentication
function initAuth() {
  const authScreen = document.getElementById('admin-auth-screen');
  const dashboard = document.getElementById('admin-dashboard');
  const authForm = document.getElementById('admin-auth-form');
  const passcodeInput = document.getElementById('admin-passcode');
  const authError = document.getElementById('admin-auth-error');
  const logoutBtn = document.getElementById('admin-logout-btn');

  const isAuthenticated = sessionStorage.getItem('zayathon_admin_logged') === 'true';

  if (isAuthenticated) {
    if (authScreen) authScreen.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
  } else {
    if (authScreen) authScreen.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = passcodeInput.value.trim();
      if (code === 'Bijay@08' || code === 'zaya2026' || code === 'admin2026' || code === 'admin' || code === 'zayacodehub') {
        sessionStorage.setItem('zayathon_admin_logged', 'true');
        authScreen.style.display = 'none';
        dashboard.style.display = 'block';
        loadAllData();
      } else {
        if (authError) authError.style.display = 'block';
        passcodeInput.classList.add('error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('zayathon_admin_logged');
      window.location.reload();
    });
  }
}

// 3. Storage Helpers
function getRegistrations() {
  const raw = localStorage.getItem('zayathon_registrations');
  if (!raw) {
    localStorage.setItem('zayathon_registrations', JSON.stringify(SEED_REGISTRATIONS));
    return SEED_REGISTRATIONS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return SEED_REGISTRATIONS;
  }
}

function getLogins() {
  const raw = localStorage.getItem('zayathon_logins');
  if (!raw) {
    localStorage.setItem('zayathon_logins', JSON.stringify(SEED_LOGINS));
    return SEED_LOGINS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return SEED_LOGINS;
  }
}

// 4. Main Dashboard Data Loader
function initDashboard() {
  loadAllData();

  // Search and filter listeners
  const searchInput = document.getElementById('table-search-input');
  const trackFilter = document.getElementById('table-track-filter');
  const statusFilter = document.getElementById('table-status-filter');

  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (trackFilter) trackFilter.addEventListener('change', renderTable);
  if (statusFilter) statusFilter.addEventListener('change', renderTable);

  // Export CSV button
  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToCSV);
  }

  // Seed / Reset data button
  const resetBtn = document.getElementById('btn-reset-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset to standard demo registry dataset?')) {
        localStorage.setItem('zayathon_registrations', JSON.stringify(SEED_REGISTRATIONS));
        localStorage.setItem('zayathon_logins', JSON.stringify(SEED_LOGINS));
        loadAllData();
      }
    });
  }

  // Auto-refresh stats every 8 seconds for live feel
  setInterval(() => {
    updateMetricCards();
    renderLoginFeed();
  }, 8000);
}

function loadAllData() {
  updateMetricCards();
  renderTrackBreakdown();
  renderLoginFeed();
  renderTable();
}

// 5. Update Metrics
function updateMetricCards() {
  const registrations = getRegistrations();
  const logins = getLogins();

  // Total Logins count
  const totalLogins = logins.length + registrations.reduce((acc, r) => acc + (r.loginsCount || 1), 0);
  const totalTeams = registrations.length;
  const totalStudents = registrations.reduce((acc, r) => acc + (parseInt(r.teamSize, 10) || 3), 0);
  
  const tracksSet = new Set(registrations.map(r => r.track).filter(Boolean));
  const activeTracksCount = tracksSet.size;

  const loginsEl = document.getElementById('stat-total-logins');
  const teamsEl = document.getElementById('stat-total-teams');
  const studentsEl = document.getElementById('stat-total-students');
  const tracksEl = document.getElementById('stat-active-tracks');

  if (loginsEl) loginsEl.textContent = totalLogins.toLocaleString();
  if (teamsEl) teamsEl.textContent = totalTeams.toLocaleString();
  if (studentsEl) studentsEl.textContent = totalStudents.toLocaleString();
  if (tracksEl) tracksEl.textContent = activeTracksCount;
}

// 6. Render Track Breakdown Bars
function renderTrackBreakdown() {
  const container = document.getElementById('track-bars-container');
  if (!container) return;

  const registrations = getRegistrations();
  const trackCounts = {};

  registrations.forEach(r => {
    const t = r.track || 'General Innovation';
    trackCounts[t] = (trackCounts[t] || 0) + 1;
  });

  const total = registrations.length || 1;
  const sortedTracks = Object.entries(trackCounts).sort((a, b) => b[1] - a[1]);

  container.innerHTML = sortedTracks.map(([track, count]) => {
    const percent = Math.round((count / total) * 100);
    return `
      <div class="track-bar-item">
        <div class="track-bar-label">
          <span>${track}</span>
          <strong>${count} Teams (${percent}%)</strong>
        </div>
        <div class="track-bar-track">
          <div class="track-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// 7. Render Student Login Live Feed
function renderLoginFeed() {
  const container = document.getElementById('login-feed-container');
  if (!container) return;

  const logins = getLogins();
  if (logins.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; padding:1rem 0;">No recent logins recorded.</div>`;
    return;
  }

  container.innerHTML = logins.slice(0, 8).map(l => {
    const date = new Date(l.timestamp || Date.now());
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="login-feed-item">
        <div class="login-student-info">
          <span class="login-student-name">${l.studentName} (${l.teamName})</span>
          <span class="login-student-meta">${l.college} • ${l.ticketId}</span>
        </div>
        <div class="login-time-badge">${timeStr}</div>
      </div>
    `;
  }).join('');
}

// 8. Render Filterable Registry Table
function renderTable() {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;

  const registrations = getRegistrations();
  const searchVal = (document.getElementById('table-search-input')?.value || '').toLowerCase().trim();
  const trackVal = document.getElementById('table-track-filter')?.value || 'all';
  const statusVal = document.getElementById('table-status-filter')?.value || 'all';

  const filtered = registrations.filter(r => {
    const matchesSearch = !searchVal || 
      (r.teamName && r.teamName.toLowerCase().includes(searchVal)) ||
      (r.leaderName && r.leaderName.toLowerCase().includes(searchVal)) ||
      (r.leaderEmail && r.leaderEmail.toLowerCase().includes(searchVal)) ||
      (r.college && r.college.toLowerCase().includes(searchVal)) ||
      (r.ticketId && r.ticketId.toLowerCase().includes(searchVal)) ||
      (r.track && r.track.toLowerCase().includes(searchVal));

    const matchesTrack = trackVal === 'all' || r.track === trackVal;
    const matchesStatus = statusVal === 'all' || r.status === statusVal;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="table-empty-state">
          No registered teams match the selected filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    const statusClass = r.status === 'Verified' ? 'verified' : 'pending';
    const loginCount = r.loginsCount || 1;
    const lastLogin = r.lastLogin ? new Date(r.lastLogin).toLocaleDateString() : 'Active';

    return `
      <tr>
        <td><span class="table-team-id">${r.ticketId}</span></td>
        <td>
          <div style="font-weight:700; color:var(--text-primary);">${r.teamName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${r.projectTitle || 'N/A'}</div>
        </td>
        <td>
          <div style="color:var(--text-primary);">${r.leaderName}</div>
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${r.leaderEmail}</div>
        </td>
        <td><span title="${r.college}">${truncate(r.college, 26)}</span></td>
        <td><span title="${r.track}">${truncate(r.track, 24)}</span></td>
        <td><strong>${r.teamSize || 3} Members</strong></td>
        <td>
          <span style="font-family:var(--font-mono); font-weight:700; color:var(--primary);">${loginCount} Logins</span>
          <div style="font-size:0.7rem; color:var(--text-muted);">${lastLogin}</div>
        </td>
        <td>
          <span class="table-status-badge ${statusClass}">${r.status}</span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button type="button" class="table-btn-action" onclick="viewTeamModal('${r.ticketId}')" title="View Full Details">View</button>
            <button type="button" class="table-btn-action" onclick="toggleStatus('${r.ticketId}')" title="Toggle Verification">Toggle</button>
            <button type="button" class="table-btn-action table-btn-danger" onclick="deleteTeam('${r.ticketId}')" title="Delete Team">✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

// 9. Actions (View, Toggle, Delete)
window.viewTeamModal = function(ticketId) {
  const registrations = getRegistrations();
  const team = registrations.find(r => r.ticketId === ticketId);
  if (!team) return;

  const modal = document.getElementById('admin-team-modal');
  const detailsEl = document.getElementById('admin-team-modal-details');
  if (!modal || !detailsEl) return;

  detailsEl.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.25rem; margin-bottom:1.5rem;">
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Registration ID</div>
        <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:800; color:var(--primary);">${team.ticketId}</div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Team Name</div>
        <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary);">${team.teamName}</div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Team Leader</div>
        <div style="color:var(--text-primary);">${team.leaderName} (${team.yearOfStudy || 'Undergraduate'})</div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Leader Contact</div>
        <div style="font-family:var(--font-mono); font-size:0.85rem; color:var(--text-primary);">${team.leaderEmail} | ${team.leaderPhone}</div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">College / University</div>
        <div style="color:var(--text-primary);">${team.college}</div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Allocated Track</div>
        <div style="color:var(--primary); font-weight:600;">${team.track}</div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Team Size</div>
        <div style="color:var(--text-primary); font-weight:700;">${team.teamSize} Members</div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Student Logins Recorded</div>
        <div style="font-family:var(--font-mono); color:#00ff88; font-weight:700;">${team.loginsCount || 1} Sessions</div>
      </div>
    </div>

    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); padding:1rem; border-radius:8px; margin-bottom:1.25rem;">
      <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">Project Title: ${team.projectTitle || 'N/A'}</div>
      <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${team.ideaSummary || 'No abstract provided.'}</div>
    </div>
  `;

  modal.classList.add('open');
};

window.closeAdminModal = function() {
  const modal = document.getElementById('admin-team-modal');
  if (modal) modal.classList.remove('open');
};

window.toggleStatus = function(ticketId) {
  const registrations = getRegistrations();
  const index = registrations.findIndex(r => r.ticketId === ticketId);
  if (index !== -1) {
    registrations[index].status = registrations[index].status === 'Verified' ? 'Pending Review' : 'Verified';
    localStorage.setItem('zayathon_registrations', JSON.stringify(registrations));
    renderTable();
  }
};

window.deleteTeam = function(ticketId) {
  if (confirm(`Are you sure you want to delete registration ${ticketId}?`)) {
    let registrations = getRegistrations();
    registrations = registrations.filter(r => r.ticketId !== ticketId);
    localStorage.setItem('zayathon_registrations', JSON.stringify(registrations));
    loadAllData();
  }
};

// 10. Export Registry to CSV (Excel format)
function exportToCSV() {
  const registrations = getRegistrations();
  if (registrations.length === 0) {
    alert('No registrations available to export.');
    return;
  }

  const headers = ['Registration Code', 'Team Name', 'Team Leader', 'Leader Email', 'Leader Phone', 'College', 'Year of Study', 'Team Size', 'Track', 'Project Title', 'Logins Count', 'Status', 'Registered Date'];
  
  const rows = registrations.map(r => [
    `"${r.ticketId || ''}"`,
    `"${(r.teamName || '').replace(/"/g, '""')}"`,
    `"${(r.leaderName || '').replace(/"/g, '""')}"`,
    `"${r.leaderEmail || ''}"`,
    `"${r.leaderPhone || ''}"`,
    `"${(r.college || '').replace(/"/g, '""')}"`,
    `"${r.yearOfStudy || ''}"`,
    `"${r.teamSize || 3}"`,
    `"${(r.track || '').replace(/"/g, '""')}"`,
    `"${(r.projectTitle || '').replace(/"/g, '""')}"`,
    `"${r.loginsCount || 1}"`,
    `"${r.status || 'Verified'}"`,
    `"${r.registeredAt || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ZAYATHON_2026_Student_Registry_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

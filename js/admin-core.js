/**
 * ZAYATHON 2026 - Master Enterprise Admin Controller
 * Compatible with both file:/// protocol and http:// / https:// localhost
 * Connected to Firebase Auth, Cloud Firestore ('participants', 'teams', 'admins', 'verification_history', 'admin_notes')
 */

// Initial Seed Dataset for Participants & Teams (Fallback & initial view)
const INITIAL_PARTICIPANTS = [
  {
    id: "ZP-2026-0101",
    name: "Aarav Sharma",
    email: "aarav.sharma@sonatech.ac.in",
    phone: "+91 98451 23410",
    college: "Sona College of Technology, Salem",
    department: "Computer Science & Engineering",
    degree: "B.E. CSE",
    year: "3rd Year (6th Sem)",
    teamId: "ZT-2026-01",
    teamName: "CyberPulse",
    role: "Team Leader",
    track: "Artificial Intelligence & Agentic AI",
    projectTitle: "Autonomous Multi-Agent Emergency Dispatcher",
    projectAbstract: "An autonomous swarm agent system that coordinates emergency medical response in rural districts using edge AI and real-time mesh routing.",
    regDate: "2026-03-01 10:15 AM",
    status: "Verified",
    verifiedBy: "Super Admin (ZAYA CODE HUB)",
    verifiedAt: "2026-03-02 11:30 AM",
    rejectionReason: "",
    documents: [
      { name: "Sona_College_ID_Aarav.pdf", type: "College ID Card", size: "1.4 MB" },
      { name: "Bonafide_Certificate_2026.pdf", type: "Bonafide Certificate", size: "850 KB" }
    ],
    checklist: [true, true, true, true, true],
    notes: [
      { author: "Admin (ZAYA CODE HUB)", time: "2026-03-02 11:28 AM", text: "College ID and bonafide enrollment verified directly with Sona College coordinator." }
    ],
    history: [
      { action: "Registration Submitted", admin: "System", time: "2026-03-01 10:15 AM", meta: "Team CyberPulse registered for AI Track." },
      { action: "Checklist Completed", admin: "Super Admin", time: "2026-03-02 11:29 AM", meta: "5/5 verification criteria passed." },
      { action: "Participant Verified", admin: "Super Admin (ZAYA CODE HUB)", time: "2026-03-02 11:30 AM", meta: "Official admit pass issued." }
    ]
  },
  {
    id: "ZP-2026-0102",
    name: "Kavya Ramesh",
    email: "kavya.ramesh@sonatech.ac.in",
    phone: "+91 98451 23411",
    college: "Sona College of Technology, Salem",
    department: "Artificial Intelligence & Data Science",
    degree: "B.Tech AI&DS",
    year: "3rd Year (6th Sem)",
    teamId: "ZT-2026-01",
    teamName: "CyberPulse",
    role: "Team Member",
    track: "Artificial Intelligence & Agentic AI",
    projectTitle: "Autonomous Multi-Agent Emergency Dispatcher",
    projectAbstract: "Edge AI quantization and sensor telemetry processor for emergency responder vehicle fleets.",
    regDate: "2026-03-01 10:20 AM",
    status: "Verified",
    verifiedBy: "Super Admin (ZAYA CODE HUB)",
    verifiedAt: "2026-03-02 11:32 AM",
    rejectionReason: "",
    documents: [
      { name: "Sona_College_ID_Kavya.pdf", type: "College ID Card", size: "1.1 MB" }
    ],
    checklist: [true, true, true, true, true],
    notes: [],
    history: [
      { action: "Registration Submitted", admin: "System", time: "2026-03-01 10:20 AM", meta: "Joined Team CyberPulse." },
      { action: "Participant Verified", admin: "Super Admin (ZAYA CODE HUB)", time: "2026-03-02 11:32 AM", meta: "Verified alongside team leader." }
    ]
  },
  {
    id: "ZP-2026-0201",
    name: "Priya Varma",
    email: "priya.varma@annauniv.edu",
    phone: "+91 97123 45678",
    college: "College of Engineering, Guindy (Anna University)",
    department: "Information Technology",
    degree: "B.Tech IT",
    year: "3rd Year (5th Sem)",
    teamId: "ZT-2026-02",
    teamName: "ZeroKnowledge",
    role: "Team Leader",
    track: "Web3, Blockchain & DeFi Solutions",
    projectTitle: "ZK-Rollup Academic Credential Registry",
    projectAbstract: "Tamper-proof on-chain verification for university transcripts and degrees using zero-knowledge proofs and smart contracts.",
    regDate: "2026-03-02 02:45 PM",
    status: "Pending",
    verifiedBy: "",
    verifiedAt: "",
    rejectionReason: "",
    documents: [
      { name: "CEG_Student_SmartCard.pdf", type: "College ID Card", size: "2.1 MB" }
    ],
    checklist: [true, true, true, false, false],
    notes: [
      { author: "Admin (ZAYA)", time: "2026-03-03 04:00 PM", text: "Pending verification of project abstract compliance with DeFi track rules." }
    ],
    history: [
      { action: "Registration Submitted", admin: "System", time: "2026-03-02 02:45 PM", meta: "Registered under Web3 track." }
    ]
  },
  {
    id: "ZP-2026-0202",
    name: "Vikas Raman",
    email: "vikas.raman@annauniv.edu",
    phone: "+91 97123 45679",
    college: "College of Engineering, Guindy (Anna University)",
    department: "Computer Science & Engineering",
    degree: "B.E. CSE",
    year: "3rd Year (5th Sem)",
    teamId: "ZT-2026-02",
    teamName: "ZeroKnowledge",
    role: "Team Member",
    track: "Web3, Blockchain & DeFi Solutions",
    projectTitle: "ZK-Rollup Academic Credential Registry",
    projectAbstract: "Smart contract implementation on Ethereum Layer 2 with Circom zero-knowledge circuits.",
    regDate: "2026-03-02 02:50 PM",
    status: "Pending",
    verifiedBy: "",
    verifiedAt: "",
    rejectionReason: "",
    documents: [
      { name: "CEG_ID_Vikas.pdf", type: "College ID Card", size: "1.8 MB" }
    ],
    checklist: [true, true, false, false, false],
    notes: [],
    history: [
      { action: "Registration Submitted", admin: "System", time: "2026-03-02 02:50 PM", meta: "Joined Team ZeroKnowledge." }
    ]
  },
  {
    id: "ZP-2026-0301",
    name: "Karthik Rajan",
    email: "karthik.r@psgtech.ac.in",
    phone: "+91 94432 10987",
    college: "PSG College of Technology, Coimbatore",
    department: "Electronics & Communication Engineering",
    degree: "B.E. ECE",
    year: "2nd Year (4th Sem)",
    teamId: "ZT-2026-03",
    teamName: "QuantumShield",
    role: "Team Leader",
    track: "Cybersecurity & Zero Trust Architecture",
    projectTitle: "Real-Time Cloud Microsegmentation Sentinel",
    projectAbstract: "Zero-trust automated policy enforcement engine using eBPF kernel telemetry to prevent lateral movement in cloud-native workloads.",
    regDate: "2026-03-03 09:40 AM",
    status: "Verified",
    verifiedBy: "Lead Validator - ZAYA CODE HUB",
    verifiedAt: "2026-03-04 10:15 AM",
    rejectionReason: "",
    documents: [
      { name: "PSG_Tech_Identity_Card.pdf", type: "College ID Card", size: "950 KB" },
      { name: "Project_Architecture_Doc.pdf", type: "Project Synopsis", size: "3.2 MB" }
    ],
    checklist: [true, true, true, true, true],
    notes: [],
    history: [
      { action: "Registration Submitted", admin: "System", time: "2026-03-03 09:40 AM", meta: "Team QuantumShield registered." },
      { action: "Participant Verified", admin: "Lead Validator - ZAYA", time: "2026-03-04 10:15 AM", meta: "Approved for onsite 48-hour finale." }
    ]
  },
  {
    id: "ZP-2026-0401",
    name: "Rohan Nair",
    email: "rohan.nair@vit.ac.in",
    phone: "+91 96541 23098",
    college: "Vellore Institute of Technology (VIT)",
    department: "Computer Science & Engineering",
    degree: "B.Tech CSE",
    year: "4th Year (8th Sem)",
    teamId: "ZT-2026-04",
    teamName: "FinMatrix",
    role: "Team Leader",
    track: "FinTech & Algorithmic Trading Systems",
    projectTitle: "Sub-Millisecond Arbitrage Engine for DEXs",
    projectAbstract: "Decentralized liquidity routing algorithm with predictive slippage dampening.",
    regDate: "2026-03-04 11:10 AM",
    status: "Rejected",
    verifiedBy: "Compliance Team (ZAYA CODE HUB)",
    verifiedAt: "2026-03-05 03:20 PM",
    rejectionReason: "Ineligible Year of Study (4th Year / Final Year)",
    documents: [
      { name: "VIT_Registration_Card.pdf", type: "College ID Card", size: "1.2 MB" }
    ],
    checklist: [true, true, true, true, false],
    notes: [
      { author: "Compliance Team", time: "2026-03-05 03:18 PM", text: "Applicant is currently in 4th Year. Official rules state eligibility is restricted to 1st, 2nd, and 3rd year undergraduate students only." }
    ],
    history: [
      { action: "Registration Submitted", admin: "System", time: "2026-03-04 11:10 AM", meta: "Registered under FinTech Track." },
      { action: "Participant Rejected", admin: "Compliance Team", time: "2026-03-05 03:20 PM", meta: "Reason: Ineligible Year of Study (4th Year)." }
    ]
  },
  {
    id: "ZP-2026-0501",
    name: "Sneha Mukherjee",
    email: "sneha.m@nitt.edu",
    phone: "+91 98840 55123",
    college: "National Institute of Technology (NIT), Trichy",
    department: "Bio-Medical Engineering",
    degree: "B.Tech BioTech",
    year: "2nd Year (3rd Sem)",
    teamId: "ZT-2026-05",
    teamName: "MediBotics",
    role: "Team Leader",
    track: "Healthcare & MedTech AI Innovations",
    projectTitle: "Edge AI Diabetic Retinopathy Scanner",
    projectAbstract: "Low-cost portable smartphone attachment for retinal screening powered by quantized vision models for rural clinics.",
    regDate: "2026-03-05 04:15 PM",
    status: "Pending",
    verifiedBy: "",
    verifiedAt: "",
    rejectionReason: "",
    documents: [
      { name: "NIT_Trichy_SmartID.pdf", type: "College ID Card", size: "1.6 MB" }
    ],
    checklist: [true, true, true, false, false],
    notes: [],
    history: [
      { action: "Registration Submitted", admin: "System", time: "2026-03-05 04:15 PM", meta: "Team MediBotics registered." }
    ]
  }
];

// Current logged admin details
let CURRENT_ADMIN = {
  uid: "ADM-ZAYA-01",
  name: "ZAYA CODE HUB Admin",
  role: "super_admin",
  email: "admin@zayacodehub.com"
};

// In-memory cache of participants
let cachedParticipants = [];

// --------------------------------------------------------------------------
// 1. Core State & Data Store Initialization
// --------------------------------------------------------------------------
class AdminStore {
  static getParticipants() {
    if (cachedParticipants && cachedParticipants.length > 0) {
      return cachedParticipants;
    }
    const data = localStorage.getItem('zayathon_admin_participants');
    if (!data) {
      localStorage.setItem('zayathon_admin_participants', JSON.stringify(INITIAL_PARTICIPANTS));
      cachedParticipants = INITIAL_PARTICIPANTS;
      return INITIAL_PARTICIPANTS;
    }
    try {
      cachedParticipants = JSON.parse(data);
      return cachedParticipants;
    } catch (e) {
      return INITIAL_PARTICIPANTS;
    }
  }

  static setParticipants(list) {
    cachedParticipants = list;
    localStorage.setItem('zayathon_admin_participants', JSON.stringify(list));
  }

  static getParticipantById(id) {
    const list = this.getParticipants();
    return list.find(p => p.id === id);
  }

  static updateParticipant(updated) {
    const list = this.getParticipants();
    const index = list.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
      this.setParticipants(list);
    }
  }

  static getTeams() {
    const participants = this.getParticipants();
    const teamsMap = {};

    participants.forEach(p => {
      const tId = p.teamId || `ZT-${p.id}`;
      if (!teamsMap[tId]) {
        teamsMap[tId] = {
          teamId: tId,
          teamName: p.teamName || p.team || 'Independent Team',
          track: p.track,
          projectTitle: p.projectTitle || 'N/A',
          leader: p.role === 'Team Leader' ? p.name : 'Participant',
          members: []
        };
      }
      if (p.role === 'Team Leader') {
        teamsMap[tId].leader = p.name;
      }
      teamsMap[tId].members.push(p);
    });

    return Object.values(teamsMap);
  }
}

// --------------------------------------------------------------------------
// 2. Authentication & Session Manager
// --------------------------------------------------------------------------
class AdminAuth {
  static isAuth() {
    return sessionStorage.getItem('zayathon_admin_session') === 'active';
  }

  static async requireAuth() {
    if (!this.isAuth()) {
      window.location.href = 'login.html';
      return false;
    }
    try {
      const savedUser = sessionStorage.getItem('zayathon_admin_user');
      if (savedUser) {
        CURRENT_ADMIN = JSON.parse(savedUser);
      }
    } catch (e) {}
    return true;
  }

  static async login(email, password) {
    // If running over HTTP/HTTPS, attempt Firebase Authentication
    if (window.location.protocol.startsWith('http')) {
      try {
        const { loginAdminWithFirebase } = await import('./firebase-app.js');
        return await loginAdminWithFirebase(email, password);
      } catch (e) {
        console.warn('Firebase login fallback:', e);
      }
    }

    // Standard fallback credentials (runs in both file:/// and localhost)
    if (
      (email === 'bijay08@gmail.com' || email === 'admin@zayacodehub.com' || email === 'admin' || email === 'organizer@zayathon.in') &&
      (password === 'Bijay@08' || password === 'admin2026' || password === 'zaya2026' || password === 'admin')
    ) {
      const demoUser = {
        uid: 'LhqQVJyCuog3jFbCjvdWYKKhttz1',
        email: email === 'admin' ? 'bijay08@gmail.com' : email,
        name: 'Bijay (Lead Organizer)',
        role: 'super_admin'
      };
      sessionStorage.setItem('zayathon_admin_session', 'active');
      sessionStorage.setItem('zayathon_admin_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    return { success: false, message: 'Invalid organizer credentials.' };
  }

  static async logout() {
    if (window.location.protocol.startsWith('http')) {
      try {
        const { logoutAdminFromFirebase } = await import('./firebase-app.js');
        await logoutAdminFromFirebase();
        return;
      } catch (e) {}
    }
    sessionStorage.removeItem('zayathon_admin_session');
    sessionStorage.removeItem('zayathon_admin_user');
    window.location.href = 'login.html';
  }
}

// --------------------------------------------------------------------------
// 3. UI Controller & Router
// --------------------------------------------------------------------------
let currentPage = 1;
const itemsPerPage = 6;
let currentFilters = {
  search: '',
  status: 'all',
  track: 'all',
  college: 'all',
  sort: 'newest'
};

let activeParticipantId = null;

async function initAdminCore() {
  const isLoginPage = window.location.pathname.includes('login') || document.getElementById('admin-login-form');

  if (isLoginPage) {
    initLoginPage();
    return;
  }

  // Require auth for dashboard
  const hasAuth = await AdminAuth.requireAuth();
  if (!hasAuth) return;

  initTheme();
  initAdminProfileHeader();
  initNavigation();
  initModals();
  initFilterControls();

  // Load participants from Firestore if running on HTTP
  if (window.location.protocol.startsWith('http')) {
    loadFirestoreParticipants();
  }

  renderDashboard();
  renderParticipants();
  renderTeams();
  renderReports();
  renderSettings();
  updateNotificationCounts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminCore);
} else {
  initAdminCore();
}

function initAdminProfileHeader() {
  const nameEl = document.querySelector('.admin-user-name');
  const roleEl = document.querySelector('.admin-user-role');
  const avatarEl = document.querySelector('.admin-avatar');

  if (nameEl && CURRENT_ADMIN.name) nameEl.textContent = CURRENT_ADMIN.name;
  if (roleEl && CURRENT_ADMIN.role) roleEl.textContent = CURRENT_ADMIN.role;
  if (avatarEl && CURRENT_ADMIN.name) {
    const initials = CURRENT_ADMIN.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    avatarEl.textContent = initials || 'AD';
  }
}

async function loadFirestoreParticipants() {
  try {
    const { subscribeToParticipants } = await import('./firebase-app.js');
    subscribeToParticipants(liveList => {
      if (liveList && liveList.length > 0) {
        AdminStore.setParticipants(liveList);
        renderDashboard();
        renderParticipants();
        renderTeams();
        renderReports();
        updateNotificationCounts();
      }
    });
  } catch (e) {}
}

// Theme Management
function initTheme() {
  const savedMode = localStorage.getItem('zayathon_mode') || 'dark';
  document.documentElement.setAttribute('data-mode', savedMode);

  const modeToggle = document.getElementById('admin-theme-toggle');
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-mode') || 'dark';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-mode', next);
      localStorage.setItem('zayathon_mode', next);
    });
  }
}

// Login Page Logic
function initLoginPage() {
  const form = document.getElementById('admin-login-form');
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const passInput = document.getElementById('admin-password');
  const errorAlert = document.getElementById('login-error-alert');
  const demoFillBtn = document.getElementById('btn-demo-fill');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  // Toggle show/hide password
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passInput.getAttribute('type') === 'password';
      passInput.setAttribute('type', isPass ? 'text' : 'password');
      togglePassBtn.textContent = isPass ? 'Hide' : 'Show';
    });
  }



  // Submit Handler
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const pass = document.getElementById('admin-password').value;

      if (errorAlert) errorAlert.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verifying Admin Credentials...</span>';
      }

      try {
        const result = await AdminAuth.login(email, pass);
        if (result.success) {
          window.location.href = 'dashboard.html';
        } else {
          if (errorAlert) {
            errorAlert.style.display = 'block';
            errorAlert.textContent = result.message || 'Access Denied: Invalid credentials.';
          }
        }
      } catch (err) {
        if (errorAlert) {
          errorAlert.style.display = 'block';
          errorAlert.textContent = err.message || 'Authentication error.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Authorize & Enter Dashboard</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
        }
      }
    });
  }
}

// Navigation & Tab Switching
function initNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-view]');
  const views = document.querySelectorAll('.view-section');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const logoutBtn = document.getElementById('admin-logout-btn');

  function switchView(viewName) {
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });
    views.forEach(v => {
      v.classList.toggle('active', v.id === `view-${viewName}`);
    });
    window.location.hash = viewName;
    if (sidebar) sidebar.classList.remove('open');

    // Refresh targeted view
    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'participants') renderParticipants();
    if (viewName === 'teams') renderTeams();
    if (viewName === 'reports') renderReports();
    if (viewName === 'settings') renderSettings();
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      switchView(view);
    });
  });

  // Mobile menu toggle
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Handle URL hash on load
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  if (document.getElementById(`view-${hash}`)) {
    switchView(hash);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => AdminAuth.logout());
  }
}

// --------------------------------------------------------------------------
// 4. Dashboard View Rendering
// --------------------------------------------------------------------------
function renderDashboard() {
  const participants = AdminStore.getParticipants();
  const teams = AdminStore.getTeams();

  const total = participants.length;
  const pending = participants.filter(p => p.status?.toLowerCase() === 'pending').length;
  const verified = participants.filter(p => p.status?.toLowerCase() === 'verified').length;
  const rejected = participants.filter(p => p.status?.toLowerCase() === 'rejected').length;
  const totalTeams = teams.length;

  const totalEl = document.getElementById('dash-metric-total');
  const pendingEl = document.getElementById('dash-metric-pending');
  const verifiedEl = document.getElementById('dash-metric-verified');
  const rejectedEl = document.getElementById('dash-metric-rejected');
  const teamsEl = document.getElementById('dash-metric-teams');

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (verifiedEl) verifiedEl.textContent = verified;
  if (rejectedEl) rejectedEl.textContent = rejected;
  if (teamsEl) teamsEl.textContent = totalTeams;

  // Render Recent Activity Feed
  const feedContainer = document.getElementById('dash-recent-activity-list');
  if (feedContainer) {
    const allHistory = [];
    participants.forEach(p => {
      (p.history || []).forEach(h => {
        allHistory.push({
          ...h,
          participantName: p.name,
          participantId: p.id,
          teamName: p.teamName || p.team
        });
      });
    });

    allHistory.reverse();

    if (allHistory.length === 0) {
      feedContainer.innerHTML = '<div style="color:var(--admin-text-muted); font-size:0.85rem; padding:1rem 0;">No recent actions recorded.</div>';
    } else {
      feedContainer.innerHTML = allHistory.slice(0, 6).map(h => `
        <div class="history-entry">
          <div class="history-header">
            <span class="history-action">${h.action}</span>
            <span class="history-time">${h.time || h.timestamp || ''}</span>
          </div>
          <div class="history-meta">
            <strong>${h.participantName}</strong> (${h.participantId}) • <span>By ${h.admin || h.adminName || 'System'}</span>
            ${h.meta ? `<div style="font-size:0.75rem; color:var(--admin-text-muted); margin-top:0.15rem;">${h.meta}</div>` : ''}
          </div>
        </div>
      `).join('');
    }
  }

  // Render Quick Verification Queue (Pending participants)
  const queueTbody = document.getElementById('dash-queue-table-body');
  if (queueTbody) {
    const pendingList = participants.filter(p => p.status?.toLowerCase() === 'pending').slice(0, 4);
    if (pendingList.length === 0) {
      queueTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--admin-text-muted);">🎉 All participants are reviewed! No pending verifications.</td></tr>`;
    } else {
      queueTbody.innerHTML = pendingList.map(p => `
        <tr>
          <td><strong style="color:var(--primary); font-family:var(--font-mono);">${p.id}</strong></td>
          <td>
            <div style="font-weight:700; color:var(--admin-text-main);">${p.name}</div>
            <div style="font-size:0.75rem; color:var(--admin-text-muted);">${p.college}</div>
          </td>
          <td><span style="font-size:0.82rem;">${p.teamName || p.team}</span></td>
          <td><span class="status-pill pending"><span class="status-dot"></span> Pending</span></td>
          <td>
            <button type="button" class="action-btn" onclick="openParticipantProfile('${p.id}')">Review & Verify →</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Full queue view
  const queueTbody2 = document.getElementById('dash-queue-table-body-2');
  if (queueTbody2) {
    const allPending = participants.filter(p => p.status?.toLowerCase() === 'pending');
    if (allPending.length === 0) {
      queueTbody2.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">🎉 All participant applications are completely reviewed and verified!</td></tr>`;
    } else {
      queueTbody2.innerHTML = allPending.map(p => `
        <tr>
          <td><strong style="color:var(--primary); font-family:var(--font-mono);">${p.id}</strong></td>
          <td>
            <div style="font-weight:700; color:var(--admin-text-main);">${p.name}</div>
            <div style="font-size:0.75rem; color:var(--admin-text-muted);">${p.college} • ${p.email}</div>
          </td>
          <td><span style="font-size:0.85rem; font-weight:600;">${p.teamName || p.team}</span></td>
          <td><span class="status-pill pending"><span class="status-dot"></span> Pending</span></td>
          <td>
            <button type="button" class="action-btn action-btn-verify" onclick="openParticipantProfile('${p.id}')">Review & Verify →</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// --------------------------------------------------------------------------
// 5. Participants List & Filtering
// --------------------------------------------------------------------------
function initFilterControls() {
  const searchInput = document.getElementById('filter-search');
  const statusSelect = document.getElementById('filter-status');
  const trackSelect = document.getElementById('filter-track');
  const collegeSelect = document.getElementById('filter-college');
  const clearBtn = document.getElementById('btn-clear-filters');
  const sortSelect = document.getElementById('filter-sort');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value.toLowerCase().trim();
      currentPage = 1;
      renderParticipants();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      currentFilters.status = e.target.value;
      currentPage = 1;
      renderParticipants();
    });
  }

  if (trackSelect) {
    trackSelect.addEventListener('change', (e) => {
      currentFilters.track = e.target.value;
      currentPage = 1;
      renderParticipants();
    });
  }

  if (collegeSelect) {
    collegeSelect.addEventListener('change', (e) => {
      currentFilters.college = e.target.value;
      currentPage = 1;
      renderParticipants();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      renderParticipants();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFilters = { search: '', status: 'all', track: 'all', college: 'all', sort: 'newest' };
      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = 'all';
      if (trackSelect) trackSelect.value = 'all';
      if (collegeSelect) collegeSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'newest';
      currentPage = 1;
      renderParticipants();
    });
  }

  // Populate dynamic colleges in college filter
  const participants = AdminStore.getParticipants();
  const colleges = Array.from(new Set(participants.map(p => p.college).filter(Boolean)));
  if (collegeSelect) {
    collegeSelect.innerHTML = '<option value="all">All Colleges</option>' + 
      colleges.map(c => `<option value="${c}">${c}</option>`).join('');
  }
}

function renderParticipants() {
  const tbody = document.getElementById('participants-table-body');
  if (!tbody) return;

  const participants = AdminStore.getParticipants();

  // Apply filters
  let filtered = participants.filter(p => {
    const s = currentFilters.search;
    const matchesSearch = !s || 
      (p.name && p.name.toLowerCase().includes(s)) ||
      (p.email && p.email.toLowerCase().includes(s)) ||
      (p.id && p.id.toLowerCase().includes(s)) ||
      (p.teamName && p.teamName.toLowerCase().includes(s)) ||
      (p.team && p.team.toLowerCase().includes(s)) ||
      (p.college && p.college.toLowerCase().includes(s));

    const matchesStatus = currentFilters.status === 'all' || (p.status || '').toLowerCase() === currentFilters.status.toLowerCase();
    const matchesTrack = currentFilters.track === 'all' || p.track === currentFilters.track;
    const matchesCollege = currentFilters.college === 'all' || p.college === currentFilters.college;

    return matchesSearch && matchesStatus && matchesTrack && matchesCollege;
  });

  // Sorting
  if (currentFilters.sort === 'name-asc') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (currentFilters.sort === 'name-desc') {
    filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  } else if (currentFilters.sort === 'status') {
    filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
  }

  // Total count indicator
  const totalCountEl = document.getElementById('participants-showing-count');
  if (totalCountEl) {
    totalCountEl.textContent = `Showing ${filtered.length} of ${participants.length} participants`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:3rem 1.5rem; color:var(--admin-text-muted);">
          No participants match your search and filter criteria.
        </td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  // Pagination slice
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  tbody.innerHTML = pageItems.map(p => {
    const statusLower = (p.status || 'pending').toLowerCase();
    const statusClass = statusLower === 'verified' ? 'verified' : (statusLower === 'rejected' ? 'rejected' : 'pending');

    return `
      <tr>
        <td><strong style="color:var(--primary); font-family:var(--font-mono);">${p.id}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--admin-text-main);">${p.name}</div>
          <div style="font-size:0.75rem; color:var(--admin-text-muted);">${p.role || 'Member'}</div>
        </td>
        <td>
          <div>${p.email}</div>
          <div style="font-size:0.75rem; color:var(--admin-text-muted); font-family:var(--font-mono);">${p.phone}</div>
        </td>
        <td><span title="${p.college}">${truncate(p.college, 26)}</span></td>
        <td>
          <span style="font-weight:600; color:var(--admin-text-main);">${p.teamName || p.team}</span>
          <div style="font-size:0.72rem; color:var(--admin-text-muted); font-family:var(--font-mono);">${p.teamId}</div>
        </td>
        <td><span title="${p.track}">${truncate(p.track, 24)}</span></td>
        <td><span style="font-size:0.78rem; font-family:var(--font-mono);">${p.regDate}</span></td>
        <td>
          <span class="status-pill ${statusClass}">
            <span class="status-dot"></span>
            ${p.status}
          </span>
        </td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="action-btn" onclick="openParticipantProfile('${p.id}')" title="View Full Profile">View</button>
            ${p.status?.toLowerCase() !== 'verified' ? `<button type="button" class="action-btn action-btn-verify" onclick="confirmDirectVerify('${p.id}')" title="Verify in Firestore">✓</button>` : ''}
            ${p.status?.toLowerCase() !== 'rejected' ? `<button type="button" class="action-btn action-btn-reject" onclick="openRejectModal('${p.id}')" title="Reject with Reason">✕</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const container = document.getElementById('pagination-controls');
  if (!container) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  let html = '';

  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">« Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next »</button>`;

  container.innerHTML = html;
}

window.changePage = function(page) {
  currentPage = page;
  renderParticipants();
};

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

// --------------------------------------------------------------------------
// 6. View Participant Details & Verification Drawer
// --------------------------------------------------------------------------
window.openParticipantProfile = function(id) {
  activeParticipantId = id;
  const p = AdminStore.getParticipantById(id);
  if (!p) return;

  const modal = document.getElementById('participant-profile-modal');
  if (!modal) return;

  // Populate Header
  document.getElementById('profile-modal-name').textContent = p.name;
  document.getElementById('profile-modal-id').textContent = p.id;
  
  const badgeEl = document.getElementById('profile-modal-status-badge');
  const statusLower = (p.status || 'pending').toLowerCase();
  const statusClass = statusLower === 'verified' ? 'verified' : (statusLower === 'rejected' ? 'rejected' : 'pending');
  badgeEl.className = `status-pill ${statusClass}`;
  badgeEl.innerHTML = `<span class="status-dot"></span> ${p.status}`;

  // 1. Personal Details
  document.getElementById('prof-name').textContent = p.name;
  document.getElementById('prof-email').textContent = p.email;
  document.getElementById('prof-phone').textContent = p.phone;
  document.getElementById('prof-role').textContent = p.role || 'Member';

  // 2. College Details
  document.getElementById('prof-college').textContent = p.college;
  document.getElementById('prof-dept').textContent = p.department || 'N/A';
  document.getElementById('prof-degree').textContent = p.degree || 'B.E. / B.Tech';
  document.getElementById('prof-year').textContent = p.year || '3rd Year';

  // 3. Hackathon Details
  document.getElementById('prof-team-name').textContent = `${p.teamName || p.team} (${p.teamId})`;
  document.getElementById('prof-track').textContent = p.track;
  document.getElementById('prof-reg-date').textContent = p.regDate;
  document.getElementById('prof-project-title').textContent = p.projectTitle || 'N/A';
  document.getElementById('prof-project-abstract').textContent = p.projectAbstract || 'No abstract provided.';

  // 4. Uploaded Documents
  const docsContainer = document.getElementById('prof-documents-list');
  if (docsContainer) {
    if (!p.documents || p.documents.length === 0) {
      docsContainer.innerHTML = '<span style="color:var(--admin-text-muted); font-size:0.85rem;">No documents uploaded.</span>';
    } else {
      docsContainer.innerHTML = p.documents.map(d => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0.6rem 0.85rem; border:1px solid var(--admin-border); border-radius:6px; background:rgba(255,255,255,0.02); font-size:0.85rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="color:var(--primary);">📄</span>
            <div>
              <div style="font-weight:600; color:var(--admin-text-main);">${d.name}</div>
              <div style="font-size:0.72rem; color:var(--admin-text-muted);">${d.type} • ${d.size}</div>
            </div>
          </div>
          <button type="button" class="action-btn" onclick="showToast('📥 Opening document ${d.name}...')">View Document</button>
        </div>
      `).join('');
    }
  }

  // 5. Verification Checklist
  renderChecklist(p);

  // 6. Admin Notes
  renderNotes(p);

  // 7. Verification History
  renderHistory(p);

  modal.classList.add('open');
};

function renderChecklist(p) {
  const container = document.getElementById('prof-checklist-items');
  const progressText = document.getElementById('checklist-progress-text');
  const progressFill = document.getElementById('checklist-progress-fill');

  const checklistLabels = [
    "Participant personal & contact information checked",
    "College enrollment & official student ID verified",
    "Team composition & track rules met (2–4 members)",
    "Required uploaded documents verified",
    "Eligibility criteria (1st–3rd year undergraduate) checked"
  ];

  const checks = p.checklist || [false, false, false, false, false];
  const completedCount = checks.filter(Boolean).length;
  const percent = Math.round((completedCount / 5) * 100);

  if (progressText) progressText.textContent = `${completedCount} / 5 Completed`;
  if (progressFill) progressFill.style.width = `${percent}%`;

  if (container) {
    container.innerHTML = checklistLabels.map((label, idx) => `
      <label class="checklist-item">
        <input type="checkbox" ${checks[idx] ? 'checked' : ''} onchange="toggleChecklistStep('${p.id}', ${idx})" />
        <span style="font-size:0.88rem; color:var(--admin-text-main);">${label}</span>
      </label>
    `).join('');
  }
}

window.toggleChecklistStep = function(participantId, idx) {
  const p = AdminStore.getParticipantById(participantId);
  if (!p) return;

  p.checklist = p.checklist || [false, false, false, false, false];
  p.checklist[idx] = !p.checklist[idx];

  const completed = p.checklist.filter(Boolean).length;
  p.history = p.history || [];
  p.history.unshift({
    action: "Checklist Updated",
    admin: CURRENT_ADMIN.name,
    time: formatDateTime(new Date()),
    meta: `Verification checklist progress: ${completed}/5.`
  });

  AdminStore.updateParticipant(p);
  renderChecklist(p);
  renderHistory(p);
};

function renderNotes(p) {
  const container = document.getElementById('prof-notes-list');
  if (!container) return;

  const notes = p.notes || [];
  if (notes.length === 0) {
    container.innerHTML = '<div style="color:var(--admin-text-muted); font-size:0.82rem;">No admin notes added yet.</div>';
  } else {
    container.innerHTML = notes.map(n => `
      <div class="note-bubble">
        <div class="note-bubble-header">
          <strong>${n.author || n.authorName}</strong>
          <span>${n.time || n.createdAt || ''}</span>
        </div>
        <div style="color:var(--admin-text-main); line-height:1.4;">${n.text}</div>
      </div>
    `).join('');
  }
}

function renderHistory(p) {
  const container = document.getElementById('prof-history-timeline');
  if (!container) return;

  const history = p.history || [];
  container.innerHTML = history.map(h => `
    <div class="history-entry">
      <div class="history-header">
        <span class="history-action">${h.action}</span>
        <span class="history-time">${h.time || h.timestamp || ''}</span>
      </div>
      <div class="history-meta">
        <span>By <strong>${h.admin || h.adminName || 'System'}</strong></span>
        ${h.meta ? `<div style="font-size:0.75rem; color:var(--admin-text-muted); margin-top:0.15rem;">${h.meta}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// --------------------------------------------------------------------------
// 7. Verify & Reject Actions (Cloud Firestore)
// --------------------------------------------------------------------------
function initModals() {
  // Close Profile Modal
  const closeProfileBtn = document.getElementById('close-profile-modal');
  if (closeProfileBtn) {
    closeProfileBtn.addEventListener('click', () => {
      document.getElementById('participant-profile-modal').classList.remove('open');
    });
  }

  // Profile Drawer Verify Button
  const profVerifyBtn = document.getElementById('btn-verify-participant');
  if (profVerifyBtn) {
    profVerifyBtn.addEventListener('click', () => {
      if (activeParticipantId) confirmDirectVerify(activeParticipantId);
    });
  }

  // Profile Drawer Reject Button
  const profRejectBtn = document.getElementById('btn-reject-participant');
  if (profRejectBtn) {
    profRejectBtn.addEventListener('click', () => {
      if (activeParticipantId) openRejectModal(activeParticipantId);
    });
  }

  // Add Note Handler
  const addNoteBtn = document.getElementById('btn-save-admin-note');
  const noteInput = document.getElementById('admin-note-text');
  if (addNoteBtn && noteInput) {
    addNoteBtn.addEventListener('click', async () => {
      const text = noteInput.value.trim();
      if (!text || !activeParticipantId) return;

      addNoteBtn.disabled = true;
      try {
        if (window.location.protocol.startsWith('http')) {
          try {
            const { addAdminNoteToFirestore } = await import('./firebase-app.js');
            await addAdminNoteToFirestore(activeParticipantId, text, CURRENT_ADMIN);
          } catch (e) {}
        }

        const p = AdminStore.getParticipantById(activeParticipantId);
        if (p) {
          p.notes = p.notes || [];
          p.notes.unshift({
            author: CURRENT_ADMIN.name,
            time: formatDateTime(new Date()),
            text: text
          });
          p.history = p.history || [];
          p.history.unshift({
            action: 'Admin Note Added',
            admin: CURRENT_ADMIN.name,
            time: formatDateTime(new Date()),
            meta: `Note: "${text.length > 40 ? text.substring(0, 40) + '...' : text}"`
          });
          AdminStore.updateParticipant(p);
          renderNotes(p);
          renderHistory(p);
        }
        noteInput.value = '';
        showToast('📝 Note saved successfully.');
      } catch (err) {
        showToast('⚠️ Note saved locally.');
      } finally {
        addNoteBtn.disabled = false;
      }
    });
  }

  // Reject Modal Submissions
  const rejectForm = document.getElementById('reject-participant-form');
  const closeRejectBtn = document.getElementById('close-reject-modal');
  const cancelRejectBtn = document.getElementById('btn-cancel-rejection');

  if (closeRejectBtn) closeRejectBtn.addEventListener('click', closeRejectModal);
  if (cancelRejectBtn) cancelRejectBtn.addEventListener('click', closeRejectModal);

  if (rejectForm) {
    rejectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const reason = document.getElementById('reject-reason-select').value;
      const note = document.getElementById('reject-admin-note').value.trim();
      await executeRejection(activeParticipantId, reason, note);
    });
  }
}

// Direct Verify in Firestore
window.confirmDirectVerify = async function(id) {
  const p = AdminStore.getParticipantById(id);
  if (!p) return;

  if (confirm(`Are you sure you want to verify participant "${p.name}" (${p.id})?`)) {
    try {
      if (window.location.protocol.startsWith('http')) {
        try {
          const { verifyParticipantInFirestore } = await import('./firebase-app.js');
          await verifyParticipantInFirestore(id, CURRENT_ADMIN);
        } catch (e) {}
      }

      p.status = 'Verified';
      p.verifiedBy = CURRENT_ADMIN.name;
      p.verifiedAt = formatDateTime(new Date());
      p.checklist = [true, true, true, true, true];
      p.history = p.history || [];
      p.history.unshift({
        action: 'Participant Verified',
        admin: CURRENT_ADMIN.name,
        time: formatDateTime(new Date()),
        meta: 'Application verified and official admit pass cleared.'
      });
      AdminStore.updateParticipant(p);

      showToast(`🟢 Participant ${p.name} marked status = verified!`);
      
      if (activeParticipantId === id && document.getElementById('participant-profile-modal')?.classList.contains('open')) {
        openParticipantProfile(id);
      }

      renderDashboard();
      renderParticipants();
      renderTeams();
      renderReports();
      updateNotificationCounts();
    } catch (err) {
      showToast(`⚠️ Verification saved.`);
    }
  }
};

// Open Rejection Dialog Modal
window.openRejectModal = function(id) {
  activeParticipantId = id;
  const p = AdminStore.getParticipantById(id);
  if (!p) return;

  document.getElementById('reject-target-name').textContent = `${p.name} (${p.id})`;
  document.getElementById('reject-reason-select').selectedIndex = 0;
  document.getElementById('reject-admin-note').value = '';
  document.getElementById('reject-modal').classList.add('open');
};

function closeRejectModal() {
  document.getElementById('reject-modal').classList.remove('open');
}

async function executeRejection(id, reason, note) {
  const p = AdminStore.getParticipantById(id);
  if (!p) return;

  try {
    if (window.location.protocol.startsWith('http')) {
      try {
        const { rejectParticipantInFirestore } = await import('./firebase-app.js');
        await rejectParticipantInFirestore(id, reason, CURRENT_ADMIN, note);
      } catch (e) {}
    }

    p.status = 'Rejected';
    p.rejectionReason = reason;
    p.verifiedBy = CURRENT_ADMIN.name;
    p.verifiedAt = formatDateTime(new Date());
    p.history = p.history || [];
    p.history.unshift({
      action: 'Participant Rejected',
      admin: CURRENT_ADMIN.name,
      time: formatDateTime(new Date()),
      meta: `Reason: ${reason}`
    });
    if (note) {
      p.notes = p.notes || [];
      p.notes.unshift({
        author: CURRENT_ADMIN.name,
        time: formatDateTime(new Date()),
        text: `[Rejection Reason: ${reason}] ${note}`
      });
    }
    AdminStore.updateParticipant(p);

    closeRejectModal();
    showToast(`🔴 Participant ${p.name} rejected (status = rejected).`);

    if (activeParticipantId === id && document.getElementById('participant-profile-modal')?.classList.contains('open')) {
      openParticipantProfile(id);
    }

    renderDashboard();
    renderParticipants();
    renderTeams();
    renderReports();
    updateNotificationCounts();
  } catch (err) {
    showToast(`⚠️ Rejection updated.`);
  }
}

// --------------------------------------------------------------------------
// 8. Teams View Rendering
// --------------------------------------------------------------------------
function renderTeams() {
  const tbody = document.getElementById('teams-table-body');
  if (!tbody) return;

  const teams = AdminStore.getTeams();

  tbody.innerHTML = teams.map(t => {
    const totalMembers = t.members.length;
    const verifiedMembers = t.members.filter(m => (m.status || '').toLowerCase() === 'verified').length;
    const rejectedMembers = t.members.filter(m => (m.status || '').toLowerCase() === 'rejected').length;

    let teamStatusBadge = '<span class="status-pill pending"><span class="status-dot"></span> Incomplete</span>';
    if (verifiedMembers === totalMembers && totalMembers > 0) {
      teamStatusBadge = '<span class="status-pill verified"><span class="status-dot"></span> All Verified</span>';
    } else if (rejectedMembers > 0) {
      teamStatusBadge = '<span class="status-pill rejected"><span class="status-dot"></span> Issues Flagged</span>';
    }

    return `
      <tr>
        <td><strong style="color:var(--secondary); font-family:var(--font-mono);">${t.teamId}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--admin-text-main);">${t.teamName}</div>
          <div style="font-size:0.75rem; color:var(--admin-text-muted);">${t.projectTitle}</div>
        </td>
        <td><strong>${t.leader}</strong></td>
        <td><span style="font-family:var(--font-mono);">${totalMembers} Members</span></td>
        <td><span title="${t.track}">${truncate(t.track, 24)}</span></td>
        <td>${teamStatusBadge}</td>
        <td>
          <button type="button" class="action-btn" onclick="viewTeamRosterModal('${t.teamId}')">View Roster (${totalMembers}) →</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.viewTeamRosterModal = function(teamId) {
  const teams = AdminStore.getTeams();
  const team = teams.find(t => t.teamId === teamId);
  if (!team) return;

  const modal = document.getElementById('team-roster-modal');
  const body = document.getElementById('team-roster-modal-body');
  document.getElementById('team-roster-name').textContent = `${team.teamName} (${team.teamId})`;

  body.innerHTML = `
    <div style="margin-bottom:1.25rem;">
      <div style="font-size:0.85rem; color:var(--admin-text-muted);">Allocated Track: <strong style="color:var(--primary);">${team.track}</strong></div>
      <div style="font-size:0.85rem; color:var(--admin-text-muted); margin-top:0.25rem;">Project Title: <strong style="color:var(--admin-text-main);">${team.projectTitle}</strong></div>
    </div>

    <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--admin-text-main);">Team Members (${team.members.length}):</h4>
    <div style="display:flex; flex-direction:column; gap:0.75rem;">
      ${team.members.map(m => {
        const sLower = (m.status || 'pending').toLowerCase();
        const sClass = sLower === 'verified' ? 'verified' : (sLower === 'rejected' ? 'rejected' : 'pending');
        return `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border:1px solid var(--admin-border); border-radius:6px; background:rgba(255,255,255,0.02);">
            <div>
              <div style="font-weight:700; color:var(--admin-text-main);">${m.name} <span style="font-size:0.75rem; color:var(--primary); font-family:var(--font-mono);">(${m.role})</span></div>
              <div style="font-size:0.75rem; color:var(--admin-text-muted);">${m.college} • ${m.email}</div>
            </div>
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span class="status-pill ${sClass}"><span class="status-dot"></span> ${m.status}</span>
              <button type="button" class="action-btn" onclick="document.getElementById('team-roster-modal').classList.remove('open'); openParticipantProfile('${m.id}')">Inspect</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  modal.classList.add('open');
};

window.closeTeamRosterModal = function() {
  document.getElementById('team-roster-modal').classList.remove('open');
};

// --------------------------------------------------------------------------
// 9. Reports & Analytics View
// --------------------------------------------------------------------------
function renderReports() {
  const participants = AdminStore.getParticipants();

  // 1. Track distribution
  const trackContainer = document.getElementById('report-track-bars');
  if (trackContainer) {
    const trackCounts = {};
    participants.forEach(p => {
      const t = p.track || 'Other';
      trackCounts[t] = (trackCounts[t] || 0) + 1;
    });

    const total = participants.length || 1;
    const sorted = Object.entries(trackCounts).sort((a, b) => b[1] - a[1]);

    trackContainer.innerHTML = sorted.map(([track, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div class="track-bar-item">
          <div class="track-bar-label">
            <span>${track}</span>
            <strong>${count} Participants (${pct}%)</strong>
          </div>
          <div class="track-bar-track">
            <div class="track-bar-fill" style="width:${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. College distribution
  const collegeContainer = document.getElementById('report-college-bars');
  if (collegeContainer) {
    const collegeCounts = {};
    participants.forEach(p => {
      const c = p.college || 'Other';
      collegeCounts[c] = (collegeCounts[c] || 0) + 1;
    });

    const total = participants.length || 1;
    const sortedColleges = Object.entries(collegeCounts).sort((a, b) => b[1] - a[1]);

    collegeContainer.innerHTML = sortedColleges.map(([college, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div class="track-bar-item">
          <div class="track-bar-label">
            <span>${college}</span>
            <strong>${count} Students (${pct}%)</strong>
          </div>
          <div class="track-bar-track">
            <div class="track-bar-fill" style="width:${pct}%; background:linear-gradient(90deg, #8a2be2, #00f0ff);"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// --------------------------------------------------------------------------
// 10. Settings View & Export CSV
// --------------------------------------------------------------------------
function renderSettings() {
  const resetBtn = document.getElementById('btn-settings-reset-seed');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reload local cache?')) {
        AdminStore.setParticipants(INITIAL_PARTICIPANTS);
        renderDashboard();
        renderParticipants();
        renderTeams();
        renderReports();
        showToast('🔄 Dataset refreshed.');
      }
    });
  }

  const exportBtn = document.getElementById('btn-export-full-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportParticipantsToCSV);
  }
}

function exportParticipantsToCSV() {
  const participants = AdminStore.getParticipants();
  if (participants.length === 0) {
    alert('No participants to export.');
    return;
  }

  const headers = [
    'Participant ID',
    'Full Name',
    'Email Address',
    'Phone',
    'College / University',
    'Department',
    'Year of Study',
    'Team ID',
    'Team Name',
    'Role in Team',
    'Track',
    'Project Title',
    'Registration Date',
    'Verification Status',
    'Verified / Reviewed By',
    'Rejection Reason'
  ];

  const rows = participants.map(p => [
    `"${p.id || ''}"`,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${p.email || ''}"`,
    `"${p.phone || ''}"`,
    `"${(p.college || '').replace(/"/g, '""')}"`,
    `"${(p.department || '').replace(/"/g, '""')}"`,
    `"${p.year || ''}"`,
    `"${p.teamId || ''}"`,
    `"${(p.teamName || p.team || '').replace(/"/g, '""')}"`,
    `"${p.role || ''}"`,
    `"${(p.track || '').replace(/"/g, '""')}"`,
    `"${(p.projectTitle || '').replace(/"/g, '""')}"`,
    `"${p.regDate || ''}"`,
    `"${p.status || 'Pending'}"`,
    `"${(p.verifiedBy || '').replace(/"/g, '""')}"`,
    `"${(p.rejectionReason || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ZAYATHON_2026_Participants_Roster_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📊 CSV Export downloaded successfully.');
}

// --------------------------------------------------------------------------
// 11. Helper Utilities & Toasts
// --------------------------------------------------------------------------
function updateNotificationCounts() {
  const participants = AdminStore.getParticipants();
  const pendingCount = participants.filter(p => (p.status || '').toLowerCase() === 'pending').length;

  document.querySelectorAll('.pending-badge-count').forEach(badge => {
    badge.textContent = pendingCount;
    badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
  });
}

function formatDateTime(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function showToast(message) {
  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = 'background:rgba(13,19,31,0.96); color:#f8fafc; border:1px solid rgba(0,240,255,0.4); padding:10px 16px; border-radius:8px; font-size:0.86rem; box-shadow:0 8px 25px rgba(0,0,0,0.5); backdrop-filter:blur(10px); transition:all 0.3s ease; transform:translateY(10px); opacity:0; pointer-events:auto;';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);

  setTimeout(() => {
    toast.style.transform = 'translateY(10px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global exposures
window.showToast = showToast;
window.exportParticipantsToCSV = exportParticipantsToCSV;

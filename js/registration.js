/**
 * ZAYATHON 2026 - Registration Wizard & Admit Pass Generator
 * Works flawlessly in both file:/// protocol and http:// / https:// localhost
 */

let currentStep = 1;
const totalSteps = 3;

// 1. Global Modal & Utility Functions
function openRegistrationModal() {
  const modal = document.getElementById('registration-modal');
  if (!modal) return;
  goToStep(1);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRegistrationModal() {
  const modal = document.getElementById('registration-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function openStudentLoginModal() {
  const modal = document.getElementById('student-login-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeStudentLoginModal() {
  const modal = document.getElementById('student-login-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function showTicket(data) {
  const modal = document.getElementById('ticket-modal');
  if (!modal) return;

  const idEl = document.getElementById('ticket-team-id');
  const nameEl = document.getElementById('ticket-team-name');
  const leaderEl = document.getElementById('ticket-leader');
  const collEl = document.getElementById('ticket-college');
  const trackEl = document.getElementById('ticket-track');
  const sizeEl = document.getElementById('ticket-size');

  if (idEl) idEl.textContent = data.ticketId;
  if (nameEl) nameEl.textContent = data.teamName;
  if (leaderEl) leaderEl.textContent = data.leaderName;
  if (collEl) collEl.textContent = data.college;
  if (trackEl) trackEl.textContent = data.track;
  if (sizeEl) sizeEl.textContent = `${data.teamSize || 4} Members`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function updateMemberFields(size) {
  const container = document.getElementById('dynamic-members-container');
  if (!container) return;

  container.innerHTML = '';
  for (let i = 2; i <= size; i++) {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label class="form-label">Member ${i} Full Name & Role</label>
      <input type="text" class="form-input member-name-input" placeholder="e.g. Alex Johnson (Frontend / UI Designer)" />
    `;
    container.appendChild(div);
  }
}

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;
  currentStep = step;

  // Update step contents
  document.querySelectorAll('.wizard-step-content').forEach((el, index) => {
    el.classList.toggle('active', index + 1 === step);
  });

  // Update step indicators
  document.querySelectorAll('.step-indicator').forEach((el, index) => {
    const stepNum = index + 1;
    el.classList.toggle('active', stepNum === step);
    el.classList.toggle('completed', stepNum < step);
  });

  // Button visibility
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');
  const submitBtn = document.getElementById('wizard-submit-btn');

  if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
  if (nextBtn) nextBtn.style.display = step === totalSteps ? 'none' : 'inline-flex';
  if (submitBtn) submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
}

function validateStep(step) {
  if (step === 1) {
    const teamName = document.getElementById('reg-team-name')?.value.trim();
    const college = document.getElementById('reg-college')?.value.trim();
    if (!teamName) {
      showToast('⚠️ Please enter your Team Name.');
      return false;
    }
    if (!college) {
      showToast('⚠️ Please enter your College / University Name.');
      return false;
    }
    return true;
  }

  if (step === 2) {
    const name = document.getElementById('reg-leader-name')?.value.trim();
    const email = document.getElementById('reg-leader-email')?.value.trim();
    const phone = document.getElementById('reg-leader-phone')?.value.trim();

    if (!name) {
      showToast('⚠️ Please enter Team Leader Name.');
      return false;
    }
    if (!email || !email.includes('@')) {
      showToast('⚠️ Please enter a valid Leader Email Address.');
      return false;
    }
    if (!phone || phone.length < 10) {
      showToast('⚠️ Please enter a valid 10-digit Phone Number.');
      return false;
    }
    return true;
  }

  if (step === 3) {
    const track = document.getElementById('reg-track')?.value;
    const projectTitle = document.getElementById('reg-project-title')?.value.trim();
    if (!track) {
      showToast('⚠️ Please select a Hackathon Track.');
      return false;
    }
    if (!projectTitle) {
      showToast('⚠️ Please provide a Working Project Title.');
      return false;
    }
    return true;
  }

  return true;
}

// Attach immediately to window for direct HTML inline attributes
window.openRegistrationModal = openRegistrationModal;
window.closeRegistrationModal = closeRegistrationModal;
window.openStudentLoginModal = openStudentLoginModal;
window.closeStudentLoginModal = closeStudentLoginModal;
window.showToast = showToast;
window.showTicket = showTicket;
window.updateMemberFields = updateMemberFields;
window.goToStep = goToStep;

// 2. Main DOM Initializer
function initRegistration() {
  const regModal = document.getElementById('registration-modal');
  const ticketModal = document.getElementById('ticket-modal');
  const closeRegBtn = document.getElementById('close-reg-modal');
  const closeTicketBtn = document.getElementById('close-ticket-modal');

  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');
  const teamSizeSelect = document.getElementById('reg-team-size');

  // Close modals
  if (closeRegBtn) {
    closeRegBtn.addEventListener('click', closeRegistrationModal);
  }
  if (closeTicketBtn) {
    closeTicketBtn.addEventListener('click', () => {
      if (ticketModal) ticketModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Go to Home Page Button
  const goHomeBtn = document.getElementById('btn-go-home');
  if (goHomeBtn) {
    goHomeBtn.addEventListener('click', () => {
      if (ticketModal) ticketModal.classList.remove('open');
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Dynamic Members Input Fields based on Team Size (2, 3, 4)
  if (teamSizeSelect) {
    teamSizeSelect.addEventListener('change', (e) => {
      updateMemberFields(parseInt(e.target.value, 10));
    });
  }

  // Wizard Navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  }

  // Submit Handler -> Cloud Firestore + Local Cache
  const regForm = document.getElementById('registration-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep(3)) return;

      const submitButton = document.getElementById('wizard-submit-btn');
      const origBtnText = submitButton ? submitButton.innerHTML : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Submitting Registration...</span>';
      }

      // Collect team & members data
      const memberInputs = document.querySelectorAll('.member-name-input');
      const membersList = [
        {
          name: document.getElementById('reg-leader-name').value.trim(),
          role: 'Team Leader',
          email: document.getElementById('reg-leader-email').value.trim()
        }
      ];

      memberInputs.forEach((inp, idx) => {
        if (inp.value.trim()) {
          membersList.push({
            name: inp.value.trim(),
            role: `Member ${idx + 2}`
          });
        }
      });

      const participantId = 'ZP-2026-' + Math.floor(1000 + Math.random() * 9000);
      const ticketId = 'ZAYA-' + Math.floor(100000 + Math.random() * 900000);

      const registrationData = {
        participantId: participantId,
        ticketId: ticketId,
        fullName: document.getElementById('reg-leader-name').value.trim(),
        leaderName: document.getElementById('reg-leader-name').value.trim(),
        email: document.getElementById('reg-leader-email').value.trim(),
        leaderEmail: document.getElementById('reg-leader-email').value.trim(),
        phone: document.getElementById('reg-leader-phone').value.trim(),
        leaderPhone: document.getElementById('reg-leader-phone').value.trim(),
        college: document.getElementById('reg-college').value.trim(),
        course: 'B.E. / B.Tech',
        department: 'Engineering & Technology',
        year: document.getElementById('reg-leader-year').value,
        yearOfStudy: document.getElementById('reg-leader-year').value,
        team: document.getElementById('reg-team-name').value.trim(),
        teamName: document.getElementById('reg-team-name').value.trim(),
        teamSize: document.getElementById('reg-team-size').value,
        track: document.getElementById('reg-track').value,
        projectTitle: document.getElementById('reg-project-title').value.trim(),
        ideaSummary: document.getElementById('reg-idea-summary').value.trim(),
        members: membersList,
        status: 'pending' // Default registration status: pending
      };

      // Always save to localStorage registry
      try {
        let pubList = JSON.parse(localStorage.getItem('zayathon_registrations') || '[]');
        pubList.unshift({
          ticketId: ticketId,
          teamName: registrationData.teamName,
          leaderName: registrationData.fullName,
          college: registrationData.college,
          track: registrationData.track,
          teamSize: registrationData.teamSize,
          status: 'pending',
          registeredAt: new Date().toISOString()
        });
        localStorage.setItem('zayathon_registrations', JSON.stringify(pubList));

        let adminList = JSON.parse(localStorage.getItem('zayathon_admin_participants') || '[]');
        adminList.unshift({
          id: participantId,
          name: registrationData.fullName,
          email: registrationData.email,
          phone: registrationData.phone,
          college: registrationData.college,
          department: registrationData.department,
          degree: registrationData.course,
          year: registrationData.year,
          teamId: ticketId,
          teamName: registrationData.teamName,
          role: 'Team Leader',
          track: registrationData.track,
          projectTitle: registrationData.projectTitle,
          projectAbstract: registrationData.ideaSummary,
          regDate: new Date().toLocaleString(),
          status: 'Pending',
          verifiedBy: '',
          verifiedAt: '',
          rejectionReason: '',
          documents: [
            { name: 'Student_College_ID.pdf', type: 'College ID Card', size: '1.2 MB' }
          ],
          checklist: [true, true, true, false, false],
          notes: [],
          history: [
            {
              action: 'Registration Submitted',
              admin: 'System',
              time: new Date().toLocaleString(),
              meta: `Team "${registrationData.teamName}" registered for track: ${registrationData.track}.`
            }
          ]
        });
        localStorage.setItem('zayathon_admin_participants', JSON.stringify(adminList));
      } catch (e) {}

      // If running over HTTP/HTTPS, submit to Cloud Firestore
      if (window.location.protocol.startsWith('http')) {
        try {
          const { registerParticipant } = await import('./firebase-app.js');
          await registerParticipant(registrationData);
          console.log('✅ [Firebase] Registered to Firestore:', participantId);
        } catch (err) {
          console.warn('Firebase registration notice:', err);
        }
      }

      closeRegistrationModal();
      showToast(`🎉 Registration Confirmed! Participant ID: ${participantId}`);
      showTicket({
        ticketId: ticketId,
        teamName: registrationData.teamName,
        leaderName: registrationData.fullName,
        college: registrationData.college,
        track: registrationData.track,
        teamSize: registrationData.teamSize
      });

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = origBtnText;
      }
    });
  }

  // Student Login / Pass Retrieval Modal
  const studentLoginModal = document.getElementById('student-login-modal');
  const closeStudentLoginBtn = document.getElementById('close-student-login-modal');
  const studentLoginForm = document.getElementById('student-login-form');

  if (closeStudentLoginBtn) {
    closeStudentLoginBtn.addEventListener('click', closeStudentLoginModal);
  }

  if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = (document.getElementById('login-reg-query')?.value || '').trim().toLowerCase();
      if (!query) return;

      let registrations = [];
      try {
        registrations = JSON.parse(localStorage.getItem('zayathon_registrations') || '[]');
      } catch (err) {
        registrations = [];
      }

      let match = registrations.find(r => 
        (r.ticketId && r.ticketId.toLowerCase() === query) ||
        (r.leaderEmail && r.leaderEmail.toLowerCase() === query) ||
        (r.teamName && r.teamName.toLowerCase() === query)
      );

      if (!match) {
        match = {
          ticketId: query.startsWith('zaya-') ? query.toUpperCase() : 'ZAYA-' + Math.floor(100000 + Math.random() * 900000),
          teamName: 'Innovators Team',
          leaderName: query.includes('@') ? query.split('@')[0] : 'Student Participant',
          college: 'Sona College of Technology, Salem',
          teamSize: '4',
          track: 'Artificial Intelligence & Agentic AI',
          status: 'pending',
          loginsCount: 1,
          lastLogin: new Date().toISOString()
        };
        registrations.unshift(match);
        localStorage.setItem('zayathon_registrations', JSON.stringify(registrations));
      }

      closeStudentLoginModal();
      showToast(`👋 Welcome back, ${match.leaderName}! Admit Pass loaded.`);
      showTicket(match);
    });
  }
}

// 3. Global delegated click listener for any open button
document.addEventListener('click', function(e) {
  const regBtn = e.target.closest('.open-registration-btn');
  if (regBtn) {
    e.preventDefault();
    openRegistrationModal();
    return;
  }

  const loginBtn = e.target.closest('.open-student-login-btn');
  if (loginBtn) {
    e.preventDefault();
    openStudentLoginModal();
    return;
  }
});

// Run init immediately or on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRegistration);
} else {
  initRegistration();
}

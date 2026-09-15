/**
 * Main Application Orchestrator
 * Sticky navigation, theme accent switcher, scroll reveals, active spy, back-to-top
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar & Sticky Navbar
  const scrollProgressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = scrollPercent + '%';
    }

    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    updateActiveNavLink();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        mobileNav.classList.add('open');
        navToggle.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Day / Dark Mode Toggle
  const modeToggleBtns = document.querySelectorAll('.mode-toggle-btn');
  const savedMode = localStorage.getItem('zayathon_mode') || 'dark';
  applyMode(savedMode);

  modeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentMode = document.documentElement.getAttribute('data-mode') || 'dark';
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      applyMode(newMode);
    });
  });

  function applyMode(mode) {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('zayathon_mode', mode);
    modeToggleBtns.forEach(btn => {
      const label = mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Day Mode';
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);
    });
  }

  // 4. Theme Accent Switcher
  const themeDots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('zayathon_theme') || 'cyan';
  applyTheme(savedTheme);

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme-name');
      applyTheme(theme);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zayathon_theme', theme);
    themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-theme-name') === theme);
    });
  }

  // 4. Scroll Spy Navigation Highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // 5. Scroll Reveal with Intersection Observer
  window.checkScrollReveals = function () {
    const reveals = document.querySelectorAll('.reveal:not(.revealed)');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(el => observer.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('revealed'));
    }
  };

  window.checkScrollReveals();

  // 6. Print / Download Ticket Button
  const printTicketBtn = document.getElementById('btn-print-ticket');
  if (printTicketBtn) {
    printTicketBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 7. Sponsor Inquiry Button
  const sponsorInquiryBtns = document.querySelectorAll('.sponsor-inquiry-btn');
  sponsorInquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📩 Opening official organizer email: zayacodehub@gmail.com');
      window.location.href = 'mailto:zayacodehub@gmail.com?subject=ZAYATHON%202026%20Sponsorship%20Inquiry';
    });
  });
});

/* ============================
   HUGS LIFE HOLISTIC — MAIN JS
   ============================ */

// ── Nav scroll effect ──────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger / mobile nav ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

function closeMobileNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

// ── SPA Page Router ─────────────────────────────────────
function navigateTo(pageId, updateHistory = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });
  if (updateHistory) {
    history.pushState({ page: pageId }, '', '#' + pageId);
  }
  closeMobileNav();
  // Re-run reveal animations
  revealOnScroll();
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
  const page = e.state?.page || 'home';
  navigateTo(page, false);
});

// Initial load
const initPage = location.hash.replace('#', '') || 'home';
navigateTo(initPage, false);

// Attach nav links
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(el.dataset.page);
  });
});

// ── Service Tabs ────────────────────────────────────────
function initTabs(tabBtnClass, tabPanelClass) {
  const btns = document.querySelectorAll('.' + tabBtnClass);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const panel = btn.dataset.tab;
      document.querySelectorAll('.' + tabPanelClass).forEach(p => {
        p.classList.toggle('active', p.dataset.panel === panel);
      });
    });
  });
}
initTabs('tab-btn', 'tab-panel');

// ── Gallery Sub-Tabs ────────────────────────────────────
function initSubTabs() {
  const subTabs = document.querySelectorAll('.sub-tab');
  subTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.group;
      document.querySelectorAll(`.sub-tab[data-group="${group}"]`)
        .forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = tab.dataset.subtab;
      document.querySelectorAll(`.gallery-panel[data-group="${group}"]`).forEach(p => {
        p.style.display = p.dataset.panel === panel ? 'grid' : 'none';
      });
    });
  });
}
document.addEventListener('DOMContentLoaded', initSubTabs);

// ── Scroll Reveal ───────────────────────────────────────
function revealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}
revealOnScroll();

// Add reveal CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
  .reveal.revealed { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }
`;
document.head.appendChild(style);

// ── Contact Form ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-primary');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; contactForm.reset(); }, 3000);
  });
}

// ── Animated Counter ─────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let count = 0; const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + (el.dataset.suffix || '');
      if (count >= target) clearInterval(timer);
    }, 25);
  });
}
// Trigger counters when hero is visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const heroObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); heroObs.disconnect(); }
  }, { threshold: 0.3 });
  heroObs.observe(heroSection);
}

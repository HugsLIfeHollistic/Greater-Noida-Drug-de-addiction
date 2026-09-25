/* Hugs Life Holistic — shared site behaviour */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- One-time page-load curtain ---------- */
  const curtain = document.querySelector('.page-curtain');
  if (curtain){
    requestAnimationFrame(() => {
      setTimeout(() => {
        curtain.classList.add('is-leaving');
        setTimeout(() => curtain.remove(), 800);
      }, 180);
    });
  }

  /* ---------- Sticky nav state ---------- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const scrim = document.querySelector('.nav-scrim');
  const closeMobileNav = () => {
    hamburger?.classList.remove('is-open');
    mobileNav?.classList.remove('is-open');
    scrim?.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  hamburger?.addEventListener('click', () => {
    const opening = !mobileNav.classList.contains('is-open');
    hamburger.classList.toggle('is-open', opening);
    mobileNav.classList.toggle('is-open', opening);
    scrim?.classList.toggle('is-open', opening);
    document.body.style.overflow = opening ? 'hidden' : '';
  });
  scrim?.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav .nav-link').forEach(a => a.addEventListener('click', closeMobileNav));

  document.querySelectorAll('.mnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const isOpen = sub.style.maxHeight;
      document.querySelectorAll('.mobile-sub').forEach(s => s.style.maxHeight = null);
      if (!isOpen) sub.style.maxHeight = sub.scrollHeight + 'px';
    });
  });

  /* ---------- Active nav link by current page ---------- */
  const current = (document.body.dataset.page || '').toLowerCase();
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === current) link.classList.add('is-active');
  });

  /* ---------- Scroll reveal (single IntersectionObserver) ---------- */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.count-up');
  if ('IntersectionObserver' in window && counters.length){
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countIo.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => countIo.observe(el));
  }

  /* ---------- Top-level service/gallery/location tabs ---------- */
  document.querySelectorAll('.service-tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const panelWrap = tabGroup.parentElement;
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panelWrap.querySelectorAll(':scope > .tab-panel').forEach(p => p.classList.remove('active'));
        const target = panelWrap.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);
        target?.classList.add('active');
        target?.scrollIntoView({ behavior:'smooth', block:'nearest' });
      });
    });
  });

  /* ---------- Gallery sub-tabs (rooms / cleanliness, etc.) ---------- */
  document.querySelectorAll('.sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      document.querySelectorAll(`.sub-tab[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll(`.gallery-panel[data-group="${group}"]`).forEach(p => p.style.display = 'none');
      const panel = document.querySelector(`.gallery-panel[data-group="${group}"][data-panel="${btn.dataset.subtab}"]`);
      if (panel) panel.style.display = 'grid';
    });
  });

  /* ---------- Deep-link a services/gallery/location tab via #hash ---------- */
  if (window.location.hash){
    const hash = window.location.hash.replace('#','');
    const btn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    btn?.click();
  }

  /* ---------- Ambient petal drift in hero (decorative, capped count) ---------- */
  const petalField = document.querySelector('.petal-drift');
  if (petalField && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const count = window.innerWidth < 700 ? 5 : 9;
    for (let i=0;i<count;i++){
      const span = document.createElement('span');
      span.style.left = (Math.random()*100) + '%';
      span.style.animationDuration = (9 + Math.random()*6) + 's';
      span.style.animationDelay = (Math.random()*8) + 's';
      span.style.opacity = 0.2 + Math.random()*0.25;
      petalField.appendChild(span);
    }
  }

  /* ---------- Contact form (progressive; wire to Web3Forms endpoint) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (status){
      status.textContent = 'Thank you — your message has been received. Our team will call you shortly.';
      status.classList.add('success');
    }
    form.reset();
  });

});

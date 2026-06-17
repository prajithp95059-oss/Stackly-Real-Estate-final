/* ============================================================
   STACKLY — MAIN JS · GSAP + Interactions + Navigation Fix
   ============================================================ */

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
const navbar  = document.querySelector('.navbar');
const backTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
    backTop?.classList.add('show');
  } else {
    navbar?.classList.remove('scrolled');
    backTop?.classList.remove('show');
  }
});

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger  = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target || el.textContent, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── GSAP ANIMATIONS ─────────────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initFallbackReveal();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .from('.hero-badge',     { opacity:0, y:30, duration:0.6, ease:'power3.out' })
    .from('.hero-title',     { opacity:0, y:50, duration:0.9, ease:'power3.out' }, '-=0.3')
    .from('.hero-subtitle',  { opacity:0, y:30, duration:0.7, ease:'power3.out' }, '-=0.5')
    .from('.hero-actions',   { opacity:0, y:20, duration:0.6, ease:'power3.out' }, '-=0.4')
    .from('.hero-stats',     { opacity:0, y:20, duration:0.6, ease:'power3.out' }, '-=0.3')
    .from('.hero-form-panel',{ opacity:0, x:60, duration:0.8, ease:'power3.out' }, '-=0.7');

  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  gsap.utils.toArray('.eyebrow').forEach(el => {
    gsap.from(el, {
      opacity:0, x:-40, duration:0.7, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 88%', toggleActions:'play none none none' }
    });
  });

  gsap.utils.toArray('.section-title').forEach(el => {
    const words = el.innerHTML.split(' ');
    el.innerHTML = words.map(w => `<span class="word-wrap" style="display:inline-block;overflow:hidden"><span class="word" style="display:inline-block">${w}&nbsp;</span></span>`).join('');
    gsap.from(el.querySelectorAll('.word'), {
      y:'100%', opacity:0, duration:0.7, stagger:0.08, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 85%' }
    });
  });

  gsap.utils.toArray('.gold-divider').forEach(el => {
    gsap.from(el, {
      scaleX:0, transformOrigin:'left center', duration:0.8, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 90%' }
    });
  });

  gsap.utils.toArray('.property-card, .feature-card, .blog-card, .testimonial-card, .kpi-card').forEach((el, i) => {
    gsap.from(el, {
      opacity:0, y:50, duration:0.7, delay: i * 0.08, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 88%' }
    });
  });

  document.querySelectorAll('.split-image').forEach(el => {
    gsap.from(el, {
      opacity:0, x: el.closest('.split-section')?.children[0] === el ? -80 : 80,
      duration:1, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 80%' }
    });
  });

  document.querySelectorAll('.split-content').forEach(el => {
    gsap.from(el, {
      opacity:0, x:60, duration:1, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 80%' }
    });
  });

  gsap.utils.toArray('.stat-num').forEach(el => {
    gsap.from(el, {
      opacity:0, scale:0.5, duration:0.6, ease:'back.out(1.5)',
      scrollTrigger: { trigger:el, start:'top 85%' }
    });
  });

  gsap.from('.marquee-strip', { opacity:0, y:30, duration:0.5,
    scrollTrigger:{ trigger:'.marquee-strip', start:'top 95%' }
  });

  gsap.utils.toArray('[data-gsap="fadeUp"]').forEach((el,i) => {
    gsap.to(el, {
      opacity:1, y:0, duration:0.8, delay:i*0.1, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' }
    });
  });
}

/* ── FALLBACK REVEAL (no GSAP) ───────────────────────────── */
function initFallbackReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
}

/* ── 3D CARD TILT ────────────────────────────────────────── */
document.querySelectorAll('.property-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = rect.width / 2,       cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── PROPERTY FILTER ─────────────────────────────────────── */
const filterBtns    = document.querySelectorAll('.filter-btn');
const propertyCards = document.querySelectorAll('[data-type]');
const searchInput   = document.querySelector('#propertySearch');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProperties(btn.dataset.filter || 'all', searchInput?.value || '');
  });
});

searchInput?.addEventListener('input', () => {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  filterProperties(activeFilter, searchInput.value);
});

function filterProperties(type, search) {
  propertyCards.forEach(card => {
    const matchType   = type === 'all' || card.dataset.type === type;
    const matchSearch = !search || card.textContent.toLowerCase().includes(search.toLowerCase());
    card.style.display = matchType && matchSearch ? '' : 'none';
  });
}

/* ── DASHBOARD TABS ──────────────────────────────────────── */
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');
const dashPanels   = document.querySelectorAll('.dash-panel');
const topbarTitle  = document.querySelector('.topbar-title');

sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const target = link.dataset.panel;
    dashPanels.forEach(p => p.classList.remove('active'));
    document.getElementById(target)?.classList.add('active');
    if (topbarTitle) topbarTitle.textContent = link.querySelector('span')?.textContent || 'Dashboard';
  });
});

/* ── AUTH TABS ───────────────────────────────────────────── */
const authTabs  = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form-content');

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    authForms.forEach(f => f.classList.remove('active'));
    document.getElementById(tab.dataset.form)?.classList.add('active');
  });
});

/* ── CHART BARS (dashboard) ──────────────────────────────── */
function initCharts() {
  document.querySelectorAll('.chart-bar').forEach(bar => {
    const h = bar.dataset.height || '60';
    bar.style.height = '0%';
    setTimeout(() => { bar.style.height = h + '%'; }, 300);
  });
}

/* ── TYPEWRITER ──────────────────────────────────────────── */
function typewriter(el) {
  const texts = (el.dataset.typewriter || '').split('|');
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const current = texts[ti];
    el.textContent = deleting ? current.slice(0, ci--) : current.slice(0, ci++);
    if (!deleting && ci > current.length) { deleting = true; setTimeout(tick, 1200); return; }
    if (deleting && ci < 0) { deleting = false; ti = (ti + 1) % texts.length; ci = 0; }
    setTimeout(tick, deleting ? 50 : 80);
  }
  tick();
}
document.querySelectorAll('[data-typewriter]').forEach(typewriter);

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') initGSAP();
  else {
    window.addEventListener('load', () => {
      if (typeof gsap !== 'undefined') initGSAP();
      else initFallbackReveal();
    });
  }
  initCharts();
});

/* ══════════════════════════════════════════════════════════
   NAVIGATION FIX — merged from nav-fix.js
   ══════════════════════════════════════════════════════════ */

/* ── FIELD VALIDATION ────────────────────────────────────── */
function validateField(el, type) {
  var val   = el.value.trim();
  var errEl = document.getElementById('err-' + el.id);
  var msg   = '';

  if (type === 'text') {
    if (!val)               msg = 'This field is required.';
    else if (/[0-9]/.test(val)) msg = 'Numbers are not allowed here.';
  } else if (type === 'phone') {
    if (!val)                            msg = 'Phone number is required.';
    else if (!/^[6-9][0-9]{9}$/.test(val)) msg = 'Enter a valid 10-digit Indian mobile number.';
  } else if (type === 'email') {
    if (!val)                                        msg = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Enter a valid email address.';
  } else if (type === 'select') {
    if (!val) msg = 'Please select an option.';
  } else if (type === 'textarea') {
    if (!val)              msg = 'Message is required.';
    else if (val.length < 10) msg = 'Please provide at least 10 characters.';
  }

  if (errEl) errEl.textContent = msg;
  el.classList.toggle('invalid', !!msg);
  el.classList.toggle('valid',   !msg && !!val);
  return !msg;
}

/* ── SHARED: go to 404 saving exact referrer ─────────────── */
function goTo404() {
  /* Save full URL including any hash so Go Back returns to the
     exact position (e.g. footer section anchor on the same page) */
  sessionStorage.setItem('stackly_ref', window.location.href);
  window.location.href = './404page.html';
}

/* ── REFERRER TRACKING (all <a> → 404 clicks) ───────────── */
document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href]');
  if (!link) return;
  var href = link.getAttribute('href');
  if (href && href.indexOf('404page.html') !== -1) {
    /* Save current URL + scroll position as a hash so Go Back
       returns to the same vertical position on the page         */
    var scrollY  = window.scrollY || window.pageYOffset;
    var base     = window.location.href.split('#')[0];
    var saveUrl  = scrollY > 100 ? base + '#scroll=' + scrollY : base;
    sessionStorage.setItem('stackly_ref', saveUrl);
  }
});

/* ── RESTORE SCROLL POSITION on page load ───────────────── */
(function restoreScroll() {
  var hash = window.location.hash;
  if (hash && hash.indexOf('#scroll=') === 0) {
    var y = parseInt(hash.replace('#scroll=', ''), 10);
    if (!isNaN(y)) {
      /* Remove hash from URL then scroll */
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.addEventListener('load', function () {
        setTimeout(function () { window.scrollTo({ top: y, behavior: 'instant' }); }, 50);
      });
    }
  }
})();

/* ── ENQUIRY FORM (contact.html) ─────────────────────────── */
var enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = [
      { id: 'firstName',        type: 'text'     },
      { id: 'lastName',         type: 'text'     },
      { id: 'phone',            type: 'phone'    },
      { id: 'email',            type: 'email'    },
      { id: 'propertyInterest', type: 'select'   },
      { id: 'budget',           type: 'select'   },
      { id: 'message',          type: 'textarea' },
    ];
    var allValid = true;
    fields.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (el && !validateField(el, f.type)) allValid = false;
    });
    if (allValid) goTo404();
  });
}

/* ── HERO VISIT FORM (index.html) ────────────────────────── */
function hvValidate(el, type) {
  var val   = el.value.trim();
  var errEl = document.getElementById('err-' + el.id);
  var msg   = '';
  if (type === 'text') {
    if (!val)              msg = 'Full name is required.';
    else if (val.length < 2) msg = 'Enter a valid name.';
  } else if (type === 'phone') {
    if (!val)                            msg = 'Phone number is required.';
    else if (!/^[6-9][0-9]{9}$/.test(val)) msg = 'Enter a valid 10-digit mobile number.';
  } else if (type === 'email') {
    if (!val)                                        msg = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Enter a valid email address.';
  } else if (type === 'select') {
    if (!val) msg = 'Please select a property type.';
  }
  if (errEl) errEl.textContent = msg;
  el.classList.toggle('invalid', !!msg);
  el.classList.toggle('valid',   !msg && !!val);
  return !msg;
}
window.hvValidate = hvValidate;

var heroForm = document.getElementById('heroVisitForm');
if (heroForm) {
  heroForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = [
      { id: 'hv-name',  type: 'text'   },
      { id: 'hv-phone', type: 'phone'  },
      { id: 'hv-email', type: 'email'  },
      { id: 'hv-type',  type: 'select' },
    ];
    var allValid = true;
    fields.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (el && !hvValidate(el, f.type)) allValid = false;
    });
    if (allValid) goTo404();
  });
}

/* ── NEWSLETTER FORM (blog.html) ─────────────────────────── */
function nlValidate(el, type) {
  var val   = el.value.trim();
  var errEl = document.getElementById('err-' + el.id);
  var msg   = '';
  if (type === 'text') {
    if (!val)              msg = 'Name is required.';
    else if (val.length < 2) msg = 'Enter a valid name.';
  } else if (type === 'email') {
    if (!val)                                        msg = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Enter a valid email address.';
  }
  if (errEl) errEl.textContent = msg;
  el.classList.toggle('invalid', !!msg);
  el.classList.toggle('valid',   !msg && !!val);
  return !msg;
}
window.nlValidate = nlValidate;

var newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameOk  = nlValidate(document.getElementById('nl-name'),  'text');
    var emailOk = nlValidate(document.getElementById('nl-email'), 'email');
    if (nameOk && emailOk) goTo404();
  });
}

/* =============================================
   PORTFOLIO — script.js
   All interactions & animations
   ============================================= */

'use strict';

/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initProjectFilter();
  initSmoothScroll();
});

/* ─────────────────────────────────────────────
   1. LOADER
───────────────────────────────────────────── */
function initLoader() {
  const loader  = document.getElementById('loader');
  const barFill = document.getElementById('lbar-fill');
  const pct     = document.getElementById('lpct');

  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.cursor = 'none';
        startHeroAnimation();
      }, 300);
    }
    barFill.style.width = progress + '%';
    pct.textContent     = Math.floor(progress) + '%';
  }, 80);
}

/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');

  if (!cursor || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Trail lags behind
  (function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  })();

  // Scale on hover over links/buttons
  const interactives = document.querySelectorAll('a, button, .proj-card, .skill-block, .ac-resume');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform  = 'translate(-50%, -50%) scale(2)';
      cursor.style.background = 'var(--ink)';
      trail.style.opacity     = '0';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform  = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'var(--accent)';
      trail.style.opacity     = '0.5';
    });
  });
}

/* ─────────────────────────────────────────────
   3. NAVBAR SCROLL EFFECT
───────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   4. MOBILE MENU
───────────────────────────────────────────── */
function initMobileMenu() {
  const btn   = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    links.style.display = open ? 'flex' : '';
    if (open) {
      links.style.flexDirection  = 'column';
      links.style.position       = 'absolute';
      links.style.top            = '100%';
      links.style.left           = '0';
      links.style.right          = '0';
      links.style.background     = 'var(--surface)';
      links.style.padding        = '1.5rem 2rem';
      links.style.borderBottom   = '1px solid var(--border)';
      links.style.gap            = '1.5rem';
    }
    // Animate hamburger → X
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on nav link click
  links.querySelectorAll('.nav-a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      links.style.display = '';
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ─────────────────────────────────────────────
   5. SCROLL REVEAL
───────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   6. HERO ANIMATION (on loader done)
───────────────────────────────────────────── */
function startHeroAnimation() {
  // Stagger hero heading lines
  document.querySelectorAll('.h-line').forEach((line, i) => {
    line.style.opacity   = '0';
    line.style.transform = 'translateY(40px)';
    line.style.transition = `opacity .6s ${i * .12}s ease, transform .6s ${i * .12}s cubic-bezier(.22,1,.36,1)`;
    setTimeout(() => {
      line.style.opacity   = '1';
      line.style.transform = 'translateY(0)';
    }, 50);
  });

  // Fade in hero other elements
  const fadeEls = document.querySelectorAll('.hero-badge, .hero-scroll-hint, .hero-intro, .hero-counters');
  fadeEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .6s ${.5 + i * .1}s ease, transform .6s ${.5 + i * .1}s ease`;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });

  // Start counters after hero appears
  setTimeout(initCounters, 800);
}

/* ─────────────────────────────────────────────
   7. COUNTERS
───────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.c-num');
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    let current  = 0;
    const step   = Math.ceil(target / 40);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      counter.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* ─────────────────────────────────────────────
   8. SKILL BARS (animate on scroll)
───────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.sb-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar     = entry.target;
        const width   = bar.dataset.w;
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ─────────────────────────────────────────────
   9. PROJECT FILTER
───────────────────────────────────────────── */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.pf');
  const cards   = document.querySelectorAll('.proj-card');

  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        if (filter === 'all' || tags.includes(filter)) {
          card.classList.remove('hidden');
          // Stagger reveal
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.97)';
          setTimeout(() => {
            card.style.transition = 'opacity .3s ease, transform .3s ease';
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ─────────────────────────────────────────────
   10. CONTACT FORM
───────────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const submit = document.getElementById('cfSubmit');
  const text   = document.getElementById('cfText');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simulate send
    submit.disabled = true;
    text.textContent = 'Sending...';
    submit.style.opacity = '.7';

    setTimeout(() => {
      submit.disabled     = false;
      submit.style.opacity = '1';
      submit.classList.add('sent');
      text.textContent    = '✓ Message Sent!';

      // Reset after 3s
      setTimeout(() => {
        submit.classList.remove('sent');
        text.textContent = 'Send Message';
        form.reset();
      }, 3000);
    }, 1400);
  });
}

/* ─────────────────────────────────────────────
   11. SMOOTH SCROLL (for nav links)
───────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─────────────────────────────────────────────
   12. ACTIVE NAV HIGHLIGHT on scroll
───────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-a');
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active-nav');
    }
  });
}, { passive: true });

// ── CURSOR GLOW ──
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── NAV: shrink on scroll + mobile toggle ──
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── FADE IN ON SCROLL ──
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ── SKILL BARS ──
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) barObserver.observe(skillsSection);

// ── PROJECT FILTERS ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// ── CONTACT FORM (Netlify + JS feedback) ──
const form = document.querySelector('.contact-form');
const status = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span style="letter-spacing:1px">Sending…</span>';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = '✓ Message sent! I\'ll get back to you as soon as possible.';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = '✗ Something went wrong. Please email me directly at khaleedolawale66@gmail.com';
    }

    btn.innerHTML = originalText;
    btn.disabled = false;

    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// ── CERTIFICATE LIGHTBOX ──
const certWrap = document.querySelector('.cert-image-wrap');
if (certWrap) {
  certWrap.addEventListener('click', () => {
    const img = certWrap.querySelector('.cert-image');
    if (!img || img.style.display === 'none') return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:999;
      background:rgba(0,0,0,0.92);
      display:flex; align-items:center; justify-content:center;
      cursor:zoom-out; padding:24px;
    `;

    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.cssText = `
      max-width:90vw; max-height:88vh;
      object-fit:contain; border:1px solid rgba(255,255,255,0.1);
    `;

    const close = document.createElement('div');
    close.textContent = '✕  Close';
    close.style.cssText = `
      position:absolute; top:20px; right:24px;
      color:rgba(255,255,255,0.5); font-size:12px;
      letter-spacing:2px; cursor:pointer; font-family:monospace;
    `;

    overlay.appendChild(bigImg);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeLightbox = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };

    overlay.addEventListener('click', closeLightbox);
    close.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); }, { once: true });
  });
}

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

// ── FEATURED PROJECT SCREENSHOT TABS ──
const ssTabs = document.querySelectorAll('.ss-tab');
const ssImg  = document.getElementById('ssImg');

const ssMap = {
  admin:   'images/projects/hospital-admin.png',
  doctor:  'images/projects/hospital-doctor.png',
  patient: 'images/projects/hospital-patient.png'
};

ssTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    ssTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (ssImg) {
      ssImg.style.opacity = '0';
      setTimeout(() => {
        ssImg.src = ssMap[tab.dataset.tab];
        ssImg.alt = tab.textContent;
        ssImg.style.opacity = '1';
      }, 200);
    }
  });
});

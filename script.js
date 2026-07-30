/* ============================================
   TABLE OF CONTENTS
   1. DOM Cache
   2. Planet Cursor
   3. Cosmic Ripple
   4. Rocket Navigation
   5. Constellation Background
   6. Galaxy Particle System
   7. Shooting Stars
   8. Nebula Parallax
   9. Theme Toggle
   10. Typing Animation
   11. Scroll Reveal
   12. Progress Bars
   13. Testimonial Slider
   14. Mobile Menu
   15. Nav Highlight
   16. 3D Tilt
   17. Smooth Scroll
   18. Download CV
   19. Init
   ============================================ */

/* ===== 1. DOM CACHE ===== */
const DOM = {
  planetCursor: document.getElementById('planetCursor'),
  planetOrbit: document.getElementById('planetOrbit'),
  cursorSparkles: document.getElementById('cursorSparkles'),
  cursorGlow: document.getElementById('cursorGlow'),
  cosmicRippleContainer: document.getElementById('cosmicRippleContainer'),
  navRocket: document.getElementById('navRocket'),
  rocketExhaust: document.getElementById('rocketExhaust'),
  constellationCanvas: document.getElementById('constellationCanvas'),
  themeToggle: document.getElementById('themeToggle'),
  typingText: document.getElementById('typingText'),
  navbar: document.getElementById('navbar'),
  navLinks: document.getElementById('navLinks'),
  hamburger: document.getElementById('hamburger'),
  sliderTrack: document.getElementById('sliderTrack'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  sliderDots: document.getElementById('sliderDots'),
  particleCanvas: document.getElementById('particleCanvas'),
  shootingStars: document.getElementById('shootingStars'),
  backToTop: document.getElementById('backToTop'),
  bttExhaust: document.getElementById('bttExhaust'),
  cometContainer: document.getElementById('cometContainer'),
  downloadBtns: document.querySelectorAll('#downloadCV, #heroDownloadCV'),
  navAllLinks: document.querySelectorAll('.nav-link'),
};

/* ===== 2. PLANET CURSOR ===== */
function initPlanetCursor() {
  const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReduced) return;

  const cursor = DOM.planetCursor;
  const body = cursor.querySelector('.planet-cursor-body');
  const orbit = DOM.planetOrbit;
  const sparkles = DOM.cursorSparkles;
  const glow = DOM.cursorGlow;

  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';

    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';

    requestAnimationFrame(animate);
  }
  animate();

  // Hover effects
  const interactiveEls = document.querySelectorAll('a, button, .social-link, .service-card, .project-card, .contact-card, .stat-card, .nav-link');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
    });
  });

  // Sparkles on hover
  let sparkleTimeout;
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      createSparkles();
      sparkleTimeout = setInterval(createSparkles, 150);
    });
    el.addEventListener('mouseleave', () => {
      clearInterval(sparkleTimeout);
    });
  });

  function createSparkles() {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'cursor-sparkle';
      const angle = Math.random() * Math.PI * 2;
      const dist = 15 + Math.random() * 20;
      s.style.left = (Math.cos(angle) * dist) + 'px';
      s.style.top = (Math.sin(angle) * dist) + 'px';
      s.style.animationDelay = (Math.random() * 0.2) + 's';
      sparkles.appendChild(s);
      setTimeout(() => s.remove(), 800);
    }
  }

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    glow.style.opacity = '1';
  });
}

/* ===== 3. COSMIC RIPPLE ===== */
function initCosmicRipple() {
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cosmic-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    DOM.cosmicRippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 900);

    // Extra particles
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute; left: ${e.clientX}px; top: ${e.clientY}px;
        width: ${2 + Math.random() * 4}px; height: ${2 + Math.random() * 4}px;
        border-radius: 50%;
        background: ${i % 2 === 0 ? '#6C63FF' : '#00D9FF'};
        pointer-events: none;
        animation: explosionBurst 0.8s ease-out forwards;
        --tx: ${(Math.random() - 0.5) * 120}px;
        --ty: ${(Math.random() - 0.5) * 120}px;
      `;
      DOM.cosmicRippleContainer.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  });
}

/* ===== 4. ROCKET NAVIGATION ===== */
function initRocketNav() {
  const rocket = DOM.navRocket;
  const exhaust = DOM.rocketExhaust;

  function launchRocket(fromX, fromY, toY) {
    const startX = fromX;
    const startY = fromY;
    const endY = toY;
    const duration = 1200;
    const startTime = performance.now();

    let trailInterval;

    function emitTrail() {
      const t = document.createElement('div');
      t.className = 'rocket-trail-particle';
      const rect = rocket.getBoundingClientRect();
      t.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 6) + 'px';
      t.style.top = (rect.bottom + Math.random() * 10) + 'px';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 700);
    }

    rocket.classList.add('active');
    rocket.style.left = startX + 'px';
    rocket.style.top = startY + 'px';

    trailInterval = setInterval(emitTrail, 50);

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentY = startY + (endY - startY) * eased;
      rocket.style.top = currentY + 'px';

      // Produce more trail near start
      if (progress < 0.3 && Math.random() > 0.5) {
        emitTrail();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clearInterval(trailInterval);
        createCosmicExplosion(startX, endY);
        rocket.classList.remove('active');
      }
    }

    requestAnimationFrame(animate);
  }

  function createCosmicExplosion(x, y) {
    const container = document.createElement('div');
    container.className = 'cosmic-explosion';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    document.body.appendChild(container);

    const colors = ['#6C63FF', '#00D9FF', '#FF6B9D', '#FFB800', '#fff'];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'explosion-particle';
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
      const dist = 30 + Math.random() * 70;
      const size = 2 + Math.random() * 5;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        box-shadow: 0 0 ${size * 3}px ${colors[Math.floor(Math.random() * colors.length)]};
        --tx: ${Math.cos(angle) * dist}px;
        --ty: ${Math.sin(angle) * dist}px;
      `;
      container.appendChild(p);
    }

    setTimeout(() => container.remove(), 1200);
  }

  // Intercept nav link clicks
  DOM.navAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const rect = link.getBoundingClientRect();
      const fromX = rect.left + rect.width / 2;
      const fromY = rect.top + rect.height / 2;

      const navHeight = DOM.navbar.offsetHeight;
      const targetPos = target.offsetTop - navHeight;
      const toY = 60; // near top of viewport

      launchRocket(fromX, fromY, toY);

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });
}

/* ===== 5. CONSTELLATION BACKGROUND ===== */
function initConstellation() {
  const canvas = DOM.constellationCanvas;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let connections = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class ConstellationStar {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulseSpeed = Math.random() * 0.01 + 0.003;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    draw(time) {
      const o = this.opacity * (0.7 + 0.3 * Math.sin(time * this.pulseSpeed + this.pulseOffset));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${o})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    stars = [];
    connections = [];
    const count = Math.min(Math.floor(canvas.width * canvas.height / 15000), 80);
    for (let i = 0; i < count; i++) {
      stars.push(new ConstellationStar());
    }

    // Create connections
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && Math.random() > 0.85) {
          connections.push({ i, j, dist });
        }
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(c => {
      const s1 = stars[c.i];
      const s2 = stars[c.j];
      const o = 0.15 * (1 - c.dist / 150);
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.strokeStyle = `rgba(108, 99, 255, ${o})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    stars.forEach(s => s.draw(time));
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  init();
  animate(0);
}

/* ===== 6. GALAXY PARTICLE SYSTEM ===== */
function initGalaxyParticles() {
  const canvas = DOM.particleCanvas;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let time = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class GalaxyParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.speedY = (Math.random() - 0.5) * 0.15;
      this.opacity = Math.random() * 0.5 + 0.05;
      this.hue = Math.random() > 0.4 ? 250 : 190;
      this.lightness = 50 + Math.random() * 30;
      this.pulseSpeed = Math.random() * 0.015 + 0.003;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.layer = Math.floor(Math.random() * 3); // 0=far, 1=mid, 2=near
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.3;
          this.x += (dx / dist) * force * (this.layer + 1) * 0.3;
          this.y += (dy / dist) * force * (this.layer + 1) * 0.3;
        }
      }

      if (this.x < -20) this.x = canvas.width + 20;
      if (this.x > canvas.width + 20) this.x = -20;
      if (this.y < -20) this.y = canvas.height + 20;
      if (this.y > canvas.height + 20) this.y = -20;

      this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(time * this.pulseSpeed + this.pulseOffset));
    }

    draw() {
      const o = this.currentOpacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 60%, ${this.lightness}%, ${o})`;
      ctx.fill();

      if (this.size > 1.8) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 60%, ${this.lightness}%, ${o * 0.08})`;
        ctx.fill();
      }
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(canvas.width * canvas.height / 6000), 160);
    for (let i = 0; i < count; i++) {
      particles.push(new GalaxyParticle());
    }
  }

  function animate(t) {
    time = t * 0.001;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  init();
  animate(0);
}

/* ===== 7. SHOOTING STARS ===== */
function initShootingStars() {
  const container = DOM.shootingStars;
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 30 + '%';
    star.style.left = (70 + Math.random() * 25) + '%';
    star.style.animationDuration = (3 + Math.random() * 4) + 's';
    star.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(star);
  }
}

/* ===== 8. NEBULA PARALLAX ===== */
function initNebulaParallax() {
  const nebulas = document.querySelectorAll('.nebula-layer, .galaxy-layer, .floating-planet');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        nebulas.forEach((el, i) => {
          const speed = 0.02 + i * 0.01;
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===== 9. THEME TOGGLE ===== */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  DOM.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ===== 10. TYPING ANIMATION ===== */
function initTyping() {
  const words = ['Flutter Developer', 'Mobile App Builder', 'UI/UX Designer'];
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const current = words[wordIndex];
    if (!isDeleting) {
      DOM.typingText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
        return;
      }
    } else {
      DOM.typingText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; }
    }
    setTimeout(type, isDeleting ? 40 : 80);
  }
  type();
}

/* ===== 11. SCROLL REVEAL ===== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-text, .reveal-scale, .reveal-slide-left, .reveal-slide-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Stagger
  document.querySelectorAll('.stats-row, .services-container, .projects-container, .skills-container').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 0.12) + 's';
    });
  });
}

/* ===== 12. PROGRESS BARS ===== */
function initProgressBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(f => {
          f.style.width = f.getAttribute('data-width') + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-card').forEach(c => observer.observe(c));
}

/* ===== 13. TESTIMONIAL SLIDER ===== */
function initSlider() {
  const track = DOM.sliderTrack;
  const cards = track.querySelectorAll('.testimonial-card');
  const dots = DOM.sliderDots;
  let current = 0;
  let autoplay;
  const total = cards.length;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  function goTo(i) {
    current = i;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.querySelectorAll('.slider-dot').forEach((d, j) => d.classList.toggle('active', j === current));
  }

  function next() { goTo((current + 1) % total); }
  function prev() { goTo((current - 1 + total) % total); }

  function start() { stop(); autoplay = setInterval(next, 4000); }
  function stop() { clearInterval(autoplay); }

  DOM.nextBtn.addEventListener('click', () => { next(); start(); });
  DOM.prevBtn.addEventListener('click', () => { prev(); start(); });

  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  let startX = 0, dragging = false;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dragging = true; stop(); }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    if (!dragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    dragging = false;
    start();
  }, { passive: true });

  start();
}

/* ===== 14. MOBILE MENU ===== */
function initMobileMenu() {
  DOM.hamburger.addEventListener('click', () => {
    DOM.hamburger.classList.toggle('active');
    DOM.navLinks.classList.toggle('open');
    DOM.hamburger.setAttribute('aria-expanded', DOM.navLinks.classList.contains('open'));
  });

  DOM.navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      DOM.hamburger.classList.remove('active');
      DOM.navLinks.classList.remove('open');
      DOM.hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== 15. NAV HIGHLIGHT ===== */
function initNavHighlight() {
  const sections = document.querySelectorAll('.section[id]');
  const links = document.querySelectorAll('.nav-link');

  function update() {
    let current = '';
    const pos = window.scrollY + 150;
    sections.forEach(s => {
      const top = s.offsetTop;
      const bottom = top + s.offsetHeight;
      if (pos >= top && pos < bottom) current = s.getAttribute('id');
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ===== 16. 3D TILT ===== */
function initTilt() {
  document.querySelectorAll('.project-card, .education-card, .experience-card, .service-card, .stat-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ===== 17. SMOOTH SCROLL ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - DOM.navbar.offsetHeight, behavior: 'smooth' });
      }
    });
  });
}

/* ===== 18. DOWNLOAD CV ===== */
function initDownloadCV() {
  DOM.downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('CV download will be available soon. Stay tuned!');
    });
  });
}

/* ===== 19. BACK TO TOP ROCKET ===== */
function initBackToTop() {
  const btn = DOM.backToTop;
  let isLaunching = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    if (isLaunching) return;
    isLaunching = true;

    btn.classList.add('launching');

    // Spawn trail particles
    let trailInterval = setInterval(() => {
      if (!btn.classList.contains('launching')) {
        clearInterval(trailInterval);
        return;
      }
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 3; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
          position: fixed; left: ${cx + (Math.random() - 0.5) * 10}px; top: ${cy + 10}px;
          width: ${2 + Math.random() * 3}px; height: ${2 + Math.random() * 3}px;
          border-radius: 50%;
          background: ${['#6C63FF', '#00D9FF', '#fff'][Math.floor(Math.random() * 3)]};
          pointer-events: none; z-index: 9998;
          animation: explosionBurst 0.8s ease-out forwards;
          --tx: ${(Math.random() - 0.5) * 30}px;
          --ty: ${10 + Math.random() * 20}px;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 900);
      }
    }, 80);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      clearInterval(trailInterval);
      btn.classList.remove('launching');
      isLaunching = false;

      // Sparkle finish at top
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('div');
        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 120;
        const y = 60 + (Math.random() - 0.5) * 60;
        s.style.cssText = `
          position: fixed; left: ${x}px; top: ${y}px;
          width: ${2 + Math.random() * 4}px; height: ${2 + Math.random() * 4}px;
          border-radius: 50%;
          background: ${['#FFD700', '#6C63FF', '#00D9FF', '#fff'][Math.floor(Math.random() * 4)]};
          pointer-events: none; z-index: 9998;
          box-shadow: 0 0 ${6 + Math.random() * 8}px currentColor;
          animation: explosionBurst 0.6s ease-out forwards;
          --tx: ${(Math.random() - 0.5) * 80}px;
          --ty: ${(Math.random() - 0.5) * 80}px;
        `;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 700);
      }
    }, 1200);
  });
}

/* ===== 20. COMETS ===== */
function initComets() {
  const container = DOM.cometContainer;

  function spawnComet() {
    const comet = document.createElement('div');
    comet.className = 'comet';
    comet.style.top = (2 + Math.random() * 15) + '%';
    comet.style.right = (5 + Math.random() * 15) + '%';

    const head = document.createElement('div');
    head.className = 'comet-head';
    const tail = document.createElement('div');
    tail.className = 'comet-tail';

    comet.appendChild(head);
    comet.appendChild(tail);
    container.appendChild(comet);

    setTimeout(() => comet.remove(), 2800);
  }

  // Spawn every 8-15 seconds
  function scheduleNext() {
    const delay = 8000 + Math.random() * 12000;
    setTimeout(() => {
      spawnComet();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
}

/* ===== 21. CARD BORDER GLOW ===== */
function initCardBorderGlow() {
  const cards = document.querySelectorAll(
    '.education-card, .experience-card, .project-card, .service-card, .testimonial-card, .stat-card, .contact-card'
  );
  cards.forEach(card => card.classList.add('card-border-glow'));
}

/* ===== 19. INIT ===== */
function init() {
  initPlanetCursor();
  initCosmicRipple();
  initRocketNav();
  initConstellation();
  initGalaxyParticles();
  initShootingStars();
  initComets();
  initNebulaParallax();
  initTheme();
  initTyping();
  initScrollReveal();
  initProgressBars();
  initSlider();
  initMobileMenu();
  initNavHighlight();
  initTilt();
  initSmoothScroll();
  initDownloadCV();
  initBackToTop();
  initCardBorderGlow();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
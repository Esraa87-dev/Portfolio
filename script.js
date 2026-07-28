/* ============================================
   TABLE OF CONTENTS
   1. DOM Cache
   2. Custom Cursor
   3. Theme Toggle (Dark / Light)
   4. Typing Animation
   5. Particle Background (Canvas)
   6. Shooting Stars
   7. Scroll Reveal Animations
   8. Animated Progress Bars
   9. Testimonial Slider
   10. Mobile Hamburger Menu
   11. Active Nav Link Highlight
   12. 3D Tilt Effect on Cards
   13. Parallax Background
   14. Smooth Scroll Polyfill
   15. Download CV Handler
   16. Init
   ============================================ */

/* ===== 1. DOM CACHE ===== */
const DOM = {
  cursorGlow: document.getElementById('cursorGlow'),
  cursorDot: document.getElementById('cursorDot'),
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
  downloadBtns: document.querySelectorAll('#downloadCV, #heroDownloadCV'),
};

/* ===== 2. CUSTOM CURSOR ===== */
function initCursor() {
  const isTouchDevice = matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouchDevice) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;

    DOM.cursorGlow.style.left = glowX + 'px';
    DOM.cursorGlow.style.top = glowY + 'px';
    DOM.cursorDot.style.left = dotX + 'px';
    DOM.cursorDot.style.top = dotY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Magnetic hover on buttons & links
  document.querySelectorAll('a, button, .social-link, .service-card, .project-card, .contact-card, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      DOM.cursorDot.style.width = '16px';
      DOM.cursorDot.style.height = '16px';
      DOM.cursorDot.style.background = 'var(--accent)';
    });
    el.addEventListener('mouseleave', () => {
      DOM.cursorDot.style.width = '8px';
      DOM.cursorDot.style.height = '8px';
      DOM.cursorDot.style.background = 'var(--primary)';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    DOM.cursorGlow.style.opacity = '0';
    DOM.cursorDot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    DOM.cursorGlow.style.opacity = '1';
    DOM.cursorDot.style.opacity = '1';
  });
}

/* ===== 3. THEME TOGGLE ===== */
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  DOM.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ===== 4. TYPING ANIMATION ===== */
function initTyping() {
  const words = ['Flutter Developer', 'Mobile App Builder', 'UI/UX Designer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      DOM.typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, 2000);
        return;
      }
    } else {
      DOM.typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    const speed = isDeleting ? 40 : 80;
    setTimeout(type, speed);
  }

  type();
}

/* ===== 5. PARTICLE BACKGROUND (Canvas) ===== */
function initParticles() {
  const canvas = DOM.particleCanvas;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 250 : 190; // purple or blue
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction - gentle push
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.5;
          this.x += dx / dist * force;
          this.y += dy / dist * force;
        }
      }

      // Wraparound
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;

      // Pulse opacity
      this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(time * this.pulseSpeed + this.pulseOffset));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.currentOpacity})`;
      ctx.fill();

      // Glow
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.currentOpacity * 0.15})`;
        ctx.fill();
      }
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(canvas.width * canvas.height / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update(time);
      p.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  init();
  animate(0);
}

/* ===== 6. SHOOTING STARS ===== */
function initShootingStars() {
  const container = DOM.shootingStars;
  const count = 5;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 30 + '%';
    star.style.left = (70 + Math.random() * 25) + '%';
    star.style.animationDuration = (3 + Math.random() * 4) + 's';
    star.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(star);
  }
}

/* ===== 7. SCROLL REVEAL ANIMATIONS ===== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-text, .reveal-scale, .reveal-slide-left, .reveal-slide-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Stagger children
  document.querySelectorAll('.stats-row, .services-container, .projects-container, .skills-container').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
      child.style.transitionDelay = (index * 0.1) + 's';
    });
  });
}

/* ===== 8. ANIMATED PROGRESS BARS ===== */
function initProgressBars() {
  const skillCards = document.querySelectorAll('.skill-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const width = fill.getAttribute('data-width');
          fill.style.width = width + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => observer.observe(card));
}

/* ===== 9. TESTIMONIAL SLIDER ===== */
function initSlider() {
  const track = DOM.sliderTrack;
  const cards = track.querySelectorAll('.testimonial-card');
  const dotsContainer = DOM.sliderDots;
  let currentIndex = 0;
  let autoplayInterval;
  const totalSlides = cards.length;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % totalSlides);
  }

  function prevSlide() {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  DOM.nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  DOM.prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

  // Pause on hover
  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Touch swipe support
  let startX = 0;
  let isDragging = false;

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }

    isDragging = false;
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}

/* ===== 10. MOBILE HAMBURGER MENU ===== */
function initMobileMenu() {
  DOM.hamburger.addEventListener('click', () => {
    DOM.hamburger.classList.toggle('active');
    DOM.navLinks.classList.toggle('open');
    const isOpen = DOM.navLinks.classList.contains('open');
    DOM.hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  DOM.navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      DOM.hamburger.classList.remove('active');
      DOM.navLinks.classList.remove('open');
      DOM.hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== 11. ACTIVE NAV LINK HIGHLIGHT ===== */
function initNavHighlight() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ===== 12. 3D TILT EFFECT ON CARDS ===== */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll('.project-card, .education-card, .experience-card, .service-card, .stat-card, .testimonial-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ===== 13. PARALLAX BACKGROUND ===== */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = hero.querySelector('.hero-content');
    const heroImage = hero.querySelector('.hero-image-wrapper');

    if (scrollY < window.innerHeight) {
      const parallaxOffset = scrollY * 0.15;
      if (heroContent) heroContent.style.transform = `translateY(${parallaxOffset}px)`;
      if (heroImage) heroImage.style.transform = `translateY(${parallaxOffset * 0.5}px)`;
    }
  }, { passive: true });
}

/* ===== 14. SMOOTH SCROLL POLYFILL ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = DOM.navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ===== 15. DOWNLOAD CV HANDLER ===== */
function initDownloadCV() {
  DOM.downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Placeholder - replace with actual CV file URL when available
      alert('CV download will be available soon. Stay tuned!');
    });
  });
}

/* ===== 16. INIT ===== */
function init() {
  initCursor();
  initTheme();
  initTyping();
  initParticles();
  initShootingStars();
  initScrollReveal();
  initProgressBars();
  initSlider();
  initMobileMenu();
  initNavHighlight();
  initTiltEffect();
  initParallax();
  initSmoothScroll();
  initDownloadCV();
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

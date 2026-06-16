/* =============================================
   AnnshiVerse — main.js
   ============================================= */

/* ── NAV: scroll shrink + mobile toggle ── */
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu  = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── PARTICLE CANVAS (hero only) ── */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  const COLORS = [
    'rgba(240,98,146,',
    'rgba(192,132,252,',
    'rgba(251,191,138,',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x:   Math.random() * W,
        y:   Math.random() * H,
        r:   Math.random() * 3 + 1,
        dx:  (Math.random() - 0.5) * 0.3,
        dy: -(Math.random() * 0.4 + 0.1),
        a:   Math.random() * 0.5 + 0.1,
        da: (Math.random() - 0.5) * 0.002,
        col: c,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x  += p.dx;
      p.y  += p.dy;
      p.a  += p.da;
      if (p.a > 0.65) p.da *= -1;
      if (p.a < 0.05) p.da  = Math.abs(p.da);
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.a + ')';
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(() => {
    resize();
    createParticles(Math.floor((W * H) / 14000));
  });
  ro.observe(canvas.parentElement);

  resize();
  createParticles(Math.floor((W * H) / 14000));
  draw();

  // Pause when hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}

// ============================================================
// Diana Khajieva — Site interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    if (!progress) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
  };

  /* ---------- Nav: shrink + active link + mobile toggle ---------- */
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const updateNav = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
      if (navToggle) navToggle.classList.remove('open');
    });
  });

  if (sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => link.classList.toggle('active', link.dataset.section === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Skill bars fill on scroll ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.dataset.level;
        const fill = bar.querySelector('.skill-fill');
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------- GPA ring fill on scroll ---------- */
  const rings = document.querySelectorAll('.ring-fill');
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ring = entry.target;
        const offset = ring.dataset.offset;
        requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
        ringObserver.unobserve(ring);
      }
    });
  }, { threshold: 0.4 });
  rings.forEach(r => ringObserver.observe(r));

  /* ---------- Hero role typing effect ---------- */
  const roleTypeEl = document.getElementById('roleType');
  if (roleTypeEl) {
    const roles = ['Data Analyst', 'Data Analytics Professional', 'Power BI Specialist', 'SQL & Python Enthusiast'];
    let ri = 0, ci = 0, deleting = false;

    const tick = () => {
      const current = roles[ri];
      if (!deleting) {
        ci++;
        roleTypeEl.textContent = current.slice(0, ci);
        if (ci === current.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        ci--;
        roleTypeEl.textContent = current.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
  }

  /* ---------- Experience accordion ---------- */
  document.querySelectorAll('.timeline-content').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.closest('.timeline-item');
      parent.classList.toggle('open');
    });
  });

  /* ---------- Award flip cards ---------- */
  document.querySelectorAll('.badge-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  const updateToTop = () => { if (toTop) toTop.classList.toggle('visible', window.scrollY > 600); };
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Parallax backgrounds ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const offset = (rect.top - vh / 2) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  /* ---------- Scroll listeners (throttled via rAF) ---------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        updateToTop();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateProgress();
  updateNav();
  updateToTop();
  updateParallax();
});

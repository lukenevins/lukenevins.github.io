/* =============================================
   LUKE NEVINS — Personal Website v3
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  restoreChecklistState();
  initChecklist();
  initScrollAnimations();
  initTypewriter();
  initSmoothScroll();
});

/* ── 1. Typewriter ─────────────────────────── */
function initTypewriter() {
  const ITEMS = [
    'an AI automated email grader for my business frat',
    'a paper on the sanity condition of free will',
    'giving a speech about responsibility',
    'a paper on whether ChatGPT is intelligent',
    'reading philosophy articles',
    'building events for my composting client',
    'leading a client engagement',
    'a random side-project',
    'BFI homework',
    'a speech about problem gambling',
    'grading resumes',
    'building a slide deck',
    'studying for an exam',
    'learning a new skill',
    'researching B corps',
    'taking notes (or trying to)',
    'mentoring pledges',
    'helping out friends',
    'switching to claude',
    'another random side-project',
    'building an AI nutrition model',
    'applying for something new (again)',
    'creating this website',
  ];
  const OUTRO = "...but that's boring. Scroll down for the good stuff ↓";

  const SPEEDS = { type: 25, erase: 15, hold: 400, pause: 150, outro: 50 };

  const textEl   = document.getElementById('hero-text');
  const cursorEl = document.getElementById('hero-cursor');

  if (!textEl || !cursorEl) return;

  let itemIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let done       = false;

  function tick() {
    if (done) return;

    const isOutro    = itemIndex >= ITEMS.length;
    const current    = isOutro ? OUTRO : ITEMS[itemIndex];
    const fullLength = current.length;

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      textEl.textContent = current.slice(0, charIndex);

      if (charIndex === fullLength) {
        if (isOutro) {
          // Land permanently with tan/cream color
          done = true;
          textEl.style.color = '#d4b896';
          cursorEl.style.display = 'none';
          return;
        }
        // Hold, then start deleting
        setTimeout(() => {
          isDeleting = true;
          tick();
        }, SPEEDS.hold);
        return;
      }
    } else {
      // Deleting
      charIndex--;
      textEl.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        itemIndex++;
        setTimeout(tick, SPEEDS.pause);
        return;
      }
    }

    const speed = isDeleting ? SPEEDS.erase : (isOutro ? SPEEDS.outro : SPEEDS.type);
    setTimeout(tick, speed);
  }

  // Small initial delay before starting
  setTimeout(tick, 400);
}

/* ── 2. Checklist ──────────────────────────── */
const LS_KEY = 'luke-site-checklist-v3';

function restoreChecklistState() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    document.querySelectorAll('.checklist__btn').forEach(btn => {
      if (saved[btn.dataset.key]) {
        btn.closest('.checklist__item').classList.add('checklist__item--done');
        btn.setAttribute('aria-pressed', 'true');
      }
    });
  } catch (e) { /* silent */ }
}

function initChecklist() {
  const grid = document.getElementById('card-grid');
  if (!grid) return;

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.checklist__btn');
    if (!btn) return;

    const item   = btn.closest('.checklist__item');
    const isDone = item.classList.toggle('checklist__item--done');
    btn.setAttribute('aria-pressed', isDone ? 'true' : 'false');

    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      if (isDone) {
        saved[btn.dataset.key] = true;
      } else {
        delete saved[btn.dataset.key];
      }
      localStorage.setItem(LS_KEY, JSON.stringify(saved));
    } catch (e) { /* silent */ }
  });
}

/* ── 3. Scroll Animations ──────────────────── */
function initScrollAnimations() {
  const cards = document.querySelectorAll('[data-animate]');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const index = parseInt(el.dataset.animateIndex || '0', 10);
        const delay = (index % 3) * 60;

        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);

        observer.unobserve(el);
      }
    });
  }, {
    threshold:  0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  cards.forEach((card, i) => {
    card.dataset.animateIndex = i;
    observer.observe(card);
  });

  // Hero card has no data-animate — mark it visible for hover
  const hero = document.querySelector('.card--hero');
  if (hero) hero.classList.add('is-visible');
}

/* ── 4. Smooth Scroll ──────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

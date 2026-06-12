const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const revealItems = document.querySelectorAll('[data-reveal]');
const parallaxItems = document.querySelectorAll('[data-parallax]');

const syncHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
};

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

navToggle?.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -70px 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

const syncParallax = () => {
  const scrollY = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    item.style.transform = `translate3d(var(--parallax-x, 0px), ${scrollY * speed}px, 0) scale(var(--parallax-scale, 1.08))`;
  });
};

syncParallax();
window.addEventListener('scroll', syncParallax, { passive: true });

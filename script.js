const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const revealItems = document.querySelectorAll('[data-reveal]');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const consultationButtons = document.querySelectorAll('[data-consultation-course]');

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

const createConsultationModal = () => {
  const modal = document.createElement('div');
  modal.className = 'consultation-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="consultation-modal__backdrop" data-close-consultation></div>
    <div class="consultation-modal__panel" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
      <button class="consultation-modal__close" type="button" data-close-consultation aria-label="Close consultation form">×</button>
      <p class="eyebrow emblem-eyebrow"><img src="assets/favicon.png" alt="">Free consultation</p>
      <h2 id="consultation-title">Book a free consultation</h2>
      <p class="consultation-modal__intro">Tell us a little about your organisation and we will pick up the conversation from there.</p>
      <form class="contact-form consultation-form" data-consultation-form>
        <label>Name<input name="name" type="text" required></label>
        <label>Email<input name="email" type="email" required></label>
        <label>Organisation<input name="organisation" type="text"></label>
        <label>Phone<input name="phone" type="tel"></label>
        <label class="full">Subject<input name="subject" type="text" readonly></label>
        <label class="full">Message<textarea name="message" rows="4" placeholder="Tell us about your team, preferred dates, group size or support needs."></textarea></label>
        <button class="button button-gold" type="submit">Send consultation request</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
};

let consultationModal;

const openConsultationModal = (courseName) => {
  consultationModal ||= createConsultationModal();
  const subject = `${courseName} - consultation booking request`;
  consultationModal.querySelector('[name="subject"]').value = subject;
  consultationModal.classList.add('is-open');
  consultationModal.setAttribute('aria-hidden', 'false');
  consultationModal.querySelector('[name="name"]').focus();
};

const closeConsultationModal = () => {
  if (!consultationModal) return;
  consultationModal.classList.remove('is-open');
  consultationModal.setAttribute('aria-hidden', 'true');
};

consultationButtons.forEach((button) => {
  button.addEventListener('click', () => openConsultationModal(button.dataset.consultationCourse));
});

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-consultation]')) {
    closeConsultationModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeConsultationModal();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-consultation-form]');
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const subject = data.get('subject');
  const body = [
    `Name: ${data.get('name') || ''}`,
    `Email: ${data.get('email') || ''}`,
    `Organisation: ${data.get('organisation') || ''}`,
    `Phone: ${data.get('phone') || ''}`,
    '',
    data.get('message') || ''
  ].join('\n');
  window.location.href = `mailto:admin@qolcoe.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  closeConsultationModal();
});
